/**
 * 文章正文里指向「还没发布」的文章的站内链接,摘成纯文字(去掉 <a>、保留文字)。
 *
 * 为什么需要:文章是定时发布的(滴灌,见 `src/lib/posts.ts` 的 `getAllPosts`),但文章之间互相内链。
 * 先发的文章链到后发的文章时,那个地址在到点之前是 404,`npm run check:seo` 会报站内死链、整次构建失败,读者和搜索引擎也会点到 404。
 * 到点之后下一次构建里这些链接会自动变回链接,不用改 Markdown。
 *
 * 判断「已发布」的规则必须和 `getAllPosts` 一致:没有 `draft: true`,并且 `pubDate` 不晚于现在(`INCLUDE_SCHEDULED=1` 时全部算已发布)。
 * 这里在配置加载时直接扫 `src/content/posts/<语言>/<slug>.md` 的 frontmatter(只读 `pubDate` / `draft` 两行,不依赖内容集合 API)。
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const POSTS_DIR = path.resolve(process.cwd(), "src/content/posts");
const DEFAULT_LOCALE = "en";
/** 站内文章地址:`/posts/<slug>/`(默认语言)或 `/<语言>/posts/<slug>/`。 */
const POST_HREF = /^\/(?:(zh-Hant|zh|ja|ru|fa|tr)\/)?posts\/([^/?#]+)\/?(?:[?#].*)?$/;

function publishedKeys() {
  const now = Date.now();
  const includeScheduled = process.env.INCLUDE_SCHEDULED === "1";
  const keys = new Set();
  for (const locale of readdirSync(POSTS_DIR, { withFileTypes: true })) {
    if (!locale.isDirectory()) continue;
    for (const file of readdirSync(path.join(POSTS_DIR, locale.name))) {
      if (!file.endsWith(".md")) continue;
      const head = readFileSync(path.join(POSTS_DIR, locale.name, file), "utf8").split(/\r?\n---\r?\n/)[0] ?? "";
      if (/^draft:\s*true\s*$/m.test(head)) continue;
      const pub = head.match(/^pubDate:\s*(.+?)\s*$/m)?.[1]?.replace(/^["']|["']$/g, "");
      const time = pub ? new Date(pub).getTime() : Number.NaN;
      if (Number.isNaN(time) || (!includeScheduled && time > now)) continue;
      keys.add(`${locale.name}/${file.replace(/\.md$/, "")}`);
    }
  }
  return keys;
}

function strip(node, published) {
  if (!Array.isArray(node.children)) return;
  const next = [];
  for (const child of node.children) {
    strip(child, published);
    const href = child.type === "element" && child.tagName === "a" ? child.properties?.href : undefined;
    const m = typeof href === "string" ? href.match(POST_HREF) : null;
    if (m && !published.has(`${m[1] ?? DEFAULT_LOCALE}/${m[2]}`)) next.push(...child.children);
    else next.push(child);
  }
  node.children = next;
}

export default function rehypeUnpublishedLinks() {
  const published = publishedKeys();
  return (tree) => strip(tree, published);
}
