/**
 * 语言配置:7 种语言,和官网 / 其它技术博客同一套语言码。
 * - 英文是默认语言,URL 不带前缀(`/`、`/posts/x/`),其它语言带前缀(`/zh/`、`/ja/posts/x/`)。
 * - 语言码同时是文章目录名(`src/content/posts/<语言码>/<slug>.md`)。繁体是 `zh-Hant`,不是 `zh-TW`。
 * - 没有译文的语言不会生成对应页面:列表只列该语言已有的文章,hreflang 只指向真有译文的语言。
 */
export const LOCALES = ["en", "zh", "zh-Hant", "ja", "ru", "fa", "tr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export interface LocaleMeta {
  /** 语言菜单里显示的本语言名称。 */
  name: string;
  /** `<html lang>` 和结构化数据 `inLanguage`。 */
  htmlLang: string;
  /** 文字方向,波斯语从右到左。 */
  dir: "ltr" | "rtl";
  /** Open Graph 的 `og:locale`。 */
  ogLocale: string;
  /** 日期格式化用的 BCP 47 码。 */
  dateLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { name: "English", htmlLang: "en", dir: "ltr", ogLocale: "en_US", dateLocale: "en-US" },
  zh: { name: "简体中文", htmlLang: "zh-Hans", dir: "ltr", ogLocale: "zh_CN", dateLocale: "zh-CN" },
  "zh-Hant": { name: "繁體中文", htmlLang: "zh-Hant", dir: "ltr", ogLocale: "zh_TW", dateLocale: "zh-TW" },
  ja: { name: "日本語", htmlLang: "ja", dir: "ltr", ogLocale: "ja_JP", dateLocale: "ja-JP" },
  ru: { name: "Русский", htmlLang: "ru", dir: "ltr", ogLocale: "ru_RU", dateLocale: "ru-RU" },
  fa: { name: "فارسی", htmlLang: "fa", dir: "rtl", ogLocale: "fa_IR", dateLocale: "fa-IR" },
  tr: { name: "Türkçe", htmlLang: "tr", dir: "ltr", ogLocale: "tr_TR", dateLocale: "tr-TR" },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
