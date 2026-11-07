import type { APIContext, GetStaticPaths } from "astro";
import { langParam } from "@/i18n/paths";
import { postToMarkdown } from "@/lib/markdown";
import { getAllPosts, type Post } from "@/lib/posts";

/** 每篇文章的纯 Markdown 版本(`/posts/<slug>.md`、`/zh/posts/<slug>.md` ……),给大模型 / 答案引擎抓取。 */
export const getStaticPaths = (async () => {
  const all = await getAllPosts();
  return all.map((post) => ({ params: { lang: langParam(post.locale), slug: post.slug }, props: { post } }));
}) satisfies GetStaticPaths;

export function GET(context: APIContext) {
  const { post } = context.props as { post: Post };
  return new Response(postToMarkdown(post, context.site!), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
