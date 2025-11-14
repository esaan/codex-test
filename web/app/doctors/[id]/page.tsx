import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import type { Doctor } from "@/components/doctors/types";
import doctorsData from "@/data/doctors.json";

const doctors = doctorsData as Doctor[];

type Params = {
  id: string;
};

function getDoctorById(id: string) {
  return doctors.find((doctor) => doctor.id === id);
}

export async function generateStaticParams() {
  return doctors.map((doctor) => ({ id: doctor.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const doctor = getDoctorById(id);

  if (!doctor) {
    return {
      title: "Doctor Not Found | FictionalHealthCare",
      description: "We could not find the requested doctor profile.",
    };
  }

  return {
    title: `${doctor.name} | FictionalHealthCare`,
    description: `View ${doctor.name}'s profile, specialties, and appointment information.`,
  };
}

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const doctor = getDoctorById(id);

  if (!doctor) {
    notFound();
  }

  const telHref = `tel:${doctor.phone.replace(/[^\d]/g, "")}`;

  return (
    <main className="bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/doctors"
          className="inline-flex items-center text-sm font-semibold text-sky-700 transition hover:text-sky-900"
        >
          Back to doctor search
        </Link>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200">
              <Image
                src="/assets/doctor-placeholder.svg"
                alt={`${doctor.name} profile illustration`}
                width={96}
                height={96}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                  {doctor.specialties.join(" \u2022 ")}
                </p>
                <h1 className="text-3xl font-bold text-slate-900">{doctor.name}</h1>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                <span>{doctor.yearsExperience}+ years experience</span>
                <span aria-hidden="true">|</span>
                <span>Speaks {doctor.languages.join(", ")}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
                {doctor.acceptingNewPatients ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                    Accepting New Patients
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">
                    Waitlist Only
                  </span>
                )}
                {doctor.virtualVisits && (
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                    Virtual Visits Available
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center rounded-full border border-sky-200 px-5 py-2 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  Call {doctor.phone}
                </a>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  Schedule Visit
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Locations</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {doctor.locations.map((location) => (
                <li key={location} className="rounded-lg bg-slate-50 px-4 py-2">
                  {location}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Top Conditions Treated</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {doctor.topConditions.map((condition) => (
                <li key={condition} className="flex items-center gap-2">
                  <span className="text-sky-500">{`\u2022`}</span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">About this provider</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            {doctor.name.split(",")[0]} partners with patients to deliver compassionate, evidence-based care.
            With expertise in {doctor.specialties.join(", ").toLowerCase()}, they focus on helping patients manage
            top concerns like {doctor.topConditions[0].toLowerCase()} while creating personalized care plans.
          </p>
        </section>
      </div>
    </main>
  );
}
