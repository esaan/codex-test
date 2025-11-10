"use client";

import { useEffect, useMemo, useState } from "react";
import { gql } from "@/lib/graphqlClient";

type Review = {
  id: string;
  blogId: string;
  rating: 1|2|3|4|5;
  comment: string;
  author?: string;
  createdAt: string;
};

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span aria-label={`${value.toFixed(1)} out of 5`} title={`${value.toFixed(1)} / 5`} className="text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? '\u2605' : '\u2606'}</span>
      ))}
    </span>
  );
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

export default function BlogReviews({ blogId }: { blogId: string }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  useEffect(() => {
    try { setAdminToken(localStorage.getItem('adminToken') || ''); } catch {}
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await gql<{ reviews: Review[] }>(
          `query Reviews($id: ID!) { reviews(blogId: $id) { id blogId rating comment author createdAt } }`,
          { id: blogId }
        );
        if (alive) setReviews(data.reviews);
      } catch (e: any) {
        if (alive) setError(e.message || 'Failed to load reviews');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [blogId]);

  const summary = useMemo(() => {
    if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
    const count = reviews.length;
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / count;
    return { avg, count };
  }, [reviews]);

  const canSubmit = comment.trim().length > 0 && rating >= 1 && rating <= 5;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      const data = await gql<{ createReview: Review }>(
        `mutation CreateReview($id: ID!, $input: ReviewInput!) { createReview(blogId: $id, input: $input) { id blogId rating comment author createdAt } }`,
        { id: blogId, input: { rating, comment, author: name.trim() || undefined } }
      );
      const created = data.createReview;
      setReviews((arr) => (arr ? [created, ...arr] : [created]));
      setName("");
      setRating(5);
      setComment("");
    } catch (e) {
      alert((e as any).message || 'Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return;
    const prev = reviews || [];
    setReviews(prev.filter((r) => r.id !== reviewId));
    try {
      await gql<{ deleteReview: boolean }>(
        `mutation DeleteReview($blogId: ID!, $reviewId: ID!) { deleteReview(blogId: $blogId, reviewId: $reviewId) }`,
        { blogId, reviewId },
        { adminToken }
      );
    } catch {
      setReviews(prev);
      alert('Failed to delete review');
    }
  };

  return (
    <section className="mt-10">
      <h2 className="mb-2 text-xl font-semibold">Reviews</h2>
      {loading && <p className="text-sm text-slate-600 dark:text-slate-300">Loading...</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {reviews && (
        <div className="mb-6 rounded-lg border p-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Stars value={summary.avg} />
            <span className="text-sm text-slate-600 dark:text-slate-300">{summary.count} review{summary.count === 1 ? '' : 's'}</span>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mb-8 space-y-3 rounded-lg border p-4 dark:border-slate-700">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
            {[5,4,3,2,1].map((r) => (
              <option key={r} value={r}>{r} star{r===1?'':'s'}</option>
            ))}
          </select>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review" rows={4} className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" />
        </div>
        <button type="submit" disabled={!canSubmit || saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? 'Submitting...' : 'Submit review'}</button>
      </form>

      {reviews && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-md border p-3 dark:border-slate-700">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stars value={r.rating} />
                  <span className="text-sm font-medium">{r.author || 'Anonymous'}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(r.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{r.comment}</p>
              <div className="mt-2 text-right">
                <button onClick={() => remove(r.id)} className="text-xs text-red-600 hover:text-red-700">Delete (admin)</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
