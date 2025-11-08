"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Job } from "@/lib/types";

type Props = {
  jobs: Job[];
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return `just now`;
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr)).filter(Boolean) as T[];
}

type Actions = {
  onDelete?: (id: string) => void;
  onEdit?: (job: Job) => void;
  onCopy?: (url?: string) => void;
};

export default function JobsExplorer({ jobs, actions }: Props & { actions?: Actions }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All");
  const [remote, setRemote] = useState("All");
  const [type, setType] = useState("All");
  const [tag, setTag] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const allLocations = useMemo(
    () => unique(jobs.map((j) => j.location)).sort(),
    [jobs]
  );
  const allRemote = useMemo(
    () => unique(jobs.map((j) => j.remote)),
    [jobs]
  );
  const allTypes = useMemo(() => unique(jobs.map((j) => j.type)), [jobs]);
  const allTags = useMemo(
    () => unique(jobs.flatMap((j) => j.tags)).sort(),
    [jobs]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchesQuery = q
        ? `${j.title} ${j.company} ${j.location} ${j.tags.join(" ")}`
            .toLowerCase()
            .includes(q)
        : true;
      const matchesLocation = location === "All" || j.location === location;
      const matchesRemote = remote === "All" || j.remote === (remote as any);
      const matchesType = type === "All" || j.type === (type as any);
      const matchesTag = tag === "All" || j.tags.includes(tag);
      return (
        matchesQuery &&
        matchesLocation &&
        matchesRemote &&
        matchesType &&
        matchesTag
      );
    });
  }, [jobs, query, location, remote, type, tag]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, location, remote, type, tag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, filtered.length);
  const paged = filtered.slice(start, end);

  const activeFilters = useMemo(() => {
    let c = 0;
    if (query) c++;
    if (location !== "All") c++;
    if (remote !== "All") c++;
    if (type !== "All") c++;
    if (tag !== "All") c++;
    return c;
  }, [query, location, remote, type, tag]);

  const clearFilters = () => {
    setQuery("");
    setLocation("All");
    setRemote("All");
    setType("All");
    setTag("All");
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Sitecore XM Cloud Jobs</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          Browse roles across engineering, architecture, and content for XM Cloud.
        </p>
      </header>

      <div className="mb-6 rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, company, tags..."
            className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800"
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option>All</option>
            {allLocations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <select
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option>All</option>
            {allRemote.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option>All</option>
            {allTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option>All</option>
            {allTags.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="text-slate-600 dark:text-slate-300">
            Showing <span className="font-medium">{filtered.length}</span> of {jobs.length} roles
          </div>
          <button
            onClick={clearFilters}
            disabled={activeFilters === 0}
            className="rounded-md px-3 py-1.5 font-medium disabled:opacity-40 disabled:cursor-not-allowed bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-disabled={activeFilters === 0}
          >
            Clear filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:text-slate-300">
          No roles match your filters.
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {paged.map((j) => (
            <li
              key={j.id}
              className="group rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight group-hover:text-blue-600">
                    {j.title}
                  </h2>
                  <div className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                    {j.company} • {j.location}
                  </div>
                </div>
                <div className="text-xs text-slate-500">{timeAgo(j.postedAt)}</div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-800/60">
                  {j.remote}
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/60">
                  {j.type}
                </span>
              </div>

              {j.description && (
                <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                  {j.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {j.tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    title={`Filter by ${t}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  href={`/jobs/${j.id}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
                >
                  View details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M5 10a1 1 0 011-1h5.586L9.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L11.586 11H6a1 1 0 01-1-1z" />
                  </svg>
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(j.url);
                      actions?.onCopy?.(j.url);
                    } catch {}
                  }}
                  className="ml-2 inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  title="Copy link"
                >
                  Copy link
                </button>
                {(actions?.onEdit || actions?.onDelete) && (
                  <span className="ml-2 inline-flex gap-2">
                    {actions?.onEdit && (
                      <button
                        onClick={() => actions.onEdit?.(j)}
                        className="rounded-lg border px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        title="Edit"
                      >
                        Edit
                      </button>
                    )}
                    {actions?.onDelete && (
                      <button
                        onClick={() => actions.onDelete?.(j.id)}
                        className="rounded-lg border px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-slate-800"
                        title="Delete"
                      >
                        Delete
                      </button>
                    )}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* Pagination controls */}
      {filtered.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Showing <span className="font-medium">{start + 1}-{end}</span> of {filtered.length} roles
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700"
            >
              Prev
            </button>
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700"
            >
              Next
            </button>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value, 10) || 10)}
              className="ml-2 rounded-md border px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
              title="Page size"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </section>
  );
}
