import type { Doctor } from "./types";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const initials =
    doctor.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "MD";

  return (
    <article
      key={doctor.id}
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{doctor.name}</h3>
          <p className="text-sm font-medium text-slate-500">
            {doctor.specialties.join(" • ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {doctor.acceptingNewPatients ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
              Accepting Patients
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">
              Waitlist Only
            </span>
          )}
          {doctor.virtualVisits && (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
              Virtual Visits
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-slate-900">Locations</p>
          <ul className="mt-1 space-y-1">
            {doctor.locations.map((location) => (
              <li key={location}>{location}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Top Conditions</p>
          <ul className="mt-1 space-y-1">
            {doctor.topConditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Languages</p>
          <p className="mt-1">{doctor.languages.join(", ")}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Experience</p>
          <p className="mt-1">{doctor.yearsExperience}+ years</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          className="text-sm font-semibold text-sky-700 hover:text-sky-800"
          href={`tel:${doctor.phone.replace(/[^\d]/g, "")}`}
        >
          Call {doctor.phone}
        </a>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
          >
            View Profile
          </button>
          <button
            type="button"
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Schedule Visit
          </button>
        </div>
      </div>
    </article>
  );
}
