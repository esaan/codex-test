import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJob } from '@/lib/jobsStore';
import paths from '@/paths';

type Params = {
  params: { id: string };
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default async function JobDetailsPage({ params }: Params) {
  const job = await getJob(params.id);
  if (!job) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <Link
          href={paths.JobsPage()}
          className="text-sm text-slate-600 underline hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          ← Back to jobs
        </Link>
      </div>

      <article className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <p className="mt-1 text-slate-700 dark:text-slate-200">
            <span className="font-medium">{job.company}</span>
            <span className="mx-2">•</span>
            <span>{job.location}</span>
            <span className="mx-2">•</span>
            <span>{job.remote}</span>
            <span className="mx-2">•</span>
            <span>{job.type}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Posted {formatDate(job.postedAt)}
          </p>
        </header>

        {job.description && (
          <p className="whitespace-pre-wrap leading-7 text-slate-800 dark:text-slate-100">
            {job.description}
          </p>
        )}

        {job.tags?.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((t) => (
              <li
                key={t}
                className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6">
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
          >
            Apply
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M5 10a1 1 0 011-1h5.586L9.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L11.586 11H6a1 1 0 01-1-1z" />
            </svg>
          </a>
        </div>
      </article>
    </main>
  );
}
