import type { APIRoute } from "astro";

/**
 * 对所有爬虫开放(包括 AI 爬虫),只用一个 `*` 分组:给具名爬虫单开分组会让它们绕过 `*` 组里的 Disallow。
 * 站点地址取自 astro.config 的 `site`,换域名不用改这里。
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("/sitemap.xml", site).toString();
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
