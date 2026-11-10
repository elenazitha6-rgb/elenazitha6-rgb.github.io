/**
 * 界面文案(英文是类型来源:其它语言漏 key 编译不过)。
 * 文章内容不在这里,在 src/content/posts/<语言码>/。
 * VPN 术语用各语言行业通用的说法,见 CLAUDE.md 的术语表,不要从中文直译。
 */
export const en = {
  blogName: "Blog",
  team: "AnboVPN team",
  a11y: {
    skip: "Skip to main content",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    mainNav: "Main navigation",
    language: "Language",
    theme: "Toggle light and dark theme",
    breadcrumb: "Breadcrumb",
    homeLink: "AnboVPN Blog home",
  },
  nav: { articles: "Articles", topics: "Topics", about: "About", getApp: "Get AnboVPN" },
  /**
   * 首次访问时的语言提示横幅(只提示,不自动跳转;见 src/lib/locale-pref.ts)。
   * 每种语言的这三条是写给「想读这个语言的人」看的,所以用**该语言自己**的写法,不是当前页面的语言。
   */
  langSuggest: {
    text: "This page is also available in English.",
    action: "Read in English",
    dismiss: "Dismiss",
  },
  home: {
    metaTitle: "AnboVPN Blog | Guides on Dedicated IPs, Proxies and Network Gateways",
    metaDescription:
      "Plain-language guides from the AnboVPN team on Dedicated IPs, HTTP/SOCKS5 proxies, network gateways, ISP residential IPs and AI-optimized routes, with FAQs.",
    eyebrow: "The AnboVPN blog",
    title: "Choose the right IP, proxy and network setup with confidence",
    lead: "Plain-language guides from the AnboVPN team on Dedicated IPs, HTTP/SOCKS5 proxies, network gateways, ISP residential IPs and AI-optimized routes.",
    readLatest: "Read the latest guides",
    featured: "Featured",
    latest: "Latest articles",
    topics: "Browse by topic",
    allArticles: "All articles",
    empty: "No articles yet. Check back soon.",
  },
  categories: {
    "ip-types": { name: "IP types", description: "Dedicated, shared and ISP residential IPs: what each one is and when to use it." },
    proxies: { name: "Proxies", description: "HTTP and SOCKS5 proxies: how they differ and how to choose between them." },
    gateway: { name: "Network gateway", description: "Cover the devices on your network with one setup instead of installing apps everywhere." },
    ai: { name: "AI & routes", description: "How AI-optimized routes work, and what they cannot promise." },
  },
  category: {
    metaTitle: (name: string) => `${name} | AnboVPN Blog guides and explainers`,
    metaDescription: (name: string) => `Articles about ${name.toLowerCase()} from the AnboVPN team: clear explanations, comparison tables and FAQs, each with the date it was last checked.`,
    count: (n: number) => (n === 1 ? "1 article" : `${n} articles`),
  },
  card: { minRead: (n: number) => `${n} min read` },
  post: {
    shortAnswer: "Short answer",
    onThisPage: "On this page",
    faq: "Frequently asked questions",
    related: "Keep reading",
    previous: "Previous article",
    next: "Next article",
    published: "Published",
    updated: "Updated",
    by: "By",
    home: "Home",
  },
  cta: {
    title: "Ready to try it yourself?",
    primary: "Download AnboVPN",
    secondary: "See plans",
    sideTitle: "Try AnboVPN",
    /** 官网下载页的四条卖点(各语言用官网自己的说法,不要改写):赠送流量 / AI 专线优化 / 打开即用 / 四类连接方式。 */
    features: [
      { title: "10 GB free to start", text: "Get 10 GB of free data on sign-up (one time, valid 1 month), then buy only what you need." },
      { title: "AI-optimized routes", text: "Routes optimized for AI services, with a residential or ISP residential IP exit." },
      { title: "Open and connect", text: "Official clients with one-click connect and app-level smart routing." },
      { title: "Four ways to connect", text: "Shared IP, dedicated IP, proxy and network gateway — one account, unlimited devices." },
    ],
  },
  about: {
    metaTitle: "About the AnboVPN Blog | Who We Are and How We Write Our Guides",
    metaDescription:
      "The AnboVPN blog is written by the AnboVPN team. Read how we research, verify and date our guides, which claims we never make, and how to contact us.",
    title: "About the AnboVPN blog",
    lead: "This blog is published by the team behind AnboVPN. We write the guides we wish existed when choosing between IP types, proxy protocols and network setups.",
    coverTitle: "What we cover",
    coverItems: [
      "Dedicated IP and shared IP: what is the difference and which one fits your use case",
      "HTTP and SOCKS5 proxies: protocols, authentication and practical setup choices",
      "Network gateway: covering the devices on your network from one place",
      "ISP residential IP and AI-optimized routes: what they are and where their limits are",
    ],
    policyTitle: "How we write",
    policyItems: [
      "Every article starts with the short answer, then explains the reasoning.",
      "Every article shows when it was published and last updated, and facts that change over time say when they were checked.",
      "We link to primary sources such as RFCs and official documentation for technical claims.",
      "We do not promise speed, latency or uptime, and we do not say any specific AI platform will work. Each platform sets its own access policy, and you should follow its terms of service.",
      "Product details come from the official AnboVPN website. When a plan or price matters, we link to the live page instead of copying numbers that may change.",
    ],
    disclosureTitle: "Disclosure",
    disclosureBody: "This is the official blog of AnboVPN, so articles may mention and link to our own products. We say so plainly and mark product links as ours. Comparisons between technologies are written to help you choose, including when the answer is that you do not need a paid product.",
    contactTitle: "Contact",
    contactBody: "AnboVPN is operated by Anbo Technology LLC, a Wyoming limited liability company. Questions about an article or a correction? Email",
  },
  footer: {
    tagline: "Guides and notes from the AnboVPN team.",
    products: "Products",
    productLinks: { dedicatedIp: "Dedicated IP", proxy: "HTTP/SOCKS5 proxy", gateway: "Network gateway", ai: "AI-optimized routes" },
    blog: "Blog",
    rss: "RSS feed",
    company: "AnboVPN",
    download: "Download",
    pricing: "Plans and pricing",
    help: "Help Center",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    rights: "All rights reserved.",
  },
  notFound: {
    title: "Page not found",
    text: "The page you are looking for does not exist or has moved. Try the latest articles instead.",
    home: "Back to the blog",
  },
};
