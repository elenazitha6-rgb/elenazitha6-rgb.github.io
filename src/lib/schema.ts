import { LOCALE_META, type Locale } from "@/i18n/config";
import { absoluteUrl, localePath } from "@/i18n/paths";
import { getMessages } from "@/i18n/ui";
import type { Post } from "@/lib/posts";
import { SITE, brandNameFor } from "@/site";

/**
 * 结构化数据(JSON-LD)。只写页面上真实存在的内容:
 * - 不写没有依据的 aggregateRating;
 * - 没有站内搜索,所以不声明 SearchAction;
 * - FAQPage 的问答和页面上显示的是同一份 frontmatter 数据,逐字一致。
 */
const CONTEXT = "https://schema.org";

export function orgId(site: URL): string {
  return `${absoluteUrl(site, "/")}#organization`;
}

export function organizationNode(site: URL, locale: Locale): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": orgId(site),
    name: brandNameFor(locale),
    alternateName: locale === "zh" || locale === "zh-Hant" ? SITE.name : SITE.nameZh,
    url: SITE.officialUrl,
    logo: { "@type": "ImageObject", url: absoluteUrl(site, SITE.logo), width: 256, height: 256 },
    legalName: SITE.company.name,
    email: SITE.company.email,
  };
}

export function websiteNode(site: URL, locale: Locale): Record<string, unknown> {
  const m = getMessages(locale);
  return {
    "@type": "WebSite",
    "@id": `${absoluteUrl(site, localePath(locale, "/"))}#website`,
    url: absoluteUrl(site, localePath(locale, "/")),
    name: `${brandNameFor(locale)} ${m.blogName}`,
    description: m.home.metaDescription,
    inLanguage: LOCALE_META[locale].htmlLang,
    publisher: { "@id": orgId(site) },
  };
}

export function blogNode(site: URL, locale: Locale, posts: Post[]): Record<string, unknown> {
  const m = getMessages(locale);
  const url = absoluteUrl(site, localePath(locale, "/"));
  return {
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: `${brandNameFor(locale)} ${m.blogName}`,
    description: m.home.metaDescription,
    inLanguage: LOCALE_META[locale].htmlLang,
    publisher: { "@id": orgId(site) },
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(site, p.path),
      datePublished: p.published.toISOString(),
    })),
  };
}

export function breadcrumbNode(site: URL, items: { name: string; path?: string }[], currentUrl: string): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path ? absoluteUrl(site, item.path) : currentUrl,
    })),
  };
}

export function blogPostingNode(site: URL, post: Post, categoryName: string): Record<string, unknown> {
  const url = absoluteUrl(site, post.path);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: post.description,
    datePublished: post.published.toISOString(),
    dateModified: post.modified.toISOString(),
    inLanguage: LOCALE_META[post.locale].htmlLang,
    image: [absoluteUrl(site, SITE.shareImage)],
    author: { "@type": "Organization", name: brandNameFor(post.locale), url: SITE.officialUrl },
    publisher: { "@id": orgId(site) },
    articleSection: categoryName,
    keywords: post.tags.join(", "),
    isAccessibleForFree: true,
    // 答案引擎 / 语音助手优先朗读的部分:标题和页面上的「简短回答」。
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-geo-summary]"] },
  };
}

export function faqNode(items: { q: string; a: string }[]): Record<string, unknown> | null {
  if (items.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

/** 把若干节点包成一个 @graph。 */
export function graph(nodes: (Record<string, unknown> | null)[]): Record<string, unknown> {
  return { "@context": CONTEXT, "@graph": nodes.filter((n): n is Record<string, unknown> => n !== null) };
}
