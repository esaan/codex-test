import Link from "next/link";

import type { NewsArticle } from "./types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const publishedDate = dateFormatter.format(new Date(article.publishedAt));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{article.category}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{article.storyType}</span>
          {article.featured && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Featured</span>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {publishedDate} - {article.readTime} min read
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-900">{article.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{article.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            By <span className="font-semibold text-slate-900">{article.author}</span>
          </p>
          <Link
            href={article.link}
            className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            Read article &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
