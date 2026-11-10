# AnboVPN Blog(elenazitha6-rgb.github.io)

AnboVPN 官方博客,Astro 6 静态站,托管 GitHub Pages(<https://elenazitha6-rgb.github.io>),7 种语言,默认英文。
和 monorepo(`anbovpn-monorepo`)是两个独立仓库;品牌、术语、对外承诺的口径都取自 monorepo 的官网 `apps/web`(下面标了出处)。
命令和目录说明见 `docs/DEVELOPMENT.md`(`README.md` 是面向读者的产品介绍和推广页,不写开发说明),这里只记改它时容易踩的约定。

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

## 多语言(各语言版本是按当地写法各自写的,不是翻译)

- **2026-11-07 用户要求**:「博客站的多语言都翻译过来的,每个都不要一样的风格写法,要符合当地的写法」。所以非英文文章**不从英文翻译**:同一个 slug、同一个主题和同一套产品事实,但每个语言由熟悉当地写作习惯的人(或模型按当地风格)从头写——标题按当地搜索习惯、小节结构 / 顺序 / 例子 / FAQ 问题 / 语气各不相同(日文是 IT 媒体的结论先行 + 注意点,俄文是 Habr 式技术文档,繁体是台灣教學文的循序漸進,土耳其文是「… nedir?」问答体,等等)。不要把英文稿逐句翻译、也不要把简体稿转成繁体。
- 因为不是互译,**不输出 `workTranslation` / `translationOfWork`**,各语言版本的对应关系只靠 hreflang 表达;FAQ 条数、小节数可以不同。必须一致的只有:slug、`category`、`pubDate`、`featured`,以及 `term` 要用该语言的行业通用叫法。
- 各语言共用的事实口径(产品能说什么、不能说什么)以上面「不能做的对外承诺」和「已核对的口径」为准;写新文章 / 改文章前先对照官网当前页面。
- **文章已全部下线(2026-11-09 用户定:「全部文章下线!要换域名了!」)**:15 篇文章(en 5 / zh 5 / 其它 5 种语言各 1)全部加了 `draft: true`,文件、封面都还在仓库里,只是构建时跳过。现在部署出来的站只有 `404.html`、`robots.txt`、空 `sitemap.xml` 和一份写着 offline 的 `llms.txt`,`/` 是 404。**恢复上线**:去掉各文章 frontmatter 里的 `draft: true` 一行(`category:` 下面那行)即可;换域名后要同步 `SITE_URL`、`public/CNAME`、`README.md` / `README.zh.md` 里的博客链接,以及重新提交搜索引擎站长平台。空站状态下 `404.astro`(没有有内容的语言时渲染英文)和 `llms.txt.ts`(offline 版本,不放死链)已经做了处理,`check:seo` 对 0 页面也能过;`indexnow.mjs` 在 sitemap 为空时不推送,所以下线本身不会通知 Bing,要加速摘除请在 Bing / Google 站长平台手动提交删除。下面关于各语言文章的描述,是下线前的状态,恢复时仍然有效。
- **各语言的内容现状(2026-11-09 用户定)**:「先保留中文的,其它都删掉,然后英语重新写几篇」,随后又要求「其它小语种都换个选题写一篇文章」。所以现在是:`en` 和 `zh` 各 5 篇(英文是按英文写法从头重写的,slug、`category`、`pubDate`、`featured` 和中文一致);`zh-Hant` / `ja` / `ru` / `fa` / `tr` **各 1 篇,选题是 `how-data-plans-work`(流量套餐怎么算),和 en / zh 那 5 篇不同**,各自按当地写法写。这 5 种语言原来的 5 篇旧稿和 `README.<语言码>.md` 已删除(旧稿在 git 历史 d17f9a3 及以前,只作参考,要补的话仍按当地写法重写,不要原样恢复)。
- **各语言写哪几篇不必一致**,`check-content` 只检查「同一个 slug 的各语言版本」的 `category` / `featured` / `pubDate` 一致(以英文版为准,没有英文版以第一个版本为准),不再逐篇报缺译文。因为只有一篇,这 5 篇里没有站内相关阅读链接(站内文章链接必须指向同语言里真有的文章);官网链接照常带该语言前缀,术语和说法取自官网该语言的定价页(如 zh-Hant「加油包」、ja「追加パック」、ru「пакет докупки」、fa「بسته افزایشی」、tr「Ek paket」)。
- **语言菜单和官网一致(2026-11-09 用户要求)**:官网的语言菜单是固定的 7 项(English / 简体中文 / 繁體中文 / 日本語 / Русский / فارسی / Türkçe,当前项带 ✓)。本站的菜单仍然只列有内容的语言,但现在 7 种语言都有文章,所以菜单和官网一致;以后任何语言的文章清空,菜单里就会少一项,要保持一致就得给它留至少一篇。语言基础设施(`LOCALES`、`src/i18n/ui/<语言>.ts`、`localePath`)原样保留,往 `src/content/posts/<语言码>/` 放文章,该语言的页面、菜单、sitemap、hreflang 自动出现。
- 页头「专题」菜单、页脚只列**该语言真有文章的分类**(没有文章的分类不生成专题页,链过去是 404,`check:seo` 会查)。首页文章卡片是三列网格:头条(`featured`,没有就取第一篇)跨两列、带「编辑推荐」标签,和旁边一张小卡凑满第一行,其余每行三张,5 篇正好排满;只有一篇时头条通栏。
- `how-data-plans-work` 的封面(`public/covers/how-data-plans-work.webp`,2026-11-09 生成)画的是几个独立的蓝色数据容器、一圈每月重置的循环箭头和一个正在补充的小胶囊:对应「各类型余额独立、每月重置、加油包补充」,没有文字、没有红色 / 叉号。提示词按 `core.py::_build_cover_prompt` 的模板,画面基调用 blog-c 的蓝青渐变,和其它 5 张同一套出图方式。
- 英文文章的 `updatedDate` 写重写 / 重新核对的日期;正文里的产品事实要在官网当前页面上逐条核对过(2026-11-09 核对过 `/proxy-ip`、`/gateway`、`/ai`、`/residential-ip`)。

- 语言码同时是文章目录名,区分大小写(繁体是 `zh-Hant`);同一篇文章各语言版本 **slug 相同**。译文的 `pubDate` / `category` / `featured` 必须和英文一致。
- 只显示有内容的语言:没有译文的语言,首页 / 专题 / 文章页 / sitemap / hreflang 都不会出现这一篇;语言菜单里没有对应页面的语言回到该语言首页。**不要擅自加「回退成英文」**。
- 界面文案在 `src/i18n/ui/<语言>.ts`,`en.ts` 是类型来源,其它语言少 key / 多 key 都编译不过;**不要在组件里写死某种语言的文字**。站内地址一律用 `src/i18n/paths.ts` 的 `localePath`,官网链接用 `src/site.ts` 的 `officialLink`,不要手拼 `/zh/...`。
- 新样式用逻辑属性(`margin-inline`、`inset-inline-start`、`text-align: start`),波斯语是从右到左;方向箭头加 `.arrow` 类(RTL 下自动翻转)。
- 新增一种语言要改:`src/i18n/config.ts`、`src/i18n/ui/`(新文件并登记到 `index.ts`,含 `langSuggest` 三条提示文案,用**该语言自己**写)、文章目录;`npm run check` 会指出漏的 key。
- **语言切换(实现在 `src/lib/locale-pref.ts`)**:菜单是普通 `<a hreflang>` 链接,没有脚本也能切;手动选语言会写 localStorage(`anbovpn-blog-locale`,选英文也记),之后打开英文页时 `<head>` 里的内联脚本在渲染前把人带到所选语言;首次访问按 `navigator.languages` 只弹一个可关闭的提示横幅(`LocaleSuggest.astro`),**不自动跳转**。静态站没有中间件 / Cookie 重定向,所以只有客户端这一层;也不做「首次访问按浏览器语言自动跳」。
- **语言切换不能影响 SEO(硬约束,`npm run check:seo` 会查)**:发给所有人(含爬虫)的 HTML 完全一样;不用 `<meta http-equiv="refresh">`;跳转脚本只出现在无前缀的英文页(带前缀页、404 里没有);命中爬虫 UA / `navigator.webdriver`、或没手动选过语言,一律不跳;跳转和提示的目标只取这一页 hreflang 里真有的对应版本(不跳 404、不把读者从文章扔到首页)。改这块之后必须 `npm run build && npm run check:seo`。
- 官网各语言路径前缀和本站一致(`/zh`、`/zh-Hant`、`/ja`、`/ru`、`/fa`、`/tr`,英文无前缀);文章里的官网链接要换成该语言的前缀。**例外**:`https://www.anbovpn.com/ip`(终端查 IP 的短地址)不带语言前缀。
- 译文由 AI 起草,没有母语者审过(见 docs/DEVELOPMENT.md 已知限制)。

## 封面图

- 封面由**文章 MCP(`news-mcp`)用的同一个图片模型**生成(nodebyt 网关的 `gpt-image-2`,和 `core.py::_build_cover_prompt` 同一套提示词模板:只画插画、不画任何文字,主体放在中间横带里),画面基调用 MCP 里 `blog-c` 的品牌蓝青渐变(`#0581fa → #0bc1ce`)。图里**没有文字**,所以 7 个语言共用同一张:`public/covers/<slug>.webp`,1200×630(模型出 1254 方图或近 16:9,中心裁成 1200×630,webp 质量 88)。文章没有封面文件时,卡片和头图退回 `CoverArt` 的品牌渐变图形。
- MCP 本身没有「只出图」的工具(出图嵌在 `publish_news` / `update_article_figures` 里,会写生产库草稿),所以直接用同一个网关和模型出图;网关地址和 key 在运行时从 `core.py` 读,**不要复制进本仓库**(生成脚本也不放在本仓库里)。
- 提示词里的画面要和我们的口径一致:AI 专线优化那张用平静的蓝青色、一条平滑的线路,**不要红色 / 叉号 / 被拦住的路径**(会暗示「绕过限制」)。
- **换封面必须换文件名**(`<slug>-v2.webp`)并在文章 frontmatter 的 `cover` 里写出新路径:Telegram / 微信 / X / Facebook 按图片 URL 缓存分享预览,同名覆盖后会长期显示旧图。

## 推广卡

`CtaCard` 的四条卖点直接用官网下载页(`apps/web/messages/<语言>/download.json` 的 `download.intro.features`)里各语言自己的说法:赠送 10 GB / AI 专线优化 / 打开即用(一键连接、应用级智能分流)/ 四类连接方式(一个账户不限设备)。改卖点前先改官网口径,再同步这里的 `cta.features`(7 种语言),不要自己改写。

## SEO 约定(参照 monorepo 官网 / 技术博客记录过的坑)

- sitemap 的 `lastmod` 只用文章自己的更新时间,**固定页面不写**(写成构建时间会让搜索引擎学会忽略这个字段)。
- hreflang 只列真有这个语言版本的页面,`x-default` 指英文。
- 不写没有依据的结构化数据:没有 `aggregateRating`,没有站内搜索所以不声明 `SearchAction`;FAQPage 的问答必须和页面可见内容逐字一致(都来自 frontmatter 的 `faq`)。
- robots.txt 只用一个 `*` 分组,别给具名爬虫(GPTBot 等)单开分组,会绕过 `*` 组里的规则。
- 页面自己写了 `openGraph` 会盖掉默认分享图,没有封面时要显式带默认图(`BaseLayout` 已处理)。
- 官网的 Lighthouse 要求四项 ≥ 90;本站用生产构建实测过四项 100,改动较大(新依赖、大图、阻塞脚本)后要重新跑。
- **多语言站点常见的 SEO 坑,别再踩**(2026-11-07 整理):① hreflang 指向 404 页面,搜索引擎会把整组标记判为不可信——只列真有译文的语言,且必须互链(`npm run check:seo` 会查);② 默认语言的 URL 不能被重定向到另一个形式(canonical、hreflang、sitemap、站内链接统一用带结尾斜杠的地址);③ 结构化数据里不写假新鲜度(`new Date()`、写死的 `lastReviewed`)、不写没有依据的评分和评价;日期用带时区的 ISO 8601;`articleBody` 用纯文本,不要截断的 HTML;④ OG 图只引用真实存在的文件,尺寸写真实尺寸;**换分享图必须换文件名**(Telegram / 微信 / X / Facebook 按图片 URL 缓存预览,同名覆盖后会长期显示旧图);⑤ 空的语言列表页要 noindex 且不进 sitemap(本站目前每种语言都有文章);⑥ IndexNow 的推送记录放在部署目录之外,否则每次部署后全站重推;⑦ 页面里的 FAQ、术语定义和结构化数据必须是同一份数据、逐字一致。
- 术语定义(DefinedTerm):frontmatter 的 `term` 写这篇文章讲清楚的术语(该语言行业通用叫法),定义直接取正文第一个 H2 下的第一段(页面上可见),所以**第一个 H2 的第一段必须是一句自包含的定义**。专题页是 DefinedTermSet。
- 新增 / 修改页面模板后,先 `npm run build` 再 `npm run check:seo`,它检查的是构建产物。

## 技术约定

- Node ≥ 22.12(Astro 7 要求 22.23.4,本机是 22.20,所以用 Astro 6.x);包管理用 npm(CI 里 `npm ci`)。
- 子组件(如 `Icon.astro`)里的元素,父组件的 scoped 样式够不到,要写 `:global()`。
- Markdown 管线用 `markdown.processor: unified({...})`(Astro 6.4 起 `markdown.rehypePlugins` 已弃用)。
- 标题锚点链接对读屏隐藏(不写死英文 aria-label);外链 `rel="noopener"`,不加 `noreferrer`(要让官网统计看到来源,另有 utm 参数)。
- `dist/`、`.astro/`、`.claude/` 不提交。
- 提交说明用中文,沿用 monorepo 的 `feat(…)` / `fix(…)` 写法。
