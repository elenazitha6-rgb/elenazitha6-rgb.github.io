// 内容检查:`npm run check:content`。在构建前跑,发现问题直接退出码 1。
// 检查文章 frontmatter 的长度和字段、FAQ 数量、各语言译文是否齐全且和英文一致、
// 站内链接 / 官网链接的语言前缀、以及不能出现在对外文案里的说法(见 CLAUDE.md)。
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "src/content/posts");
const LOCALES = ["en", "zh", "zh-Hant", "ja", "ru", "fa", "tr"];
const CJK = new Set(["zh", "zh-Hant", "ja"]);
const CATEGORIES = ["ip-types", "proxies", "gateway", "ai"];

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

/** 对外文案里不能出现的写法(正则,不区分大小写)。 */
const FORBIDDEN = [
  { re: /\bAnBo(?:VPN| VPN)?\b/, why: "品牌写法是 AnboVPN(中文「安泊 VPN」),AnBo / AnBo VPN 是内部简称" },
  { re: /安博/, why: "中文名是「安泊 VPN」,不是「安博」" },
  { re: /翻墙|梯子|科学上网/, why: "不用这类说法" },
  { re: /\b(fixed IP|proxy IP|transparent gateway|home broadband|network exit)\b/i, why: "英文用行业通用说法:Dedicated IP / HTTP/SOCKS5 proxy / Network gateway / ISP residential IP(见 CLAUDE.md 术语表)", only: ["en"] },
  { re: /\b(unblock|bypass|evade|circumvent)\w*/i, why: "不写「解锁 / 绕过 / 规避」这类说法", only: ["en"] },
];

const posts = [];
for (const locale of readdirSync(postsDir)) {
  if (!LOCALES.includes(locale)) {
    err(`posts/${locale}`, `未知的语言目录(允许:${LOCALES.join(", ")})`);
    continue;
  }
  for (const file of readdirSync(path.join(postsDir, locale)).filter((f) => f.endsWith(".md"))) {
    const rel = `posts/${locale}/${file}`;
    const raw = readFileSync(path.join(postsDir, locale, file), "utf8");
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      err(rel, "缺少 frontmatter");
      continue;
    }
    let data;
    try {
      data = parse(match[1]);
    } catch (e) {
      err(rel, `frontmatter 不是合法 YAML:${e.message}`);
      continue;
    }
    posts.push({ locale, slug: file.replace(/\.md$/, ""), rel, data, body: match[2] });
  }
}

for (const p of posts) {
  const { rel, data, locale, body } = p;
  const cjk = CJK.has(locale);

  if (typeof data.title !== "string") err(rel, "缺少 title");
  if (typeof data.description !== "string") err(rel, "缺少 description");
  if (!CATEGORIES.includes(data.category)) err(rel, `category 必须是 ${CATEGORIES.join(" / ")}`);
  if (!data.pubDate) err(rel, "缺少 pubDate");

  if (typeof data.description === "string") {
    const n = [...data.description].length;
    if (n > 160) err(rel, `description ${n} 字符,不能超过 160`);
    const min = cjk ? 110 : 140;
    if (n < min) warn(rel, `description ${n} 字符,建议至少 ${min}`);
  }
  if (typeof data.title === "string") {
    const n = [...data.title].length;
    const max = cjk ? 34 : 62;
    if (n > max) warn(rel, `title ${n} 字符,加上品牌后缀容易超过搜索结果显示的宽度(建议 ≤ ${max})`);
  }
  const faq = data.faq ?? [];
  if (faq.length < 3) err(rel, `FAQ 至少 3 条,现在 ${faq.length}`);
  for (const [i, item] of faq.entries()) {
    if (!item?.q || !item?.a) err(rel, `FAQ 第 ${i + 1} 条缺 q 或 a`);
  }

  // 正文必须以 H2 开头的章节组织,第一段给结论;至少 3 个 H2
  const prose = body.replace(/```[\s\S]*?```/g, ""); // 代码块里的 # 是注释,不是标题
  const h2 = prose.match(/^## .+$/gm) ?? [];
  if (h2.length < 3) warn(rel, `H2 只有 ${h2.length} 个`);
  if (/^# /m.test(prose)) err(rel, "正文里不要用 H1(标题由 frontmatter 的 title 输出)");

  // 链接:站内文章链接要带本语言前缀;官网链接要带本语言前缀(/ip 例外)
  const prefix = locale === "en" ? "" : `/${locale}`;
  for (const [, href] of body.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (href.startsWith("/")) {
      const m = href.match(/^(?:\/(zh|zh-Hant|ja|ru|fa|tr))?\/posts\/([^/]+)\/$/);
      if (!m) {
        err(rel, `站内链接格式不对:${href}`);
        continue;
      }
      const linkLocale = m[1] ?? "en";
      if (linkLocale !== locale) err(rel, `站内链接语言前缀不对:${href}(应为 ${prefix || "无前缀"})`);
      if (!posts.some((q) => q.locale === linkLocale && q.slug === m[2])) err(rel, `站内链接指向不存在的文章:${href}`);
    } else if (href.startsWith("https://www.anbovpn.com")) {
      const url = new URL(href);
      if (/^\/ip\/?$/.test(url.pathname)) continue;
      const ok = locale === "en" ? !LOCALES.slice(1).some((l) => url.pathname === `/${l}` || url.pathname.startsWith(`/${l}/`)) : url.pathname.startsWith(`${prefix}/`);
      if (!ok) err(rel, `官网链接语言前缀不对:${href}(应为 ${prefix || "无前缀"})`);
    }
  }
  if (/https:\/\/www\.anbovpn\.com\/ip\b/.test(body) && /https:\/\/www\.anbovpn\.com\/(zh|zh-Hant|ja|ru|fa|tr)\/ip\b/.test(body)) {
    err(rel, "/ip 短地址不带语言前缀");
  }

  const text = [data.title, data.description, ...faq.flatMap((f) => [f.q, f.a]), body].join("\n");
  for (const rule of FORBIDDEN) {
    if (rule.only && !rule.only.includes(locale)) continue;
    const hit = text.match(rule.re);
    if (hit) err(rel, `出现「${hit[0]}」:${rule.why}`);
  }
}

// 译文齐全、字段和英文一致
const en = posts.filter((p) => p.locale === "en");
for (const base of en) {
  for (const locale of LOCALES.slice(1)) {
    const t = posts.find((p) => p.locale === locale && p.slug === base.slug);
    if (!t) {
      warn(`posts/${locale}/${base.slug}.md`, "缺少这个语言的译文(该语言页面不会出现这一篇)");
      continue;
    }
    for (const key of ["category", "featured"]) {
      if ((t.data[key] ?? false) !== (base.data[key] ?? false)) err(t.rel, `${key} 和英文不一致`);
    }
    if (new Date(t.data.pubDate).getTime() !== new Date(base.data.pubDate).getTime()) err(t.rel, "pubDate 和英文不一致");
    if ((t.data.faq ?? []).length !== (base.data.faq ?? []).length) warn(t.rel, "FAQ 条数和英文不一致");
  }
}
for (const locale of LOCALES) {
  const featured = posts.filter((p) => p.locale === locale && p.data.featured);
  if (featured.length > 1) err(`posts/${locale}`, `featured 每种语言至多一篇,现在 ${featured.length}`);
}

for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✗ ${e}`);
console.log(`\n检查了 ${posts.length} 篇文章:${errors.length} 个错误,${warnings.length} 个提醒`);
process.exit(errors.length ? 1 : 0);
