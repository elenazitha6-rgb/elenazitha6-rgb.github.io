import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/ui";

/**
 * 站点级常量。品牌名、官网地址、运营主体全站只在这里写一次。
 * 品牌写法(取自官网 apps/web 的 SITE):对外统一叫 **AnboVPN**(A 大写、bo 小写、不带空格);
 * 简体 / 繁体中文界面叫「安泊 VPN」。「AnBo」「AnBo VPN」是内部 / 应用商店简称,不要写进对外文案。
 */
export const SITE = {
  name: "AnboVPN",
  nameZh: "安泊 VPN",
  /** 官网。英文无前缀,其它语言带 `/<语言码>` 前缀(和本博客同一套语言码)。 */
  officialUrl: "https://www.anbolink.com",
  company: {
    name: "Anbo Technology LLC",
    email: "service@anbollc.com",
    website: "https://www.anbollc.com/",
  },
  /** 站点默认分享图(1200×630,拷自官网 public/brand/anbo-share.png)。 */
  shareImage: "/brand/anbo-share.png",
  logo: "/brand/anbo-logo-256.png",
} as const;

/** 页头 / 页脚 / 版权行显示的品牌字:中文界面是「安泊 VPN」,其它语言是 AnboVPN。 */
export function brandNameFor(locale: Locale): string {
  return locale === "zh" || locale === "zh-Hant" ? SITE.nameZh : SITE.name;
}

/** 页面标题 = 页面名 + 分隔符 + 品牌后缀(`… | AnboVPN Blog`;中日文用全角竖线)。 */
export function pageTitle(locale: Locale, title: string): string {
  const sep = locale === "zh" || locale === "zh-Hant" || locale === "ja" ? "｜" : " | ";
  return `${title}${sep}${brandNameFor(locale)} ${getMessages(locale).blogName}`;
}

/** 官网里的某一页(带语言前缀)。`placement` 写进 utm_campaign,方便在官网统计里分辨是博客的哪个位置带来的访问。 */
export function officialLink(locale: Locale, path: string, placement: string): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const clean = path === "/" ? "" : path;
  const url = new URL(`${prefix}${clean}`, SITE.officialUrl);
  url.searchParams.set("utm_source", "anbovpn_blog");
  url.searchParams.set("utm_medium", "blog");
  url.searchParams.set("utm_campaign", placement);
  return url.toString();
}

export { CATEGORIES, CATEGORY_GRADIENT, type Category } from "./categories";
