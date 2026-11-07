import type { APIRoute } from "astro";
import { LOCALES, LOCALE_META } from "@/i18n/config";
import { absoluteUrl, localePath } from "@/i18n/paths";
import { getMessages } from "@/i18n/ui";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/site";

/**
 * /llms.txt:给大模型 / 答案引擎看的站点索引(llmstxt.org 格式)——按语言列出全部文章和一句话摘要,
 * 并链到 /llms-full.txt(全文 Markdown)。
 */
export const GET: APIRoute = async ({ site }) => {
  const origin = site!;
  const all = await getAllPosts();
  const en = getMessages("en");

  const sections = LOCALES.flatMap((locale) => {
    const posts = all.filter((p) => p.locale === locale);
    if (posts.length === 0) return [];
    const lines = posts.map((p) => `- [${p.title}](${absoluteUrl(origin, p.path)}): ${p.description}`);
    return [`## ${LOCALE_META[locale].name}\n\n${lines.join("\n")}`];
  });

  const body = [
    `# ${SITE.name} Blog`,
    "",
    `> ${en.home.metaDescription}`,
    "",
    `Published by the ${SITE.name} team (${SITE.company.name}). Official website: ${SITE.officialUrl}`,
    "",
    ...sections.flatMap((s) => [s, ""]),
    "## Full text",
    "",
    `- [llms-full.txt](${absoluteUrl(origin, "/llms-full.txt")}): every article as Markdown, including FAQs`,
    `- [RSS feed](${absoluteUrl(origin, localePath("en", "/feed.xml"))}): latest articles`,
    `- [Sitemap](${absoluteUrl(origin, "/sitemap.xml")})`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
