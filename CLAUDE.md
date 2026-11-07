# AnboVPN Blog(elenazitha6-rgb.github.io)

AnboVPN 官方博客,Astro 6 静态站,托管 GitHub Pages(<https://elenazitha6-rgb.github.io>),7 种语言,默认英文。
和 monorepo(`anbovpn-monorepo`)是两个独立仓库;品牌、术语、对外承诺的口径都取自 monorepo 的官网 `apps/web`(下面标了出处)。
命令和目录说明见 `README.md`,这里只记改它时容易踩的约定。

## 品牌

- 对外叫 **AnboVPN**(A 大写、bo 小写、无空格);简体 / 繁体中文界面叫 **安泊 VPN**(不是「安博」)。「AnBo」「AnBo VPN」是内部和应用商店简称,不写进对外文案。`src/site.ts` 的 `brandNameFor(locale)` 统一处理,不要在页面里手写。
- 配色取官网 `anbo-blue` 色阶(主蓝 `#0581fa`),渐变 `#0581fa → #06b0fc → #0bc1ce` 只做装饰、不放文字;白底上的正文链接用第 7 / 8 档(`#0670d6` / `#0560b5`),`#0581fa` 上白字只有 3.8:1 不达标。字体是系统字体栈,不加载网页字体。令牌都在 `src/styles/global.css`,组件里不写死颜色。
- Logo、默认分享图拷自官网 `apps/web/public/brand/`;官网改了 Logo 要同步拷过来(`scripts/make-brand-assets.mjs` 生成页头小图)。
- 这是**官方博客**:文章会提到并链到自家产品,所以不做「广告」标注,但关于页有利益说明(`about.disclosure*`),推广卡(`CtaCard`)放在内容流里,不悬浮、不遮挡。

## VPN 术语:用各语言行业通用说法,不要从中文直译(硬性)

来源是 monorepo 根 `CLAUDE.md` 的术语表和官网各语言文案(`apps/web/messages/<语言>/`),`npm run check:content` 会拦英文里的旧说法。

| 概念 | en | zh | zh-Hant | ja | ru | fa | tr |
|---|---|---|---|---|---|---|---|
| Dedicated IP | Dedicated IP | 固定 IP | 固定 IP | 専用IP | Выделенный IP | آی‌پی اختصاصی | Özel IP |
| Shared IP | Shared IP | 共享 IP | 共享 IP | 共有IP | Общий IP | آی‌پی اشتراکی | Paylaşımlı IP |
| HTTP/SOCKS5 proxy | HTTP/SOCKS5 proxy | 代理 IP | 代理 IP | HTTP/SOCKS5プロキシ | HTTP/SOCKS5-прокси | پروکسی HTTP/SOCKS5 | HTTP/SOCKS5 proxy |
| Network gateway | Network gateway | 透明网关 | 透明閘道 | ネットワークゲートウェイ | Сетевой шлюз | دروازه شبکه | Ağ geçidi |
| ISP residential IP | ISP residential IP | 家宽 IP | 家寬 IP | ISPレジデンシャルIP | Резидентный IP от провайдера (ISP) | آی‌پی مسکونی ISP | ISP konut IP’si |
| AI-optimized routes | AI-optimized routes | AI 专线优化 | AI 專線優化 | AI向け最適化回線 | Маршруты, оптимизированные для ИИ | مسیرهای بهینه‌شده برای AI | AI için optimize rotalar |
| Data plan | Data plan | 流量套餐 | 流量方案 | データパック | Пакет трафика | بسته حجمی | Veri paketi |

英文里不写 Fixed IP / Proxy IP / Transparent gateway / home broadband / 单独的 exit;其它语言的文章**从英文原文翻译成该语言的行业说法**,不要从中文转译。

## 不能做的对外承诺(取自官网 `apps/web/CLAUDE.md`)

- 不写速度、延迟、可用率、「不限流量」;不点名某个 AI 平台一定可用。固定说法:「各 AI 平台的访问策略由平台自行决定,不保证可用,请遵守各平台的服务条款」。
- 不写「规避风控 / 养号 / 解锁 / 翻墙 / 梯子」,场景只写「适合 / 便于」。
- 不写价格、周期价目、返利金额(价格实时变,链到官网 `/pricing`)。写进文章的产品事实要能在官网当前页面上核对,并写明核对时间(「2026 年 11 月」)。已核对的口径:赠送 10 GB 免费流量(注册时一次、有效期 1 个月);四类 IP 的流量余额各自独立;HTTP/SOCKS5 代理一套凭据两种协议、可选来源 IP 白名单、不支持 SOCKS5 UDP、不开放 25 端口和内网访问、按节点逐台开通;透明网关装在 Debian / Ubuntu(amd64 / arm64)Linux 机器上,一行命令、root 执行,没有路由器固件,整台只走一个地区;AI 专线优化不是单独商品,是固定 IP / 代理的包装。
- 不点名协议实现(sing-box / xray / VLESS / Reality)。不写团队版、席位分配这类还没有的功能。
- 不确定的产品事实先查官网当前页面,别凭记忆写。

## 写文章(GEO 友好,取自 monorepo `apps/blog/CLAUDE.md`)

- 摘要(`description`)就是答案:第一句直接给结论,不铺垫;同时是 meta description,**≤ 160 字符**(中日文 125–160 字,其它 150–160)。
- H2 / H3 写成读者会问的问句,标题下第一段自包含地回答,再展开;能用列表 / 表格 / 步骤就不写长段。
- 数字、版本、日期写明确(「2026 年 11 月」,不写「最近」),并说明信息的核对时间。
- 每篇至少 3 条 FAQ(问句 + 自包含的答案,和正文不重复)。技术性说法链到原始来源(RFC、官方文档)。同一个概念全文用同一个叫法。文章之间互相内链,文末给相关阅读。
- 标题(不含品牌后缀)英文 ≤ 62 字符、中日文 ≤ 34 字;加品牌后缀后别超出搜索结果宽度。

## 多语言

- 语言码同时是文章目录名,区分大小写(繁体是 `zh-Hant`);同一篇文章各语言版本 **slug 相同**。译文的 `pubDate` / `category` / `featured` 必须和英文一致。
- 只显示有内容的语言:没有译文的语言,首页 / 专题 / 文章页 / sitemap / hreflang 都不会出现这一篇;语言菜单里没有对应页面的语言回到该语言首页。**不要擅自加「回退成英文」**。
- 界面文案在 `src/i18n/ui/<语言>.ts`,`en.ts` 是类型来源,其它语言少 key / 多 key 都编译不过;**不要在组件里写死某种语言的文字**。站内地址一律用 `src/i18n/paths.ts` 的 `localePath`,官网链接用 `src/site.ts` 的 `officialLink`,不要手拼 `/zh/...`。
- 新样式用逻辑属性(`margin-inline`、`inset-inline-start`、`text-align: start`),波斯语是从右到左;方向箭头加 `.arrow` 类(RTL 下自动翻转)。
- 新增一种语言要改:`src/i18n/config.ts`、`src/i18n/ui/`(新文件并登记到 `index.ts`)、文章目录;`npm run check` 会指出漏的 key。
- 官网各语言路径前缀和本站一致(`/zh`、`/zh-Hant`、`/ja`、`/ru`、`/fa`、`/tr`,英文无前缀);文章里的官网链接要换成该语言的前缀。**例外**:`https://www.anbovpn.com/ip`(终端查 IP 的短地址)不带语言前缀。
- 译文由 AI 起草,没有母语者审过(见 README 已知限制)。

## SEO 约定(参照 monorepo 官网 / 技术博客记录过的坑)

- sitemap 的 `lastmod` 只用文章自己的更新时间,**固定页面不写**(写成构建时间会让搜索引擎学会忽略这个字段)。
- hreflang 只列真有这个语言版本的页面,`x-default` 指英文。
- 不写没有依据的结构化数据:没有 `aggregateRating`,没有站内搜索所以不声明 `SearchAction`;FAQPage 的问答必须和页面可见内容逐字一致(都来自 frontmatter 的 `faq`)。
- robots.txt 只用一个 `*` 分组,别给具名爬虫(GPTBot 等)单开分组,会绕过 `*` 组里的规则。
- 页面自己写了 `openGraph` 会盖掉默认分享图,没有封面时要显式带默认图(`BaseLayout` 已处理)。
- 官网的 Lighthouse 要求四项 ≥ 90;本站用生产构建实测过四项 100,改动较大(新依赖、大图、阻塞脚本)后要重新跑。

## 技术约定

- Node ≥ 22.12(Astro 7 要求 22.23.4,本机是 22.20,所以用 Astro 6.x);包管理用 npm(CI 里 `npm ci`)。
- 子组件(如 `Icon.astro`)里的元素,父组件的 scoped 样式够不到,要写 `:global()`。
- Markdown 管线用 `markdown.processor: unified({...})`(Astro 6.4 起 `markdown.rehypePlugins` 已弃用)。
- 标题锚点链接对读屏隐藏(不写死英文 aria-label);外链 `rel="noopener"`,不加 `noreferrer`(要让官网统计看到来源,另有 utm 参数)。
- `dist/`、`.astro/`、`.claude/` 不提交。
- 提交说明用中文,沿用 monorepo 的 `feat(…)` / `fix(…)` 写法。
