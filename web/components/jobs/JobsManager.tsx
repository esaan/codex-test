"use client";

import { useEffect, useMemo, useState } from "react";
import JobsExplorer from "@/components/jobs/JobsExplorer";
import type { Job } from "@/lib/types";
import paths from "@/paths";

type JobInput = {
  title: string;
  company: string;
  location: string;
  remote: "Remote" | "Hybrid" | "Onsite";
  type: "Full-time" | "Contract" | "Part-time" | "Internship";
  url: string;
  tags: string[];
  description?: string;
};

const emptyJob: JobInput = {
  title: "",
  company: "",
  location: "",
  remote: "Remote",
  type: "Full-time",
  url: "",
  tags: [],
  description: "",
};

export default function JobsManager() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<JobInput>(emptyJob);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState<JobInput>(emptyJob);
  const [adminToken, setAdminToken] = useState<string>("");
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "error"; text: string }[]>([]);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const pushToast = (type: "success" | "error", text: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(paths.ApiJobs(), { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`);
        const data = (await res.json()) as Job[];
        if (alive) setJobs(data);
      } catch (e: any) {
        if (alive) setError(e.message || "Failed to load jobs");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Admin token persistence
  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminToken") || "";
      setAdminToken(stored);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("adminToken", adminToken || "");
    } catch {}
  }, [adminToken]);

  const authHeaders: Record<string, string> = useMemo(
    () => (adminToken ? { "x-admin-token": adminToken } : ({} as Record<string, string>)),
    [adminToken]
  );

  const onDelete = async (id: string) => {
    if (!jobs) return;
    if (!confirm("Delete this job? This cannot be undone.")) return;
    const prev = jobs;
    setJobs(prev.filter((j) => j.id !== id));
    const res = await fetch(paths.ApiJob(id), { method: "DELETE", headers: { ...authHeaders } });
    if (!res.ok) {
      // revert on failure
      setJobs(prev);
      pushToast("error", "Failed to delete job");
    } else {
      pushToast("success", "Job deleted");
    }
  };

  const onEdit = (job: Job) => {
    setEditing(job);
    setEditError(null);
    setEditForm({
      title: job.title,
      company: job.company,
      location: job.location,
      remote: job.remote,
      type: job.type,
      url: job.url,
      tags: job.tags,
      description: job.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canSubmitEdit = useMemo(() => {
    return (
      editForm.title.trim() &&
      editForm.company.trim() &&
      editForm.location.trim() &&
      editForm.url.trim()
    );
  }, [editForm]);

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !jobs || saving || !canSubmitEdit) return;
    setSaving(true);
    setEditError(null);
    const patch: Partial<Job> = {
      title: editForm.title.trim(),
      company: editForm.company.trim(),
      location: editForm.location.trim(),
      remote: editForm.remote,
      type: editForm.type,
      url: editForm.url.trim(),
      tags: editForm.tags,
      description: editForm.description?.trim() || undefined,
    };
    const prev = jobs;
    setJobs(
      jobs.map((j) => (j.id === editing.id ? { ...j, ...patch } : j))
    );
    try {
      const res = await fetch(paths.ApiJob(editing.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        let msg = "Failed to update job";
        try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
        throw new Error(msg);
      }
      const updated = (await res.json()) as Job;
      setJobs((curr) => (curr || []).map((j) => (j.id === updated.id ? updated : j)));
      setEditing(null);
    } catch (err) {
      setJobs(prev); // revert on failure
      const msg = err instanceof Error ? err.message : "Failed to update job";
      setEditError(msg);
      pushToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.company.trim() &&
      form.location.trim() &&
      form.url.trim()
    );
  }, [form]);

  const submitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || saving || !jobs) return;
    setSaving(true);
    setAddError(null);
    const tempId = `temp-${Math.random().toString(36).slice(2)}`;
    const optimistic: Job = {
      id: tempId,
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      remote: form.remote,
      type: form.type,
      url: form.url.trim(),
      tags: form.tags,
      description: form.description?.trim() || undefined,
      postedAt: new Date().toISOString(),
    };
    const prev = jobs;
    setJobs([optimistic, ...jobs]);
    try {
      const res = await fetch(paths.ApiJobs(), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ ...optimistic, id: undefined }),
      });
      if (!res.ok) {
        let msg = "Failed to create job";
        try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
        throw new Error(msg);
      }
      const created = (await res.json()) as Job;
      setJobs((curr) =>
        (curr || []).map((j) => (j.id === tempId ? created : j))
      );
      setIsAdding(false);
      setForm(emptyJob);
      pushToast("success", "Job created");
    } catch (err) {
      setJobs(prev); // revert
      const msg = err instanceof Error ? err.message : "Failed to create job";
      setAddError(msg);
      pushToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {/* Toasts */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center">
        <div className="flex max-w-xl flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-md border px-3 py-2 text-sm shadow-sm ${
                t.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
                  : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
              }`}
            >
              {t.text}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sitecore XM Cloud Jobs</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Browse, add, and manage roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="Admin token (optional)"
            className="w-56 rounded-lg border px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            onClick={() => setIsAdding((v) => !v)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            {isAdding ? "Close" : "Add job"}
          </button>
        </div>
      </div>

      {editing && (
        <form
          onSubmit={submitEdit}
          className="mb-6 rounded-xl border bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
        >
          <h2 className="mb-3 text-lg font-semibold">Edit job: {editing.title}</h2>
          {editError && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              {editError}
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Title"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              required
              value={editForm.company}
              onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
              placeholder="Company"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              required
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              placeholder="Location"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <select
              value={editForm.remote}
              onChange={(e) => setEditForm({ ...editForm, remote: e.target.value as any })}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
            <select
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option>Full-time</option>
              <option>Contract</option>
              <option>Part-time</option>
              <option>Internship</option>
            </select>
            <input
              required
              type="url"
              value={editForm.url}
              onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
              placeholder="Job URL (https://...)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2 lg:col-span-3"
            />
            <input
              value={editForm.tags.join(", ")}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Tags (comma separated)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2 lg:col-span-3"
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={!canSubmitEdit || saving}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isAdding && (
        <form
          onSubmit={submitNew}
          className="mb-6 rounded-xl border bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
        >
          {addError && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              {addError}
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Location"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <select
              value={form.remote}
              onChange={(e) => setForm({ ...form, remote: e.target.value as any })}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option>Full-time</option>
              <option>Contract</option>
              <option>Part-time</option>
              <option>Internship</option>
            </select>
            <input
              required
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="Job URL (https://...)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2 lg:col-span-3"
            />
            <input
              value={form.tags.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Tags (comma separated)"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 sm:col-span-2 lg:col-span-3"
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create job"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setForm(emptyJob);
              }}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && (
        <div className="rounded-xl border p-6 text-center text-slate-600 dark:border-slate-700 dark:text-slate-300">
          Loading jobs...
        </div>
      )}
      {error && (
        <div className="rounded-xl border p-6 text-center text-red-600 dark:border-slate-700 dark:text-red-400">
          {error}
        </div>
      )}
      {jobs && (
        <JobsExplorer
          jobs={jobs}
          actions={{
            onDelete,
            onEdit,
            onCopy: () => pushToast("success", "Link copied"),
          }}
        />
      )}
    </section>
  );
}
