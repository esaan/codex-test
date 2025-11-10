import { promises as fs } from 'fs';
import path from 'path';
import type { Review } from './types';

const DATA_PATH = path.join(process.cwd(), 'data', 'blogReviews.json');

async function readFile(): Promise<Review[]> {
  try {
    const buf = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(buf) as Review[];
  } catch (e: any) {
    if (e && e.code === 'ENOENT') return [];
    throw e;
  }
}

async function writeFile(items: Review[]): Promise<void> {
  const body = JSON.stringify(items, null, 2) + '\n';
  await fs.writeFile(DATA_PATH, body, 'utf8');
}

export function validateReviewInput(input: any):
  | { ok: true; value: { rating: 1 | 2 | 3 | 4 | 5; comment: string; author?: string } }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') return { ok: false, error: 'Invalid body' };
  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: 'Rating must be an integer 1-5' };
  }
  if (typeof input.comment !== 'string' || !input.comment.trim()) {
    return { ok: false, error: "Missing or invalid 'comment'" };
  }
  const comment = input.comment.trim();
  if (comment.length > 2000) return { ok: false, error: 'Comment too long (max 2000)' };
  const author = typeof input.author === 'string' ? input.author.trim() : undefined;
  return { ok: true, value: { rating: rating as 1|2|3|4|5, comment, author } };
}

export async function listReviews(blogId: string): Promise<Review[]> {
  const all = await readFile();
  return all.filter((r) => r.blogId === blogId);
}

export async function getReview(blogId: string, reviewId: string): Promise<Review | undefined> {
  const all = await readFile();
  return all.find((r) => r.blogId === blogId && r.id === reviewId);
}

export async function createReview(blogId: string, input: { rating: 1|2|3|4|5; comment: string; author?: string }): Promise<Review> {
  const all = await readFile();
  const id = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const createdAt = new Date().toISOString();
  const review: Review = { id, blogId, rating: input.rating, comment: input.comment, author: input.author, createdAt };
  all.push(review);
  await writeFile(all);
  return review;
}

export async function deleteReview(blogId: string, reviewId: string): Promise<boolean> {
  const all = await readFile();
  const next = all.filter((r) => !(r.blogId === blogId && r.id === reviewId));
  if (next.length === all.length) return false;
  await writeFile(next);
  return true;
}

export async function getRatingSummary(blogId: string): Promise<{ average: number; count: number }> {
  const items = await listReviews(blogId);
  const count = items.length;
  const average = count ? items.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { average, count };
}

