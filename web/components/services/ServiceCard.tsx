import Link from "next/link";

import type { ServiceOffering } from "./types";

interface ServiceCardProps {
  service: ServiceOffering;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const telHref = `tel:${service.contactPhone.replace(/[^\d]/g, "")}`;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              {service.careCategory} Care
            </span>
            {service.referralRequired && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                Referral required
              </span>
            )}
            {service.featured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Featured</span>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">{service.name}</h3>
            <p className="mt-1 text-sm font-medium text-slate-700">{service.tagline}</p>
            <p className="mt-2 text-sm text-slate-600">{service.summary}</p>
          </div>
          <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Service lines
              </p>
              <ul className="mt-2 space-y-1">
                {service.serviceLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Available in
              </p>
              <p className="mt-2">{service.locationsServed.join(", ")}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Appointment options
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {service.appointmentOptions.map((option) => (
                <span
                  key={option}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Highlights
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {service.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 md:w-72">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Schedule care
            </p>
            <p className="text-lg font-semibold text-slate-900">{service.contactPhone}</p>
          </div>
          <a
            href={telHref}
            className="rounded-full border border-sky-200 px-4 py-2 text-center text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
          >
            Call now
          </a>
          <button
            type="button"
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Request appointment
          </button>
          <Link
            href="/doctors"
            className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
          >
            See providers
          </Link>
        </div>
      </div>
    </article>
  );
}
