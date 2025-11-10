import { getBlogBySlug } from "@/lib/blogsStore";
import type { Metadata } from "next";
import BlogReviews from "@/components/blogs/BlogReviews";
import { getRatingSummary } from "@/lib/reviewsStore";

export const runtime = 'nodejs';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  return {
    title: blog ? blog.title : 'Post not found',
    description: blog?.excerpt || undefined,
  };
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">The requested blog post does not exist.</p>
      </section>
    );
  }
  const rating = await getRatingSummary(blog.id);
  const rounded = Math.round(rating.average);
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {blog.title}
          <span className="ml-3 align-middle text-base font-normal text-slate-700 dark:text-slate-300">
            {rating.count > 0 ? (
              <>
                <span className="text-yellow-500 mr-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < rounded ? '\u2605' : '\u2606'}</span>
                  ))}
                </span>
                {rating.average.toFixed(1)} ({rating.count})
              </>
            ) : (
              <span className="text-sm text-slate-500">No ratings</span>
            )}
          </span>
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {`Published ${formatDate(blog.publishedAt)}`}{blog.updatedAt ? ` \u2022 Updated ${formatDate(blog.updatedAt)}` : ''}{blog.author ? ` \u2022 ${blog.author}` : ''}
        </p>
        {blog.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {blog.tags.map((t) => (
              <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{t}</span>
            ))}
          </div>
        )}
      </header>
      <div className="prose max-w-none dark:prose-invert">
        {blog.content.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <BlogReviews blogId={blog.id} />
    </article>
  );
}
