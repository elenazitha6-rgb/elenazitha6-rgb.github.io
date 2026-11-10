// SEO 不变量检查:`npm run check:seo`,在 `npm run build` 之后跑,检查的是构建产物 dist/(不是源码)。
// 有错误退出码 1。检查的都是「搜索引擎一旦判定不可信就整组失效」的东西:
// hreflang 互链、canonical、sitemap 和实际页面是否一致、站内链接和资源是否 404、结构化数据和页面可见内容是否一致。
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const origin = (process.env.SITE_URL || "https://elenazitha6-rgb.github.io").replace(/\/$/, "");
const LOCALES = ["en", "zh", "zh-Hant", "ja", "ru", "fa", "tr"];
const HTML_LANG = { en: "en", zh: "zh-Hans", "zh-Hant": "zh-Hant", ja: "ja", ru: "ru", fa: "fa", tr: "tr" };

if (!existsSync(dist)) {
  console.error("找不到 dist/,先跑 npm run build");
  process.exit(1);
}

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const decode = (s) => s.replace(/&amp;|&#x26;|&#38;/g, "&").replace(/&quot;|&#x22;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
// 正文经过 smartypants,页面上的直引号 / 省略号会变成弯引号 / …;比较「结构化数据里的文字是否在页面上」时先抹平
const flat = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, "...").replace(/\s+/g, " ");
// 行内标签(链接、强调、代码)去掉时不留空格,块级标签换成空格:这样才和页面上读到的文字一致
const INLINE = "a|strong|em|b|i|code|span|time|mark|abbr|sub|sup";
const strip = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(new RegExp(`</?(?:${INLINE})(?:\\s[^>]*)?>`, "g"), "")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
const files = walk(dist).map((f) => path.relative(dist, f).split(path.sep).join("/"));
const fileSet = new Set(files);

/** URL 路径 → dist 里对应的文件;不存在返回 undefined。 */
function resolveUrlPath(urlPath) {
  const p = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const rel = p.replace(/^\//, "");
  if (rel === "") return fileSet.has("index.html") ? "index.html" : undefined;
  if (fileSet.has(rel)) return rel;
  if (p.endsWith("/") && fileSet.has(`${rel}index.html`)) return `${rel}index.html`;
  return undefined;
}

const urlOf = (file) => (file === "index.html" ? "/" : `/${file.replace(/index\.html$/, "")}`);
const localeOf = (urlPath) => {
  const first = urlPath.split("/")[1];
  return LOCALES.slice(1).includes(first) ? first : "en";
};

const pages = files
  .filter((f) => f.endsWith(".html") && f !== "404.html")
  .map((file) => {
    const html = readFileSync(path.join(dist, file), "utf8");
    const url = urlOf(file);
    const meta = (re) => decode(html.match(re)?.[1] ?? "");
    const robots = meta(/<meta name="robots" content="([^"]*)"/);
    return {
      file,
      url,
      html,
      locale: localeOf(url),
      title: decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""),
      description: meta(/<meta name="description" content="([^"]*)"/),
      canonical: meta(/<link rel="canonical" href="([^"]*)"/),
      robots,
      noindex: /noindex/.test(robots),
      h1: (html.match(/<h1[\s>]/g) ?? []).length,
      hreflangs: [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: decode(m[2]) })),
      ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
    };
  });
const byUrl = new Map(pages.map((p) => [p.url, p]));

const toPath = (href) => {
  if (href.startsWith(origin)) return href.slice(origin.length) || "/";
  return href;
};

// ---------- 逐页检查 ----------
const titles = new Map();
const descriptions = new Map();
for (const p of pages) {
  const where = p.url;
  if (p.h1 !== 1) err(where, `<h1> 必须恰好一个,现在 ${p.h1}`);
  if (!p.title) err(where, "缺少 <title>");
  if (!p.description) err(where, "缺少 meta description");
  else if ([...p.description].length > 160) err(where, `meta description ${[...p.description].length} 字符,不能超过 160`);
  titles.set(p.title, [...(titles.get(p.title) ?? []), where]);
  descriptions.set(p.description, [...(descriptions.get(p.description) ?? []), where]);

  const lang = p.html.match(/<html lang="([^"]+)"( dir="([^"]+)")?/);
  if (lang?.[1] !== HTML_LANG[p.locale]) err(where, `<html lang> 应为 ${HTML_LANG[p.locale]},现在 ${lang?.[1]}`);
  if ((lang?.[3] ?? "ltr") !== (p.locale === "fa" ? "rtl" : "ltr")) err(where, `<html dir> 不对:${lang?.[3]}`);

  // 语言偏好(记住选择 + 跳转 + 提示)只能是客户端行为,不能有任何服务端式的跳转信号
  if (/<meta[^>]+http-equiv=["']?refresh/i.test(p.html)) err(where, "不要用 <meta http-equiv=refresh> 做跳转(搜索引擎会当成重定向)");

  if (p.noindex) {
    if (/anbovpn-blog-locale/.test(p.html.replace(/<script type="module"[\s\S]*?<\/script>/g, ""))) err(where, "noindex 页面不该带语言跳转脚本");
    continue;
  }

  if (p.canonical !== `${origin}${p.url}`) err(where, `canonical 应为 ${origin}${p.url},现在 ${p.canonical || "(没有)"}`);

  // hreflang:包含自己、每个目标真实存在且互链、有 x-default
  if (p.hreflangs.length > 0) {
    const self = p.hreflangs.find((h) => h.lang === HTML_LANG[p.locale]);
    if (!self || toPath(self.href) !== p.url) err(where, "hreflang 里缺少指向自己的条目");
    if (p.hreflangs.length > 1 && !p.hreflangs.some((h) => h.lang === "x-default")) err(where, "缺少 hreflang x-default");
    for (const h of p.hreflangs) {
      const target = byUrl.get(toPath(h.href));
      if (!target) {
        err(where, `hreflang ${h.lang} 指向不存在的页面 ${h.href}`);
        continue;
      }
      if (h.lang !== "x-default" && !target.hreflangs.some((back) => toPath(back.href) === p.url)) err(where, `hreflang ${h.lang} 的目标 ${target.url} 没有互链回来`);
    }
  }

  // 语言跳转脚本(src/lib/locale-pref.ts):
  // ① 只出现在无前缀的默认语言页;② 必须同时有爬虫 / 自动化浏览器护栏和「读 localStorage」(没选过语言的人、爬虫都不会触发);
  // ③ 目标页必须真实存在、而且就是本页 hreflang 里列出的对应版本(不跳去 404,不把读者从文章扔到首页)。
  const hreflangPaths = new Set(p.hreflangs.filter((h) => h.lang !== "x-default").map((h) => toPath(h.href)));
  const scripts = [...p.html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const jumps = scripts.filter((s) => s.includes("location.replace") && s.includes("anbovpn-blog-locale"));
  if (jumps.length > 0 && p.locale !== "en") err(where, "语言跳转脚本只能出现在无前缀的默认语言页上");
  if (jumps.length > 1) err(where, "语言跳转脚本重复");
  for (const s of jumps) {
    if (!/navigator\.userAgent/.test(s) || !/navigator\.webdriver/.test(s)) err(where, "语言跳转脚本缺少爬虫 / 自动化浏览器护栏");
    if (!/localStorage\.getItem/.test(s) || !/if\(!l\|\|/.test(s)) err(where, "语言跳转脚本必须只在「用户手动选过语言」时才跳");
    let targets = {};
    try {
      targets = JSON.parse(s.match(/var t=(\{.*?\});/)?.[1] ?? "{}");
    } catch {
      err(where, "语言跳转脚本的目标表不是合法 JSON");
    }
    for (const [lang, target] of Object.entries(targets)) {
      if (lang === p.locale) err(where, `语言跳转脚本不该跳到自己的语言 ${lang}`);
      if (!resolveUrlPath(target)) err(where, `语言跳转目标 404:${target}`);
      else if (!hreflangPaths.has(target)) err(where, `语言跳转目标不是本页 hreflang 里的对应版本:${target}`);
    }
  }
  // 首次访问的提示横幅:只提示不跳转;每个目标同样必须是本页的对应版本
  for (const m of p.html.matchAll(/<script type="application\/json" data-locale-hints>([\s\S]*?)<\/script>/g)) {
    let hints = {};
    try {
      hints = JSON.parse(m[1]);
    } catch {
      err(where, "语言提示的数据不是合法 JSON");
    }
    for (const [lang, hint] of Object.entries(hints)) {
      if (lang === p.locale) err(where, `语言提示不该提示自己的语言 ${lang}`);
      if (!resolveUrlPath(hint.href)) err(where, `语言提示目标 404:${hint.href}`);
      else if (!hreflangPaths.has(hint.href)) err(where, `语言提示目标不是本页 hreflang 里的对应版本:${hint.href}`);
    }
  }

  // 站内链接和资源不能 404;页内锚点必须存在
  for (const m of p.html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
    const href = decode(m[1]);
    if (/^(mailto:|tel:|javascript:)/.test(href)) continue;
    if (href.startsWith("#")) {
      if (href.length > 1 && !p.ids.has(decodeURIComponent(href.slice(1)))) err(where, `页内锚点 ${href} 没有对应的 id`);
      continue;
    }
    const internal = href.startsWith("/") || href.startsWith(origin);
    if (!internal) continue;
    if (!resolveUrlPath(toPath(href))) err(where, `站内链接 404:${href}`);
  }
  for (const m of p.html.matchAll(/<(?:img|script|source)\s[^>]*?src="(\/[^"]+)"|<link\s[^>]*?href="(\/[^"]+)"/g)) {
    const src = decode(m[1] ?? m[2]);
    if (!resolveUrlPath(src)) err(where, `资源 404:${src}`);
  }
  const ogImage = decode(p.html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? "");
  if (!ogImage) err(where, "缺少 og:image");
  else if (!resolveUrlPath(toPath(ogImage))) err(where, `og:image 指向的文件不存在:${ogImage}`);

  if (/\/(zh|zh-Hant|ja|ru|fa|tr)\/\1\//.test(p.html.replace(/https?:\/\/(?!(?:elenazitha6-rgb\.github\.io))[^"'\s]+/g, ""))) err(where, "出现了重复的语言前缀(/zh/zh/ 这类)");
  if (/localhost|127\.0\.0\.1/.test(p.html)) err(where, "页面里出现了 localhost");

  // 结构化数据:能解析;文章的日期是带时区的 ISO 8601;FAQ / 术语定义和页面可见内容一致
  const visible = flat(strip(p.html));
  for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      err(where, `JSON-LD 不是合法 JSON:${e.message}`);
      continue;
    }
    const nodes = (Array.isArray(data) ? data : [data]).flatMap((d) => d["@graph"] ?? [d]);
    for (const node of nodes) {
      if (node["@type"] === "BlogPosting") {
        for (const key of ["datePublished", "dateModified"]) {
          if (!/^\d{4}-\d\d-\d\dT[\d:.]+(Z|[+-]\d\d:\d\d)$/.test(node[key] ?? "")) err(where, `${key} 必须是带时区的 ISO 8601,现在 ${node[key]}`);
        }
        if (!node.headline || !node.image || !node.publisher) err(where, "BlogPosting 缺少 headline / image / publisher");
      }
      if (node["@type"] === "FAQPage") {
        for (const q of node.mainEntity ?? []) {
          if (!visible.includes(flat(q.name))) err(where, `FAQPage 的问题在页面上看不到:${q.name}`);
          if (!visible.includes(flat(q.acceptedAnswer?.text ?? ""))) err(where, `FAQPage 的答案在页面上看不到:${q.name}`);
        }
      }
      if (node["@type"] === "DefinedTerm" && node.description && !visible.includes(flat(node.description))) err(where, `DefinedTerm 的定义在页面上看不到:${node.name}`);
      if (node.aggregateRating || node["@type"] === "SearchAction") err(where, `不要输出没有依据的结构化数据:${node["@type"] ?? "aggregateRating"}`);
    }
  }

  if (/\/posts\/[^/]+\/$/.test(p.url)) {
    const md = p.html.match(/<link rel="alternate" type="text\/markdown" href="([^"]+)"/)?.[1];
    if (!md) err(where, "文章页缺少纯 Markdown 版本的 <link rel=alternate>");
    else if (!resolveUrlPath(toPath(decode(md)))) err(where, `纯 Markdown 版本不存在:${md}`);
  }
}
for (const [what, map] of [["title", titles], ["description", descriptions]]) {
  for (const [text, urls] of map) if (urls.length > 1) warn(urls.join(", "), `${what} 重复:${text.slice(0, 60)}`);
}

// ---------- sitemap 和页面一一对应 ----------
const sitemap = existsSync(path.join(dist, "sitemap.xml")) ? readFileSync(path.join(dist, "sitemap.xml"), "utf8") : "";
if (!sitemap) err("sitemap.xml", "不存在");
const locs = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
if (new Set(locs).size !== locs.length) err("sitemap.xml", "有重复的 <loc>");
for (const loc of locs) {
  const page = byUrl.get(toPath(loc));
  if (!loc.startsWith(origin)) err("sitemap.xml", `<loc> 不是本站地址:${loc}`);
  else if (!page) err("sitemap.xml", `<loc> 指向不存在的页面:${loc}`);
  else if (page.noindex) err("sitemap.xml", `<loc> 指向 noindex 的页面:${loc}`);
}
const inSitemap = new Set(locs.map(toPath));
for (const p of pages) if (!p.noindex && !inSitemap.has(p.url)) err(p.url, "可索引的页面没有出现在 sitemap 里");
if (/<lastmod>/.test(sitemap) && /<url>\s*<loc>[^<]+\/about\/<\/loc>\s*<lastmod>/.test(sitemap)) err("sitemap.xml", "固定页面不该写 lastmod(写成构建时间会让搜索引擎忽略这个字段)");

// ---------- robots.txt / llms.txt / 404 ----------
const robots = existsSync(path.join(dist, "robots.txt")) ? readFileSync(path.join(dist, "robots.txt"), "utf8") : "";
if (!/^Sitemap: /m.test(robots)) err("robots.txt", "缺少 Sitemap 行");
const agents = [...robots.matchAll(/^User-agent:\s*(.+)$/gim)].map((m) => m[1].trim());
if (agents.some((a) => a !== "*")) err("robots.txt", `不要给具名爬虫单开分组(会绕过 * 组的规则):${agents.join(", ")}`);
if (/^Disallow:\s*\/\s*$/m.test(robots)) err("robots.txt", "Disallow: / 会屏蔽整站");

for (const file of ["llms.txt", "llms-full.txt"]) {
  if (!fileSet.has(file)) err(file, "不存在");
}
const llms = existsSync(path.join(dist, "llms.txt")) ? readFileSync(path.join(dist, "llms.txt"), "utf8") : "";
for (const [, url] of llms.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
  if (url.startsWith(origin) && !resolveUrlPath(toPath(url))) err("llms.txt", `链接 404:${url}`);
}
if (fileSet.has("404.html")) {
  const html = readFileSync(path.join(dist, "404.html"), "utf8");
  if (!/noindex/.test(html)) err("404.html", "404 页必须 noindex");
  if (/<link rel="canonical"|<link rel="alternate" hreflang/.test(html)) err("404.html", "404 页不输出 canonical / hreflang");
} else err("404.html", "不存在(GitHub Pages 靠它显示 404)");

for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✗ ${e}`);
console.log(`\n检查了 ${pages.length} 个页面、${locs.length} 个 sitemap 条目:${errors.length} 个错误,${warnings.length} 个提醒`);
process.exit(errors.length ? 1 : 0);
