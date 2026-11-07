import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from "./config";

/**
 * 站内地址一律走这里拼,不要在页面里手写 `/zh/...`。
 * 英文(默认语言)无前缀;其它语言带 `/<语言码>` 前缀。所有地址以 `/` 结尾(和 astro.config 的 trailingSlash 一致)。
 */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withSlash = clean.endsWith("/") || /\.[a-z0-9]+$/i.test(clean) ? clean : `${clean}/`;
  if (locale === DEFAULT_LOCALE) return withSlash;
  return withSlash === "/" ? `/${locale}/` : `/${locale}${withSlash}`;
}

/** 绝对地址(canonical、sitemap、OG、结构化数据用)。 */
export function absoluteUrl(site: URL | string, path: string): string {
  return new URL(path, site).toString();
}

/** `/zh/posts/x/` → `{ locale: "zh", path: "/posts/x/" }`;无前缀的就是默认语言。 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first = "", ...rest] = pathname.split("/");
  if ((LOCALES as readonly string[]).includes(first) && first !== DEFAULT_LOCALE) {
    const path = `/${rest.join("/")}`;
    return { locale: first as Locale, path: path === "/" || path === "" ? "/" : path };
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}

/** 供 `getStaticPaths` 用:默认语言的 `[...lang]` 参数是 undefined(落在根路径),其它语言是语言码。 */
export function langParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale;
}

export function htmlLangOf(locale: Locale): string {
  return LOCALE_META[locale].htmlLang;
}
