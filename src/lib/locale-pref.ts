import type { Locale } from "@/i18n/config";

/**
 * 语言偏好(沿用「Cookie 记住语言 + 首屏跳转脚本 + 语言提示横幅」的常见做法,改成适合静态站的做法)。
 *
 * 为什么不会影响 SEO(`npm run check:seo` 会查构建产物):
 *   1. 发给所有人(含爬虫)的 HTML 完全一样:不做服务端按语言 / Cookie 的分流,没有 `<meta http-equiv="refresh">`,
 *      canonical、hreflang、sitemap 都不受影响,每个语言版本都是一个独立、可直接访问的 URL。
 *   2. 跳转脚本只出现在**无前缀的默认语言页**上(构建时决定),`/zh/…`、`/ja/…` 这些页面里根本没有它,
 *      既不会循环,也不会污染这些页面的渲染信号。
 *   3. 命中爬虫 UA / 自动化浏览器(`navigator.webdriver`)直接返回;而且只有「用户手动选过语言」才会跳,
 *      爬虫无状态、localStorage 里什么都没有,物理上不会触发(比 UA 名单更硬)。
 *   4. 跳转目标只取这一页「真有对应版本」的语言,不会跳去 404,也不会把读者从文章扔到首页。
 *   5. 首次访问只做「提示」(横幅),不自动跳转——这也是 Google 对多语言站的建议。
 */

/** localStorage 里记「用户手动选过的语言」,值是站内语言码(en / zh / zh-Hant …)。选了英文也记,这样才不会被再跳走。 */
export const LOCALE_STORAGE_KEY = "anbovpn-blog-locale";
/** 关掉语言提示横幅的时间(毫秒时间戳)。 */
export const LOCALE_DISMISS_KEY = "anbovpn-blog-locale-dismissed";
export const LOCALE_DISMISS_DAYS = 14;

/**
 * 不做任何面向真人的语言跳转 / 提示的 UA。来源是常见的爬虫 UA 清单
 * (搜索引擎、SEO 工具、社交预览),再补上 AI 爬虫和无头浏览器。
 */
export const BOT_UA =
  /bot|crawl|spider|slurp|mediapartners|bingpreview|baidu|bing|google|yandex|duckduck|naver|yeti|ahrefs|semrush|sogou|applebot|facebook|twitter|telegram|whatsapp|linkedin|slackbot|embedly|pinterest|quora|outbrain|headless|lighthouse|pagespeed|anthropic|claude|openai|gpt|perplexity|cohere|archive/i;

/**
 * 把浏览器语言偏好(`navigator.languages`,按优先级)规整成站内语言码:
 * 繁体(zh-Hant / zh-TW / zh-HK / zh-MO)和简体(其余 zh-*)分开,其它语言按主语言匹配。
 * 返回第一个站内支持的语言;都不支持返回 null。
 */
export function matchBrowserLocale(tags: readonly string[], supported: readonly Locale[]): Locale | null {
  for (const tag of tags) {
    const t = (tag || "").toLowerCase();
    if (!t) continue;
    let candidate: string;
    if (t === "zh" || t.startsWith("zh-")) candidate = /hant|-tw\b|-hk\b|-mo\b/.test(t) ? "zh-Hant" : "zh";
    else candidate = t.split("-")[0] ?? t;
    const hit = supported.find((l) => l === candidate);
    if (hit) return hit;
  }
  return null;
}

/** 放进 `<script>` 里的 JSON:把 `<` 转义掉,避免提前结束标签。 */
export function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * 默认语言页 `<head>` 最前面的同步内联脚本:用户手动选过某个语言、又打开了默认语言(英文)页面时,
 * 在渲染前跳到这一页的对应版本(保留 query 和 hash)。`targets` 只含这一页真有对应版本的语言。
 * 所有失败路径都吞掉,绝不抛错阻塞首屏。
 */
export function localeRedirectScript(targets: Partial<Record<Locale, string>>): string {
  return (
    `(function(){try{` +
    `if(new RegExp(${safeJson(BOT_UA.source)},"i").test(navigator.userAgent)||navigator.webdriver)return;` +
    `var l=localStorage.getItem(${safeJson(LOCALE_STORAGE_KEY)});` +
    `var t=${safeJson(targets)};` +
    `if(!l||!Object.prototype.hasOwnProperty.call(t,l))return;` +
    `location.replace(t[l]+location.search+location.hash);` +
    `}catch(e){}})();`
  );
}
