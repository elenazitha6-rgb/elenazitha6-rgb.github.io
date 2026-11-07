/**
 * 文章分类。键就是 frontmatter 的 `category` 和 URL 里的分类 slug;各语言显示名在 i18n/ui 的 `categories`。
 * 单独一个不依赖别名路径的文件,因为 content.config.ts 也要引用它。
 */
export const CATEGORIES = ["ip-types", "proxies", "gateway", "ai"] as const;
export type Category = (typeof CATEGORIES)[number];

/** 分类封面的品牌渐变(都在官网蓝 → 青的范围里变化,和官网同一个色相家族)。 */
export const CATEGORY_GRADIENT: Record<Category, [string, string]> = {
  "ip-types": ["#0581fa", "#06b0fc"],
  proxies: ["#0670d6", "#0bc1ce"],
  gateway: ["#044a8c", "#0581fa"],
  ai: ["#0560b5", "#0bc1ce"],
};
