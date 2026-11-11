// @ts-check
import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeOfficialUtm from "./src/plugins/rehype-official-utm.mjs";
import rehypeUnpublishedLinks from "./src/plugins/rehype-unpublished-links.mjs";

/**
 * 站点绝对地址:canonical、sitemap、RSS、OG 里的链接都从这里来。
 * 换自定义域名时只改 SITE_URL(环境变量或下面的默认值),并在 public/ 里加 CNAME 文件。
 */
const SITE_URL = process.env.SITE_URL || "https://elenazitha6-rgb.github.io";

export default defineConfig({
  site: SITE_URL,
  // GitHub Pages 把 /foo 重定向到 /foo/,统一带斜杠,canonical 才不会和实际地址打架。
  trailingSlash: "always",
  build: { format: "directory" },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
  markdown: {
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" }, wrap: false },
    processor: unified({
      rehypePlugins: [
        // 标题自带锚点链接(只给 h2 / h3,悬停时显示,方便复制这一节的链接)。
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            test: ["h2", "h3"],
            // 锚点只是给鼠标用户的装饰,对读屏隐藏(写死英文 aria-label 会让其它语言的文章读成英文)。
            properties: { class: "heading-anchor", ariaHidden: "true", tabIndex: -1 },
            content: { type: "text", value: "#" },
          },
        ],
        // 指向官网的链接自动带 utm 参数(Markdown 源文件保持干净)。
        rehypeOfficialUtm,
        // 定时发布:指向还没到发布时间的文章的站内链接先摘成纯文字,到点后下一次构建自动恢复。
        rehypeUnpublishedLinks,
        // 外链:新窗口 + noopener;不带 nofollow(都是我们自己引用的权威来源)。
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }],
      ],
    }),
  },
});
