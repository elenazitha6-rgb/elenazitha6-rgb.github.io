import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { CATEGORIES } from "./categories";

/**
 * 文章:`src/content/posts/<语言码>/<slug>.md`。同一篇文章的各语言版本 **slug 相同**、放在不同语言目录下。
 * 语言码是目录名,区分大小写(繁体是 `zh-Hant`),所以自定义 generateId 保留原样,默认会被小写成 `zh-hant`。
 */
const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    /** 页面标题(h1)。 */
    title: z.string().min(8),
    /** 摘要 = 答案:第一句直接给结论。同时用作 meta description,所以不超过 160。 */
    description: z.string().min(60).max(160),
    /** 发布时间(带时区的 ISO 字符串,同一天多篇靠时间排先后)。 */
    pubDate: z.coerce.date(),
    /** 最近一次核对 / 修改的时间;会随时间变化的事实改完要更新它。 */
    updatedDate: z.coerce.date().optional(),
    category: z.enum(CATEGORIES),
    /** 这篇文章讲清楚的术语(用该语言行业通用的叫法,见 CLAUDE.md 术语表);输出 DefinedTerm 结构化数据,定义取正文第一个 H2 下的第一段。 */
    term: z.string().optional(),
    /** 关键词,5–10 个以内。 */
    tags: z.array(z.string()).default([]),
    /** 内嵌 FAQ:页面上显示、同时输出 FAQPage 结构化数据,问答必须和页面可见内容逐字一致,每篇至少 3 条。 */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    /**
     * 封面图(站内路径,1200×630)。不写就按约定找 `public/covers/<slug>.webp`,各语言版本共用同一张(图里没有文字),
     * 找不到再用品牌渐变图形。换图时**必须换文件名**(如 `<slug>-v2.webp`)并在这里写出新路径:
     * Telegram / 微信 / X / Facebook 按图片 URL 缓存分享预览,同名覆盖后会长期显示旧图。
     */
    cover: z.string().startsWith("/").optional(),
    /** 想在首页放大展示的一篇(每种语言至多一篇)。 */
    featured: z.boolean().default(false),
    /** 草稿:构建时跳过。 */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
