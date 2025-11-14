import Link from "next/link";

import type { LocationFacility } from "./types";

interface LocationCardProps {
  location: LocationFacility;
}

function formatAddress(location: LocationFacility) {
  const parts = [
    location.address.line1,
    location.address.line2,
    `${location.address.city}, ${location.address.state} ${location.address.zip}`,
  ].filter(Boolean);

  return parts.join(", ");
}

function buildMapsUrl(location: LocationFacility) {
  const query = encodeURIComponent(
    `${location.name} ${location.address.line1} ${location.address.city} ${location.address.state}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function LocationCard({ location }: LocationCardProps) {
  const addressText = formatAddress(location);
  const mapsUrl = buildMapsUrl(location);
  const telHref = `tel:${location.phone.replace(/[^\d]/g, "")}`;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              {location.facilityType}
            </span>
            {location.featured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Featured</span>
            )}
            {location.acceptingNewPatients && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                Accepting Patients
              </span>
            )}
            {location.virtualVisits && (
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                Virtual Visits
              </span>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-slate-900">{location.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{location.shortDescription}</p>
          </div>

          <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Address</dt>
              <dd className="mt-1">{addressText}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Hours</dt>
              <dd className="mt-1">{location.hours}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Care types</dt>
              <dd className="mt-1 text-slate-700">{location.careTypes.join(", ")}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Specialties</dt>
              <dd className="mt-1 text-slate-700">{location.specialties.join(", ")}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 lg:w-72">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Call</p>
            <p className="text-lg font-semibold text-slate-900">{location.phone}</p>
          </div>
          <a
            href={telHref}
            className="rounded-full border border-sky-200 px-4 py-2 text-center text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
          >
            Call this location
          </a>
          <Link
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
          >
            Get directions
          </Link>
          <button
            type="button"
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Schedule visit
          </button>
        </div>
      </div>
    </article>
  );
}
