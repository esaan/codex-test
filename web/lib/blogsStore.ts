import { promises as fs } from 'fs';
import path from 'path';
import type { Blog } from './types';

const DATA_PATH = path.join(process.cwd(), 'data', 'blogs.json');

function normalizeBlog(raw: any): Blog {
  const isValidIso = (s: any) => typeof s === 'string' && !isNaN(new Date(s).getTime());
  const publishedAt = isValidIso(raw?.publishedAt)
    ? raw.publishedAt
    : isValidIso(raw?.updatedAt)
      ? raw.updatedAt
      : new Date().toISOString();
  const tags = Array.isArray(raw?.tags)
    ? raw.tags.filter((t: any) => typeof t === 'string')
    : [];
  return {
    id: String(raw.id),
    title: String(raw.title ?? ''),
    slug: String(raw.slug ?? ''),
    content: String(raw.content ?? ''),
    publishedAt,
    updatedAt: isValidIso(raw?.updatedAt) ? raw.updatedAt : undefined,
    tags,
    author: typeof raw?.author === 'string' ? raw.author : undefined,
    excerpt: typeof raw?.excerpt === 'string' ? raw.excerpt : undefined,
  } as Blog;
}

async function readFile(): Promise<Blog[]> {
  try {
    const buf = await fs.readFile(DATA_PATH, 'utf8');
    const arr = JSON.parse(buf) as any[];
    return Array.isArray(arr) ? arr.map(normalizeBlog) : [];
  } catch (e: any) {
    if (e && e.code === 'ENOENT') return [];
    throw e;
  }
}

async function writeFile(items: Blog[]): Promise<void> {
  const body = JSON.stringify(items, null, 2) + '\n';
  await fs.writeFile(DATA_PATH, body, 'utf8');
}

export async function listBlogs(): Promise<Blog[]> {
  return readFile();
}

export async function getBlog(id: string): Promise<Blog | undefined> {
  const blogs = await readFile();
  return blogs.find((b) => b.id === id);
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  const blogs = await readFile();
  return blogs.find((b) => b.slug === slug);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const blogs = await readFile();
  const existing = new Set(
    blogs.filter((b) => b.id !== excludeId).map((b) => b.slug)
  );
  if (!existing.has(base)) return base;
  let n = 2;
  while (existing.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export async function createBlog(input: Omit<Blog, 'id' | 'publishedAt'> & Partial<Pick<Blog, 'publishedAt'>>): Promise<Blog> {
  const blogs = await readFile();
  const id = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const publishedAt = input.publishedAt ?? new Date().toISOString();
  const baseSlug = input.slug && input.slug.trim() ? slugify(input.slug) : slugify(input.title);
  const slug = await ensureUniqueSlug(baseSlug);
  const blog: Blog = {
    id,
    title: input.title,
    slug,
    content: input.content,
    publishedAt,
    updatedAt: input.updatedAt,
    tags: input.tags ?? [],
    author: input.author,
    excerpt: input.excerpt,
  };
  blogs.unshift(blog);
  await writeFile(blogs);
  return blog;
}

export async function updateBlog(id: string, patch: Partial<Blog>): Promise<Blog | undefined> {
  const blogs = await readFile();
  const idx = blogs.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  const current = blogs[idx];
  let nextSlug = current.slug;
  if (typeof patch.slug === 'string') {
    const base = patch.slug.trim() ? slugify(patch.slug) : slugify(current.title);
    nextSlug = await ensureUniqueSlug(base, id);
  } else if (typeof patch.title === 'string' && !patch.slug) {
    // if title changes but slug not provided, keep existing slug
    nextSlug = current.slug;
  }
  const updated: Blog = {
    ...current,
    ...patch,
    slug: nextSlug,
    // Always keep original publishedAt unless an explicit valid value is provided
    publishedAt:
      typeof patch.publishedAt === 'string' && patch.publishedAt.trim()
        ? patch.publishedAt
        : current.publishedAt,
    updatedAt: new Date().toISOString(),
    id: current.id,
  };
  blogs[idx] = updated;
  await writeFile(blogs);
  return updated;
}

export async function deleteBlog(id: string): Promise<boolean> {
  const blogs = await readFile();
  const next = blogs.filter((b) => b.id !== id);
  if (next.length === blogs.length) return false;
  await writeFile(next);
  return true;
}

export function validateBlogInput(input: any):
  | { ok: true; value: Omit<Blog, 'id' | 'slug' | 'publishedAt' | 'updatedAt'> & Partial<Pick<Blog, 'slug' | 'publishedAt' | 'updatedAt'>> }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') return { ok: false, error: 'Invalid body' };
  if (!input.title || typeof input.title !== 'string' || !input.title.trim()) {
    return { ok: false, error: "Missing or invalid 'title'" };
  }
  if (!input.content || typeof input.content !== 'string' || !input.content.trim()) {
    return { ok: false, error: "Missing or invalid 'content'" };
  }
  // Optional fields
  const slug = typeof input.slug === 'string' ? input.slug : undefined;
  const author = typeof input.author === 'string' ? input.author : undefined;
  const excerpt = typeof input.excerpt === 'string' ? input.excerpt : undefined;
  const publishedAt = input.publishedAt && typeof input.publishedAt === 'string' ? input.publishedAt : undefined;

  // Tags: optional, max 10, 2-32 chars
  const tags: string[] = Array.isArray(input.tags)
    ? input.tags.filter((t: any) => typeof t === 'string').map((t: string) => t.trim()).filter(Boolean)
    : [];
  if (tags.length > 10) return { ok: false, error: 'Too many tags (max 10)' };
  if (tags.some((t) => t.length < 2 || t.length > 32)) {
    return { ok: false, error: 'Invalid tag(s): length must be 2-32' };
  }

  return {
    ok: true,
    value: {
      title: input.title,
      content: input.content,
      slug,
      author,
      excerpt,
      publishedAt,
      tags,
    },
  };
}
