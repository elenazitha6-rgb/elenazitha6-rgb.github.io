import { getCollection, type CollectionEntry } from "astro:content";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { Category } from "@/categories";
import { plainText } from "@/lib/markdown";

export type PostEntry = CollectionEntry<"posts">;

/** 带上语言、slug、阅读时长等派生信息的文章。 */
export interface Post {
  entry: PostEntry;
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  category: Category;
  /** 这篇文章定义的术语,以及它的定义(正文第一个 H2 下第一段的纯文本,页面上可见)。 */
  term?: string;
  termDefinition?: string;
  tags: string[];
  faq: { q: string; a: string }[];
  featured: boolean;
  published: Date;
  /** 最近修改时间;没写 updatedDate 就等于发布时间。 */
  modified: Date;
  /** 是否在页面上显示「更新于」(updatedDate 比发布日晚才显示)。 */
  showUpdated: boolean;
  readingMinutes: number;
  /** 正文原文(Markdown),llms-full.txt 用。 */
  body: string;
  path: string;
}

/**
 * 术语定义 = 正文第一个 H2 下的第一段(答案优先的写法下它就是一句自包含的定义),取纯文本,
 * 超过 450 字符就在句子边界截断。结构化数据里的定义必须和页面上可见的文字一致,所以不另写一份。
 */
export function leadDefinition(markdown: string): string | undefined {
  const afterH2 = markdown.split(/^## .+$/m)[1];
  const first = afterH2?.trim().split(/\n\s*\n/)[0]?.trim();
  if (!first || /^[|>`-]|^\d+\./.test(first)) return undefined;
  const text = plainText(first, Number.MAX_SAFE_INTEGER);
  if (text.length <= 450) return text;
  const sentences = text.match(/[^.!?。！？]+[.!?。！？]+\s*/g) ?? [text];
  let out = "";
  for (const sentence of sentences) {
    if (out && (out + sentence).length > 450) break;
    out += sentence;
  }
  return out.trim() || text.slice(0, 450);
}

const CJK = /[぀-ヿ㐀-鿿豈-﫿]/g;

/** 阅读时长:拉丁文按每分钟 200 词,中日文按每分钟 400 字,至少 1 分钟。 */
export function readingMinutes(markdown: string): number {
  const text = markdown.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`|[\]()-]/g, " ");
  const cjk = (text.match(CJK) ?? []).length;
  const words = text.replace(CJK, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200 + cjk / 400));
}

export function postPath(locale: Locale, slug: string): string {
  return localePath(locale, `/posts/${slug}/`);
}

export function topicPath(locale: Locale, category: Category): string {
  return localePath(locale, `/topics/${category}/`);
}

function toPost(entry: PostEntry): Post | null {
  const [lang, ...rest] = entry.id.split("/");
  if (!isLocale(lang) || rest.length === 0) {
    throw new Error(`文章目录必须是 src/content/posts/<语言码>/<slug>.md,收到:${entry.id}`);
  }
  const slug = rest.join("/");
  const { data } = entry;
  const published = data.pubDate;
  const modified = data.updatedDate ?? data.pubDate;
  const body = entry.body ?? "";
  return {
    entry,
    locale: lang,
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    term: data.term,
    termDefinition: data.term ? leadDefinition(body) : undefined,
    tags: data.tags,
    faq: data.faq,
    featured: data.featured,
    published,
    modified,
    showUpdated: modified.getTime() - published.getTime() > 24 * 3600 * 1000,
    readingMinutes: readingMinutes(body),
    body,
    path: postPath(lang, slug),
  };
}

let cache: Promise<Post[]> | undefined;

/** 全部已发布文章,按发布时间从新到旧。构建期只读一次。 */
export function getAllPosts(): Promise<Post[]> {
  cache ??= getCollection("posts", ({ data }) => !data.draft).then((entries) =>
    entries
      .map(toPost)
      .filter((p): p is Post => p !== null)
      .sort((a, b) => b.published.getTime() - a.published.getTime() || a.slug.localeCompare(b.slug)),
  );
  return cache;
}

export async function getPosts(locale: Locale): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.locale === locale);
}

/** 有文章的语言(按 LOCALES 的顺序)。语言菜单、sitemap 都只列这些。 */
export async function getContentLocales(): Promise<Locale[]> {
  const all = await getAllPosts();
  const have = new Set(all.map((p) => p.locale));
  return LOCALES.filter((l) => have.has(l));
}

/** 某个 slug 真有译文的语言(hreflang 只指向这些)。 */
export async function getTranslationLocales(slug: string): Promise<Locale[]> {
  const all = await getAllPosts();
  const have = new Set(all.filter((p) => p.slug === slug).map((p) => p.locale));
  return LOCALES.filter((l) => have.has(l));
}

export function countByCategory(posts: Post[]): Map<Category, number> {
  const map = new Map<Category, number>();
  for (const p of posts) map.set(p.category, (map.get(p.category) ?? 0) + 1);
  return map;
}

/** 相关文章:同分类优先,其次标签重合多的,再按时间,取前 `limit` 条(默认 3,正好一行三列)。 */
export function relatedPosts(current: Post, pool: Post[], limit = 3): Post[] {
  const tags = new Set(current.tags.map((t) => t.toLowerCase()));
  const scored = pool
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      p,
      score: (p.category === current.category ? 10 : 0) + p.tags.filter((t) => tags.has(t.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score || b.p.published.getTime() - a.p.published.getTime());
  return scored.slice(0, limit).map((s) => s.p);
}

export function isDefaultLocale(locale: Locale): boolean {
  return locale === DEFAULT_LOCALE;
}

export function htmlLang(locale: Locale): string {
  return LOCALE_META[locale].htmlLang;
}
