// 把「新增 / 更新」的页面推给 IndexNow(Bing、Yandex、Naver、Seznam 等共用),发布成功后由 GitHub Actions 调用。
// 用法:node scripts/indexnow.mjs --sitemap <sitemap.xml> --state <state.json> [--dry-run]
// 环境变量:SITE_URL(站点地址,默认和 astro.config 一致)。key 取 public/<32 位十六进制>.txt 的文件名。
//
// 设计(吸收 IndexNow 推送常见的踩坑经验):
// - 只推变化的页面:对比上次推送的状态(url → lastmod)。固定页面不写 lastmod,只在第一次出现时推一次;
// - 推送记录放在部署目录之外(Actions 缓存),不然每次部署都会被清掉、全站重推;
// - 429 / 403 / 422 熔断:不继续发,也不更新状态,下次部署再试;
// - sitemap 为空或骤降(比上次少一半以上)视为异常,不推送、不更新状态,避免后端抖动被当成大批页面被删;
// - 只有提交成功的页面才记入状态。
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = args.includes("--dry-run");
const sitemapPath = arg("--sitemap") ?? path.join(root, "dist/sitemap.xml");
const statePath = arg("--state") ?? path.join(root, ".indexnow/state.json");
const siteUrl = (process.env.SITE_URL || "https://elenazitha6-rgb.github.io").replace(/\/$/, "");
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const BATCH = 1000;

const keyFile = readdirSync(path.join(root, "public")).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("找不到 IndexNow key 文件(public/<32 位十六进制>.txt)");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");
const keyLocation = `${siteUrl}/${keyFile}`;
const host = new URL(siteUrl).host;

// 解析 sitemap:取每个 <url> 的 <loc> 和 <lastmod>
const xml = readFileSync(sitemapPath, "utf8");
const current = new Map();
for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
  if (!loc) continue;
  current.set(loc.replace(/&amp;/g, "&"), block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() ?? "-");
}

const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : {};
const previousCount = Object.keys(state).length;

if (current.size === 0) {
  console.error("sitemap 里一个页面都没有,视为异常,不推送");
  process.exit(1);
}
if (previousCount >= 4 && current.size < previousCount / 2) {
  console.error(`sitemap 页面数从 ${previousCount} 骤降到 ${current.size},视为异常,不推送、不更新状态`);
  process.exit(1);
}

const changed = [...current].filter(([url, lastmod]) => state[url] !== lastmod).map(([url]) => url);
console.log(`sitemap ${current.size} 个页面,其中 ${changed.length} 个新增或有更新`);

if (changed.length === 0 || dryRun) {
  if (dryRun) for (const url of changed) console.log(`  ${url}`);
  process.exit(0);
}

const next = { ...Object.fromEntries([...current].filter(([url]) => url in state).map(([url]) => [url, state[url]])) };
let failed = false;

for (let i = 0; i < changed.length; i += BATCH) {
  const urlList = changed.slice(i, i + BATCH);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });
  if (res.status === 200 || res.status === 202) {
    for (const url of urlList) next[url] = current.get(url);
    console.log(`已提交 ${urlList.length} 个页面(HTTP ${res.status})`);
    continue;
  }
  // 429 请求过多 / 403 key 校验失败 / 422 URL 或 key 不合法:继续发只会被拉黑,直接熔断
  console.error(`IndexNow 返回 HTTP ${res.status}:${(await res.text()).slice(0, 200)}。停止推送,状态不更新,下次部署再试`);
  failed = true;
  break;
}

mkdirSync(path.dirname(statePath), { recursive: true });
writeFileSync(statePath, JSON.stringify(next, null, 2));
process.exit(failed ? 1 : 0);
