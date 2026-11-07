import type { APIRoute } from "astro";
import { CATEGORIES } from "@/categories";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from "@/i18n/config";
import { absoluteUrl, localePath } from "@/i18n/paths";
import { getAllPosts, getContentLocales } from "@/lib/posts";

/**
 * 自己生成 sitemap(不用集成),为了精确控制三件事:
 * - `lastmod` 只用文章自己的更新时间,固定页面不写(写成构建时间会让搜索引擎学会忽略这个字段);
 * - hreflang 只互链真有对应版本的语言,`x-default` 指英文;
 * - 没有内容的语言不出现。
 */
interface Group {
  /** 不带语言前缀的路径。 */
  path: string;
  locales: Locale[];
  lastmod?: Date;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async ({ site }) => {
  const origin = site!;
  const all = await getAllPosts();
  const contentLocales = await getContentLocales();
  const latest = (posts: { modified: Date }[]) => posts.reduce<Date | undefined>((acc, p) => (!acc || p.modified > acc ? p.modified : acc), undefined);

  const groups: Group[] = [
    { path: "/", locales: contentLocales, lastmod: latest(all) },
    { path: "/about/", locales: contentLocales },
  ];

  for (const category of CATEGORIES) {
    const inCategory = all.filter((p) => p.category === category);
    const locales = LOCALES.filter((l) => inCategory.some((p) => p.locale === l));
    if (locales.length) groups.push({ path: `/topics/${category}/`, locales, lastmod: latest(inCategory) });
  }

  const slugs = [...new Set(all.map((p) => p.slug))];
  for (const slug of slugs) {
    const versions = all.filter((p) => p.slug === slug);
    const locales = LOCALES.filter((l) => versions.some((p) => p.locale === l));
    groups.push({ path: `/posts/${slug}/`, locales, lastmod: latest(versions) });
  }

  const urls = groups.flatMap((g) =>
    g.locales.map((locale) => {
      const loc = absoluteUrl(origin, localePath(locale, g.path));
      const alternates =
        g.locales.length > 1
          ? [
              ...g.locales.map((l) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[l].htmlLang}" href="${esc(absoluteUrl(origin, localePath(l, g.path)))}" />`),
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(absoluteUrl(origin, localePath(g.locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : g.locales[0]!, g.path)))}" />`,
            ].join("\n")
          : "";
      return `  <url>\n    <loc>${esc(loc)}</loc>${g.lastmod ? `\n    <lastmod>${g.lastmod.toISOString()}</lastmod>` : ""}${alternates ? `\n${alternates}` : ""}\n  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
