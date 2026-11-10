# 开发与维护手册

AnboVPN 官方博客的开发、发布和维护说明。产品介绍见 [`README.md`](../README.md)(英文,默认显示;另有简体中文版,见下文「维护 README」),写作和术语规则见 [`CLAUDE.md`](../CLAUDE.md)。

站点是 Astro 静态站,托管在 GitHub Pages:<https://elenazitha6-rgb.github.io>。

- 默认语言英文,界面支持 `zh` / `zh-Hant` / `ja` / `ru` / `fa`(从右到左)/ `tr`,和官网同一套语言码。目前英文和简体中文各 5 篇,其它 5 种语言各 1 篇(流量套餐怎么算,选题和英文 / 中文不同),所以语言菜单和官网一样是 7 项。哪种语言没有文章,页面、语言菜单、sitemap 里就都不会出现;往 `src/content/posts/<语言码>/` 放进文章就会自动出现。各语言写哪几篇不要求一致。
- 文章是仓库里的 Markdown 文件,推送到 `main` 后由 GitHub Actions 自动检查、构建、发布,没有后端、没有数据库。

## 本地开发

需要 Node 22.12 或更新(`.nvmrc` 里是 22)。

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # 先跑内容检查,再构建到 dist/
npm run preview      # 预览 dist/
npm run check        # Astro / TypeScript 类型检查
npm run check:content  # 只跑内容检查(文章字段、链接、术语、同一个 slug 的各语言版本字段是否一致)
npm run check:seo      # 检查构建产物 dist/(先 npm run build):hreflang、canonical、sitemap、站内链接、结构化数据
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
   term: "Dedicated IP" # 这篇文章讲清楚的术语(该语言行业通用的叫法);定义取正文第一个 H2 下的第一段
   faq:                  # 至少 3 条,页面上显示,同时输出 FAQPage 结构化数据
     - q: "…"
       a: "…"
   ---
   ```

2. 其它语言放在 `src/content/posts/<语言码>/<同一个 slug>.md`。**不要翻译英文稿**:每个语言按当地写作习惯从头写(标题、结构、例子、FAQ 问题、语气都不同),只共用同一个 slug、主题和产品事实;`pubDate`、`category`、`featured` 必须和英文一致;站内链接和官网链接要换成该语言的前缀(`/zh/posts/x/`、`https://www.anbovpn.com/zh/pricing`)。没有对应版本的语言,这一篇不会出现在该语言的页面里。
3. 封面:放一张 1200×630 的 `public/covers/<slug>.webp`(各语言共用,图里不要有文字);不放就用品牌渐变图形。换封面要换文件名并写进 frontmatter 的 `cover`(见 `CLAUDE.md`「封面图」)。
4. 跑 `npm run check:content`,按提示修;再 `npm run dev` 看一眼。
5. 提交并推送,线上自动更新。

## 维护 README(英文 + 简体中文)

`README.md` 是**英文版**,GitHub 仓库首页默认显示它(GitHub 只认 `README.md`,所以默认语言要放在这个文件名上);它是面向读者的产品介绍和推广页,不写开发说明。另有 `README.zh.md`(简体中文),文件名后缀是语言码。每个文件顶部是同一行语言切换(当前语言只写字、不加链接)。其它 5 种语言的 README 已随旧稿一起删除(2026-11-09),目前没有恢复;要加回某个语言时新增 `README.<语言码>.md`,并在每个文件顶部的语言切换行里加上它(文末的「博客语言」列表已经列出全部 7 种语言的博客首页)。

- 和博客文章一样,各语言版本是**按当地写法各自写的,不互译**:标题、小节顺序、例子、FAQ 问题、语气都可以不同。必须一致的只有产品事实。
- 改产品口径(赠送流量、四类连接方式的限制、核对时间等)时,两个文件一起改。口径以 `CLAUDE.md`「不能做的对外承诺」和官网当前页面为准。
- 术语用 `CLAUDE.md` 术语表里各语言的叫法;四条卖点用 `src/i18n/ui/<语言>.ts` 里 `cta.features` 的原话,不自己改写。
- 文章链接用该语言的前缀(英文无前缀:`/posts/<slug>/`,其它 `/<语言码>/posts/<slug>/`),标题取自该语言文章的 frontmatter;官网链接同样带该语言前缀(英文无前缀)和 utm 参数。改 slug 或增删文章后,逐个核对 README 里指向的文章仍然存在。
- 波斯语版正文用 `<div dir="rtl">` 包起来,div 里的 Markdown 前后要空行,否则不渲染;语言切换行和语言列表保持从左到右。
- 这些 README 不在 `npm run check:content` 的检查范围内,链接和术语要自己核对。

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
  lib/locale-pref.ts                 语言偏好:记住手动选的语言、英文页跳转脚本、浏览器语言匹配、爬虫 UA 名单
  layouts/BaseLayout.astro           <head>、SEO 标签、页头页脚
  components/                        页头、页脚、卡片、目录、FAQ、推广卡、语言提示横幅……
  pages/[...lang]/                   首页、文章、专题、关于、RSS(英文无前缀,其它语言带前缀)
  pages/{sitemap.xml,robots.txt,llms.txt,llms-full.txt}.ts
  plugins/rehype-official-utm.mjs    正文里指向官网的链接自动补 utm 参数
  styles/global.css                  设计令牌、深色主题、正文排版
public/brand/                        官网 Logo 和默认分享图(拷自官网 apps/web/public/brand)
scripts/check-content.mjs            内容检查
.github/workflows/deploy.yml         发布到 GitHub Pages
README.md, README.zh.md              面向读者的产品介绍(README.md 是英文,README.zh.md 是简体中文,见上文「维护 README」)
docs/DEVELOPMENT.md                  本手册
```

## SEO / GEO

本站的 SEO / GEO 做法如下。

**SEO**
- canonical 自引用;hreflang 只指向真有译文的语言、互相链回、带 `x-default`;404 页 noindex,不输出 canonical / hreflang。
- Open Graph / Twitter、`<time datetime>`、`article:*` 标签、robots meta 放开摘要长度和大图预览(`max-snippet:-1` 等)。
- 结构化数据:Organization(`sameAs` 连到官网)、WebSite、Blog、BlogPosting(ISO 8601 日期、词数、外部来源 `citation`、译文关系 `workTranslation` / `translationOfWork`、`publishingPrinciples`)、BreadcrumbList、FAQPage、DefinedTerm、DefinedTermSet(专题页)、CollectionPage、AboutPage。不写 `aggregateRating`,没有站内搜索所以不写 `SearchAction`。
- sitemap:`lastmod` 只用文章自己的更新时间,固定页面不写;hreflang 互链;没有内容的语言不出现。
- robots.txt 只有一个 `*` 分组;每个语言一个 RSS;专题页 / 页脚互相链接。
- 语言切换(沿用「Cookie 记住语言 + 首屏跳转脚本 + 提示横幅」的常见做法,改成静态站做法):手动选语言写 localStorage,之后打开英文页会被带到所选语言;首次访问只提示、不自动跳。不影响 SEO 的做法:HTML 对所有人一样、没有 `meta refresh`、跳转脚本只在无前缀的英文页、爬虫 UA / `navigator.webdriver` / 没选过语言都不跳、目标只取本页真有的对应版本。细节和理由见 `src/lib/locale-pref.ts` 顶部注释。
- IndexNow:发布成功后只推新增或有更新的页面(状态存在 Actions 缓存里,不在部署目录),429 / 403 / 422 熔断,sitemap 为空或骤降时不推送。要关掉:仓库 Variables 里设 `INDEXNOW_DISABLED=true`。
- 站长验证:仓库 Variables 里设 `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION`(验证码),重新构建后页面 `<head>` 里就有对应的 meta 标签。
- `npm run check:seo`(CI 里每次发布前跑)检查构建产物:每页恰好一个 h1、hreflang 互链、canonical、sitemap 和页面一一对应、站内链接和资源不 404、FAQ / 术语定义和页面可见内容逐字一致、语言跳转脚本和提示横幅不越界(只在英文页、有爬虫护栏、目标是真实存在的对应版本、没有 `meta refresh`)。

**GEO(给大模型和答案引擎)**
- 答案优先:每篇文章有"简短回答"框(= 摘要),H2 写成问句,标题下第一段自包含地回答;内容检查会提醒不符合的小节。
- 每篇文章有纯 Markdown 版本(`/posts/<slug>.md`,页面 `<head>` 里有 `<link rel="alternate" type="text/markdown">`);`/llms.txt`(简介、写作方法、专题、各语言文章)和 `/llms-full.txt`(全文)。
- 可见的发布 / 更新日期、作者链到关于页(编辑原则、利益说明)、`speakable`、FAQ、术语定义(DefinedTerm)、外部来源链接。
- robots 对所有爬虫(含 AI 爬虫)开放,不给具名爬虫单开分组。

本地用生产构建跑 Lighthouse(2026-11-06):首页 / 文章页 / 中文页 / 波斯语页四项均为 100。

## 已知限制

- 各语言文章由 AI 起草,上线前建议请母语者通读一遍;其它语言也只各写了 1 篇。
- 6 个选题的封面都是 AI 生成的插画(没有文字,各语言共用),新文章没配封面时退回品牌渐变图形;首页、专题页、关于页的分享图是官网的默认分享图(1200×630)。
- 没有站内搜索、评论、订阅邮件、统计脚本;文章超过十几篇后再加分页。
- GitHub Pages 不能设置响应头(缓存、安全头),也没有服务端重定向。
