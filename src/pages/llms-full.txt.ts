import type { APIRoute } from "astro";
import { LOCALES, LOCALE_META } from "@/i18n/config";
import { postToMarkdown } from "@/lib/markdown";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/site";

/** /llms-full.txt:每个语言最新 30 篇的全文 Markdown(含发布 / 更新日期、简短回答和 FAQ)。 */
const PER_LOCALE = 30;

export const GET: APIRoute = async ({ site }) => {
  const origin = site!;
  const all = await getAllPosts();
  const parts: string[] = [`# ${SITE.name} Blog: full text\n\n> Published by the ${SITE.name} team (${SITE.company.name}). Official website: ${SITE.officialUrl}\n`];

  for (const locale of LOCALES) {
    const posts = all.filter((p) => p.locale === locale).slice(0, PER_LOCALE);
    if (posts.length === 0) continue;
    parts.push(`\n---\n\n# ${LOCALE_META[locale].name}\n`);
    // 每篇文章的标题降到 H2、正文小节降到 H3,不和语言标题冲突
    for (const p of posts) parts.push(`\n${postToMarkdown(p, origin, { headingLevel: 2 })}`);
  }

  return new Response(parts.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
