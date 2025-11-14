import Link from "next/link";

import type { CommunityEvent } from "./types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const dateLabel = dateFormatter.format(start);

  if (sameDay) {
    return `${dateLabel} - ${timeFormatter.format(start)} to ${timeFormatter.format(end)}`;
  }

  return `${dateFormatter.format(start)} ${timeFormatter.format(
    start
  )} - ${dateFormatter.format(end)} ${timeFormatter.format(end)}`;
}

interface EventCardProps {
  event: CommunityEvent;
}

export function EventCard({ event }: EventCardProps) {
  const dateLabel = formatDateRange(event.startDate, event.endDate);
  const isAlmostFull = event.status.toLowerCase().includes("almost");

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{event.type}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{event.format}</span>
            {event.featured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Featured</span>
            )}
            {isAlmostFull && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">Almost full</span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{event.summary}</p>
          </div>
          <dl className="space-y-2 text-sm text-slate-600">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <dt className="font-semibold text-slate-900">When</dt>
              <dd>{dateLabel}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <dt className="font-semibold text-slate-900">Where</dt>
              <dd>
                {event.location}
                {event.city ? `, ${event.city}` : ""}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <dt className="font-semibold text-slate-900">Cost</dt>
              <dd>{event.cost}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</p>
            <p className="text-base font-semibold text-slate-900">
              {event.status} / {event.spots} spots
            </p>
          </div>
          <a
            href={`tel:${event.registrationPhone.replace(/[^\d]/g, "")}`}
            className="text-sky-700 hover:text-sky-900"
          >
            Call {event.registrationPhone}
          </a>
          <Link
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-full bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Register
          </Link>
        </div>
      </div>
    </article>
  );
}
