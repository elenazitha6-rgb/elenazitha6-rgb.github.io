# AnboVPN Blog

AnboVPN 官方博客:讲固定 IP(Dedicated IP)、HTTP/SOCKS5 代理、透明网关(Network gateway)、ISP 住宅 IP 和 AI 专线优化(AI-optimized routes)的选择与用法。
Astro 静态站,托管在 GitHub Pages:<https://elenazitha6-rgb.github.io>。

- 默认语言英文,另有 `zh` / `zh-Hant` / `ja` / `ru` / `fa`(从右到左)/ `tr`,和官网同一套语言码。
- 文章是仓库里的 Markdown 文件,推送到 `main` 后由 GitHub Actions 自动检查、构建、发布,没有后端、没有数据库。
- 写作和术语规则见 [`CLAUDE.md`](./CLAUDE.md)。

## 本地开发

需要 Node 22.12 或更新(`.nvmrc` 里是 22)。

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # 先跑内容检查,再构建到 dist/
npm run preview      # 预览 dist/
npm run check        # Astro / TypeScript 类型检查
npm run check:content  # 只跑内容检查(文章字段、链接、术语、译文是否齐全)
```

## 第一次发布

1. 在 GitHub 创建仓库 `elenazitha6-rgb.github.io`(已建好),把本地仓库推上去。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
3. 推送到 `main`,到 **Actions** 页看 "Deploy to GitHub Pages" 跑完,站点就在 <https://elenazitha6-rgb.github.io> 上线。

### 换成自定义域名

1. 域名 DNS 按 [GitHub 文档](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)指向 GitHub Pages。
2. 在 `public/` 里新建 `CNAME` 文件,内容是域名,例如 `blog.example.com`。
3. 仓库 **Settings → Secrets and variables → Actions → Variables** 新增 `SITE_URL`,值是 `https://blog.example.com`。canonical、sitemap、RSS、分享图里的地址都会跟着变。
4. 重新推送一次。

## 写一篇新文章

1. 在 `src/content/posts/en/` 新建 `<slug>.md`(slug 用英文小写加连字符,它就是 URL),照现有文章写 frontmatter:

   ```yaml
   ---
   title: "…"
   description: "…"      # 简短回答:第一句直接给结论,不超过 160 字符
   pubDate: 2026-11-06T09:00:00+08:00
   category: ip-types    # ip-types | proxies | gateway | ai
   tags: [Dedicated IP, shared IP]
   faq:                  # 至少 3 条,页面上显示,同时输出 FAQPage 结构化数据
     - q: "…"
       a: "…"
   ---
   ```

2. 其它语言放在 `src/content/posts/<语言码>/<同一个 slug>.md`。译文的 `pubDate`、`category`、`featured` 必须和英文一致;站内链接和官网链接要换成该语言的前缀(`/zh/posts/x/`、`https://www.anbovpn.com/zh/pricing`)。没有译文的语言,这一篇不会出现在该语言的页面里。
3. 跑 `npm run check:content`,按提示修;再 `npm run dev` 看一眼。
4. 提交并推送,线上自动更新。

## 目录结构

```
src/
  content/posts/<语言码>/<slug>.md   文章(frontmatter 字段见 src/content.config.ts)
  content.config.ts                  文章集合和字段校验
  categories.ts                      分类和封面渐变
  site.ts                            品牌名、官网地址、官网链接(带 utm)
  i18n/
    config.ts                        语言列表、方向、日期格式
    paths.ts                         站内地址一律从这里拼
    ui/<语言>.ts                     界面文案(en.ts 是类型来源,缺 key 编译不过)
  lib/posts.ts                       读文章、相关文章、阅读时长
  lib/schema.ts                      结构化数据(JSON-LD)
  layouts/BaseLayout.astro           <head>、SEO 标签、页头页脚
  components/                        页头、页脚、卡片、目录、FAQ、推广卡……
  pages/[...lang]/                   首页、文章、专题、关于、RSS(英文无前缀,其它语言带前缀)
  pages/{sitemap.xml,robots.txt,llms.txt,llms-full.txt}.ts
  plugins/rehype-official-utm.mjs    正文里指向官网的链接自动补 utm 参数
  styles/global.css                  设计令牌、深色主题、正文排版
public/brand/                        官网 Logo 和默认分享图(拷自官网 apps/web/public/brand)
scripts/check-content.mjs            内容检查
.github/workflows/deploy.yml         发布到 GitHub Pages
```

## 已做的 SEO / GEO

canonical 自引用、hreflang(只指向真有译文的语言,`x-default` 指英文)、Open Graph / Twitter、
BlogPosting / BreadcrumbList / FAQPage / Blog / WebSite / Organization 结构化数据、
sitemap(`lastmod` 只用文章更新时间)、每个语言一个 RSS、`/llms.txt` 和 `/llms-full.txt`(全文 Markdown)、
robots 对所有爬虫开放、深色主题、零框架 JS(只有几十行脚本:主题、下拉菜单、目录高亮)。
本地用生产构建跑 Lighthouse(2026-11-06):首页 / 文章页 / 中文页 / 波斯语页四项均为 100。

## 已知限制

- 各语言译文由 AI 起草,上线前建议请母语者通读一遍,尤其是波斯语、俄语、土耳其语。
- 文章封面是按分类生成的品牌渐变图形,没有照片;分享图是官网的默认分享图(1200×630,所有页面共用)。
- 没有站内搜索、评论、订阅邮件、统计脚本;文章超过十几篇后再加分页。
- GitHub Pages 不能设置响应头(缓存、安全头),也没有服务端重定向。
