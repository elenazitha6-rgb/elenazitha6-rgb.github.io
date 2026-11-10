import type { APIRoute } from "astro";
import { CATEGORIES } from "@/categories";
import { LOCALES, LOCALE_META } from "@/i18n/config";
import { absoluteUrl, localePath } from "@/i18n/paths";
import { getMessages } from "@/i18n/ui";
import { getAllPosts, topicPath } from "@/lib/posts";
import { SITE } from "@/site";

/**
 * /llms.txt:给大模型 / 答案引擎看的站点索引(llmstxt.org 格式)。
 * 结构:一句话简介 → 关于 / 写作方法 → 主要页面(专题、关于)→ 各语言的文章(链到纯 Markdown 版本)→ 订阅与全文。
 * 只列真实存在的页面,由路由数据生成,不手写。
 */
export const GET: APIRoute = async ({ site }) => {
  const origin = site!;
  const all = await getAllPosts();
  const en = getMessages("en");
  const enPosts = all.filter((p) => p.locale === "en");

  // 全部文章下线(都是 draft)时,首页 / 关于 / RSS 都不会生成,不能再往这些地址放链接(check:seo 会报 404)
  if (all.length === 0) {
    const offline = [`# ${SITE.name} Blog`, "", "> This blog is currently offline.", "", `- [${SITE.name} official website](${SITE.officialUrl}): products, plans and pricing`, ""].join("\n");
    return new Response(offline, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const topics = CATEGORIES.filter((c) => enPosts.some((p) => p.category === c)).map(
    (c) => `- [${en.categories[c].name}](${absoluteUrl(origin, topicPath("en", c))}): ${en.categories[c].description}`,
  );

  const articles = LOCALES.flatMap((locale) => {
    const posts = all.filter((p) => p.locale === locale);
    if (posts.length === 0) return [];
    // 链到每篇文章的纯 Markdown 版本(/posts/<slug>.md);同一内容的网页版是去掉 .md 的同名地址
    const lines = posts.map((p) => `- [${p.title}](${absoluteUrl(origin, p.path.replace(/\/$/, ".md"))}): ${p.description}`);
    return [`### ${LOCALE_META[locale].name}\n\n${lines.join("\n")}`];
  });

  const body = [
    `# ${SITE.name} Blog`,
    "",
    `> ${en.home.metaDescription}`,
    "",
    "## About this site",
    "",
    `The official blog of ${SITE.name}, published by ${SITE.company.name}. Articles explain Dedicated IPs, shared IPs, ISP residential IPs, HTTP/SOCKS5 proxies, network gateways and AI-optimized routes in plain language. Each article starts with a short answer, shows when it was published and last checked, links to primary sources (RFCs, official documentation) for technical claims, and never promises speed, latency, uptime or access to any specific platform. Product facts come from the official website (${SITE.officialUrl}), which is the source of truth for plans and prices. English is the source language; articles are also available in Simplified Chinese, Traditional Chinese, Japanese, Russian, Persian and Turkish.`,
    "",
    "## Main pages",
    "",
    `- [Latest articles](${absoluteUrl(origin, localePath("en", "/"))}): all articles, newest first`,
    ...topics,
    `- [About the blog](${absoluteUrl(origin, localePath("en", "/about/"))}): who writes it, how articles are checked, disclosure and contact`,
    `- [${SITE.name} official website](${SITE.officialUrl}): products, plans and pricing`,
    "",
    "## Articles",
    "",
    ...articles.flatMap((s) => [s, ""]),
    "## Feeds and full text",
    "",
    `- [llms-full.txt](${absoluteUrl(origin, "/llms-full.txt")}): every article as Markdown, including FAQs`,
    `- [RSS feed](${absoluteUrl(origin, localePath("en", "/feed.xml"))}): latest articles (one feed per language)`,
    `- [Sitemap](${absoluteUrl(origin, "/sitemap.xml")})`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
