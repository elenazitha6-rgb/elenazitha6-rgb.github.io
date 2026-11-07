import rss from "@astrojs/rss";
import type { APIContext, GetStaticPaths } from "astro";
import { LOCALE_META, type Locale } from "@/i18n/config";
import { absoluteUrl, langParam, localePath } from "@/i18n/paths";
import { getMessages } from "@/i18n/ui";
import { getContentLocales, getPosts } from "@/lib/posts";
import { brandNameFor } from "@/site";

/** 每种语言一个 RSS(`/feed.xml`、`/zh/feed.xml` ……),最新 30 篇;页面 <head> 里有自动发现的 <link rel="alternate">。 */
export const getStaticPaths = (async () => {
  const locales = await getContentLocales();
  return locales.map((locale) => ({ params: { lang: langParam(locale) }, props: { locale } }));
}) satisfies GetStaticPaths;

export async function GET(context: APIContext) {
  const { locale } = context.props as { locale: Locale };
  const site = context.site!;
  const m = getMessages(locale);
  const posts = (await getPosts(locale)).slice(0, 30);
  const selfUrl = absoluteUrl(site, localePath(locale, "/feed.xml"));

  return rss({
    title: `${brandNameFor(locale)} ${m.blogName}`,
    description: m.home.metaDescription,
    site,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: `<language>${LOCALE_META[locale].htmlLang}</language><atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />`,
    items: posts.map((p) => ({
      title: p.title,
      description: p.description,
      pubDate: p.published,
      link: p.path,
      categories: [m.categories[p.category].name],
    })),
  });
}
