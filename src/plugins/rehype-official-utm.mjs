/**
 * 文章正文里指向官网的链接自动补 utm 参数,Markdown 源文件保持干净。
 * 官网统计里能看到「安泊 VPN 博客 → 文章内链接」带来的访问。
 * `/ip`(终端查 IP 的纯文本地址)不加参数。
 */
const OFFICIAL_HOST = "www.anbovpn.com";

function walk(node, params) {
  if (node.type === "element" && node.tagName === "a" && typeof node.properties?.href === "string") {
    try {
      const url = new URL(node.properties.href);
      if (url.hostname === OFFICIAL_HOST && !/^\/ip\/?$/.test(url.pathname)) {
        for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
        node.properties.href = url.toString();
      }
    } catch {
      /* 相对链接或不合法的 URL,原样保留 */
    }
  }
  if (Array.isArray(node.children)) for (const child of node.children) walk(child, params);
}

export default function rehypeOfficialUtm(options = {}) {
  const params = {
    utm_source: options.source ?? "anbovpn_blog",
    utm_medium: options.medium ?? "blog",
    utm_campaign: options.campaign ?? "article",
  };
  return (tree) => walk(tree, params);
}
