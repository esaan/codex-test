"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { gql } from "@/lib/graphqlClient";
import BlogRatingBadge from "@/components/blogs/BlogRatingBadge";
import type { Blog } from "@/lib/types";
import paths from "@/paths";

type BlogInput = {
  title: string;
  slug?: string;
  content: string;
  tags: string[];
  author?: string;
  excerpt?: string;
  // UI-only field for datetime-local input
  publishedAtLocal?: string;
};

const empty: BlogInput = {
  title: "",
  slug: "",
  content: "",
  tags: [],
  author: "",
  excerpt: "",
  publishedAtLocal: "",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function toLocalDatetimeValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function localToISO(local?: string) {
  if (!local) return undefined;
  const d = new Date(local);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string>("");
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "error"; text: string }[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<BlogInput>(empty);
  const [addError, setAddError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [editForm, setEditForm] = useState<BlogInput>(empty);
  const [editError, setEditError] = useState<string | null>(null);

  const pushToast = (type: "success" | "error", text: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await gql<{ blogs: Blog[] }>(`query { blogs { id title slug content publishedAt updatedAt tags author excerpt } }`);
        if (alive) setBlogs(data.blogs);
      } catch (e: any) {
        if (alive) setError(e.message || "Failed to load blogs");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Admin token persistence
  useEffect(() => {
    try { setAdminToken(localStorage.getItem("adminToken") || ""); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("adminToken", adminToken || ""); } catch {}
  }, [adminToken]);

  const authHeaders: Record<string, string> = useMemo(
    () => (adminToken ? { "x-admin-token": adminToken } : ({} as Record<string, string>)),
    [adminToken]
  );

  const canSubmitAdd = useMemo(() => form.title.trim() && form.content.trim(), [form]);
  const canSubmitEdit = useMemo(() => editForm.title.trim() && editForm.content.trim(), [editForm]);

  const resetAdd = () => { setForm(empty); setAddError(null); setAdding(false); };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitAdd) return;
    setSaving(true);
    setAddError(null);
    try {
      const data = await gql<{ createBlog: Blog }>(
        `mutation CreateBlog($input: BlogInput!) { createBlog(input: $input) { id title slug content publishedAt updatedAt tags author excerpt } }`,
        { input: { title: form.title.trim(), slug: form.slug?.trim() || undefined, content: form.content, tags: form.tags, author: form.author?.trim() || undefined, excerpt: form.excerpt?.trim() || undefined, publishedAt: localToISO(form.publishedAtLocal) } },
        { adminToken }
      );
      const created = data.createBlog;
      setBlogs((b) => (b ? [created, ...b] : [created]));
      resetAdd();
      pushToast("success", "Blog created");
    } catch (e: any) {
      setAddError(e.message || "Failed to add blog");
      pushToast("error", "Failed to add blog");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!blogs) return;
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    const prev = blogs;
    setBlogs(prev.filter((b) => b.id !== id));
    try {
      await gql<{ deleteBlog: boolean }>(`mutation($id: ID!){ deleteBlog(id:$id) }`, { id }, { adminToken });
      pushToast("success", "Blog deleted");
    } catch {
      setBlogs(prev);
      pushToast("error", "Failed to delete blog");
    }
  };

  const onEdit = (blog: Blog) => {
    setEditing(blog);
    setEditError(null);
    setEditForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      tags: blog.tags,
      author: blog.author || "",
      excerpt: blog.excerpt || "",
      publishedAtLocal: toLocalDatetimeValue(blog.publishedAt),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!canSubmitEdit) return;
    setSaving(true);
    setEditError(null);
    try {
      const data = await gql<{ updateBlog: Blog }>(
        `mutation UpdateBlog($id: ID!, $input: BlogPatch!) { updateBlog(id:$id, input:$input) { id title slug content publishedAt updatedAt tags author excerpt } }`,
        { id: editing.id, input: { title: editForm.title.trim(), slug: editForm.slug?.trim() || undefined, content: editForm.content, tags: editForm.tags, author: editForm.author?.trim() || undefined, excerpt: editForm.excerpt?.trim() || undefined, publishedAt: localToISO(editForm.publishedAtLocal) } },
        { adminToken }
      );
      const updated = data.updateBlog;
      setBlogs((arr) => (arr ? arr.map((b) => (b.id === updated.id ? updated : b)) : [updated]));
      setEditing(null);
      pushToast("success", "Blog updated");
    } catch (e: any) {
      setEditError(e.message || "Failed to update blog");
      pushToast("error", "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  const parseTags = (v: string) => v.split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">Create, edit, and manage blog posts.</p>
      </header>

      <div className="mb-6 flex items-center gap-3 rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
        <input
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          placeholder="Admin token (optional)"
          className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <button
          onClick={() => setAdding((s) => !s)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {adding ? 'Close' : 'New Post'}
        </button>
      </div>

      {adding && (
        <form onSubmit={submitAdd} className="mb-6 rounded-xl border bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h2 className="mb-3 text-lg font-semibold">Add new post</h2>
          {addError && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">{addError}</div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="Slug (optional)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Author (optional)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Excerpt (optional)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              type="datetime-local"
              value={form.publishedAtLocal}
              onChange={(e) => setForm({ ...form, publishedAtLocal: e.target.value })}
              placeholder="Published at (optional)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              value={form.tags.join(', ')}
              onChange={(e) => setForm({ ...form, tags: parseTags(e.target.value) })}
              placeholder="Tags (comma separated)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2"
            />
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Content"
              rows={10}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2"
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving || !canSubmitAdd}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create post'}
            </button>
            <button type="button" onClick={resetAdd} className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Cancel</button>
          </div>
        </form>
      )}

      {editing && (
        <form onSubmit={submitEdit} className="mb-6 rounded-xl border bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h2 className="mb-3 text-lg font-semibold">Edit post: {editing.title}</h2>
          {editError && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">{editError}</div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <input required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            <input value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} placeholder="Slug (optional)" className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            <input value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} placeholder="Author (optional)" className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            <input value={editForm.excerpt} onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })} placeholder="Excerpt (optional)" className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            <input type="datetime-local" value={editForm.publishedAtLocal} onChange={(e) => setEditForm({ ...editForm, publishedAtLocal: e.target.value })} placeholder="Published at (optional)" className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            <input value={editForm.tags.join(', ')} onChange={(e) => setEditForm({ ...editForm, tags: parseTags(e.target.value) })} placeholder="Tags (comma separated)" className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" />
            <textarea required value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} placeholder="Content" rows={10} className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2" />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button type="submit" disabled={saving || !canSubmitEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button>
            <button type="button" onClick={() => setEditing(null)} className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Cancel</button>
          </div>
        </form>
      )}

      {loading && <p className="text-sm text-slate-600 dark:text-slate-300">Loading...</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {blogs && blogs.length === 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-300">No posts yet. Create one above.</p>
      )}
      {blogs && blogs.length > 0 && (
        <div className="divide-y rounded-xl border bg-white/80 shadow-sm backdrop-blur dark:divide-slate-800 dark:border-slate-700 dark:bg-slate-900/60">
          {blogs.map((b) => (
            <article key={b.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    <Link href={paths.BlogPostPage(b.slug)}>{b.title}</Link>
                    <BlogRatingBadge blogId={b.id} />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{`Published ${formatDate(b.publishedAt)}`}{b.updatedAt ? ` \u2022 Updated ${formatDate(b.updatedAt)}` : ''}{b.author ? ` \u2022 ${b.author}` : ''}</p>
                  {b.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {b.tags.map((t) => (
                        <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0 space-x-2">
                  <Link href={paths.BlogPostPage(b.slug)} className="text-sm text-blue-600 hover:underline">View</Link>
                  <button onClick={() => onEdit(b)} className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Edit</button>
                  <button onClick={() => onDelete(b.id)} className="text-sm text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
              {b.excerpt && <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{b.excerpt}</p>}
            </article>
          ))}
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-md px-4 py-2 text-sm shadow ${t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{t.text}</div>
        ))}
      </div>
    </section>
  );
}
