import { formatDate } from "@/i18n/format";
import { absoluteUrl } from "@/i18n/paths";
import { getMessages } from "@/i18n/ui";
import type { Post } from "@/lib/posts";
import { SITE, brandNameFor } from "@/site";

/**
 * 文章的纯 Markdown 版本:`/posts/<slug>.md`(每种语言前缀下各一份)和 `/llms-full.txt` 共用。
 * 大模型 / 答案引擎抓干净的 Markdown 比抓带导航和脚本的 HTML 更容易引用,每篇文章页的 <head> 里有指向它的
 * `<link rel="alternate" type="text/markdown">`,`/llms.txt` 也链到它。
 * 内容和页面上显示的完全一致:标题、简短回答、发布 / 更新日期、正文、FAQ。
 */
export function postToMarkdown(post: Post, site: URL, { headingLevel = 1 }: { headingLevel?: 1 | 2 } = {}): string {
  const m = getMessages(post.locale);
  const h = "#".repeat(headingLevel);
  const sub = "#".repeat(headingLevel + 1);
  const meta = [
    `URL: ${absoluteUrl(site, post.path)}`,
    `${m.post.published}: ${formatDate(post.published, post.locale)}`,
    post.showUpdated ? `${m.post.updated}: ${formatDate(post.modified, post.locale)}` : null,
    `${m.post.by} ${m.team} (${brandNameFor(post.locale)}, ${SITE.company.name})`,
    m.categories[post.category].name,
  ].filter(Boolean);

  // 正文里的 H2 在单篇文件里保持 H2;合并进 llms-full.txt 时整体下移一级,不和语言标题冲突。
  const body = headingLevel === 1 ? post.body.trim() : post.body.trim().replace(/^(#{2,5}) /gm, "#$1 ");
  const faq = post.faq.length
    ? `\n\n${sub} ${m.post.faq}\n\n${post.faq.map((f) => `${"#".repeat(headingLevel + 2)} ${f.q}\n\n${f.a}`).join("\n\n")}`
    : "";

  return `${h} ${post.title}\n\n${meta.join("  \n")}\n\n> ${post.description}\n\n${body}${faq}\n`;
}

/** 纯文本摘录(去掉 Markdown 标记和代码块),结构化数据的 articleBody 用。 */
export function plainText(markdown: string, maxLength = 5000): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*\|?[-:| ]{3,}\|?\s*$/gm, " ")
    .replace(/[#>*_`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

/** 正文里指向外部来源(非官网、非本站)的链接,结构化数据的 citation 用。 */
export function externalCitations(markdown: string): { name: string; url: string }[] {
  const seen = new Set<string>();
  const out: { name: string; url: string }[] = [];
  for (const [, name, url] of markdown.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) {
    const host = new URL(url!).hostname;
    if (host.endsWith("anbovpn.com") || seen.has(url!)) continue;
    seen.add(url!);
    out.push({ name: name!, url: url! });
  }
  return out;
}
