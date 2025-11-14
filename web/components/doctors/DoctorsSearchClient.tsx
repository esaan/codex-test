"use client";

import { useMemo, useState } from "react";

import type { Doctor } from "./types";
import { DoctorCard } from "./DoctorCard";

interface DoctorsSearchClientProps {
  doctors: Doctor[];
}

const sortOptions = [
  { label: "Relevancy", value: "relevancy" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  { label: "Years of Experience", value: "experience" }
] as const;

type SortOption = (typeof sortOptions)[number]["value"];
type DoctorGender = Lowercase<Doctor["gender"]>;
type GenderOption = "all" | DoctorGender;

function formatGenderLabel(option: GenderOption) {
  if (option === "all") {
    return "All";
  }

  return option
    .split("-")
    .map((segment, index) =>
      index === 0
        ? segment.charAt(0).toUpperCase() + segment.slice(1)
        : segment.charAt(0).toLowerCase() + segment.slice(1)
    )
    .join("-");
}

export function DoctorsSearchClient({ doctors }: DoctorsSearchClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<GenderOption>("all");
  const [acceptingNewPatientsOnly, setAcceptingNewPatientsOnly] = useState(false);
  const [virtualVisitsOnly, setVirtualVisitsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0].value);

  const specialties = useMemo(() => {
    const allSpecialties = doctors.flatMap((doctor) => doctor.specialties);
    return Array.from(new Set(allSpecialties)).sort();
  }, [doctors]);

  const genderFilters = useMemo<GenderOption[]>(() => {
    const uniqueGenders = new Set<DoctorGender>();
    doctors.forEach((doctor) => {
      uniqueGenders.add(doctor.gender.toLowerCase() as DoctorGender);
    });

    return ["all", ...Array.from(uniqueGenders).sort()];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    const matchesSearch = (doctor: Doctor) => {
      if (!normalizedTerm) return true;
      return (
        doctor.name.toLowerCase().includes(normalizedTerm) ||
        doctor.specialties.some((specialty) =>
          specialty.toLowerCase().includes(normalizedTerm)
        ) ||
        doctor.locations.some((location) =>
          location.toLowerCase().includes(normalizedTerm)
        )
      );
    };

    const matchesSpecialty = (doctor: Doctor) => {
      if (selectedSpecialties.length === 0) return true;
      return doctor.specialties.some((specialty) =>
        selectedSpecialties.includes(specialty)
      );
    };

    const matchesGender = (doctor: Doctor) => {
      if (selectedGender === "all") return true;
      const doctorGender = doctor.gender.toLowerCase() as DoctorGender;
      return doctorGender === selectedGender;
    };

    return doctors
      .filter((doctor) =>
        matchesSearch(doctor) &&
        matchesSpecialty(doctor) &&
        matchesGender(doctor) &&
        (!acceptingNewPatientsOnly || doctor.acceptingNewPatients) &&
        (!virtualVisitsOnly || doctor.virtualVisits)
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "experience":
            return b.yearsExperience - a.yearsExperience;
          default:
            return 0;
        }
      });
  }, [
    doctors,
    searchTerm,
    selectedSpecialties,
    selectedGender,
    acceptingNewPatientsOnly,
    virtualVisitsOnly,
    sortBy
  ]);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((item) => item !== specialty)
        : [...prev, specialty]
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-8 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-100">
              Find a Provider
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">Search Doctors & Specialists</h1>
            <p className="max-w-2xl text-sky-50">
              Explore FictionalHealthCareproviders, filter by specialty, and quickly see who is
              accepting new patients or offers virtual visits.
            </p>
          </div>
          <div className="w-full max-w-md rounded-full bg-white/10 p-1 shadow-inner">
            <div className="flex items-center rounded-full bg-white px-4 py-3 text-slate-700">
              <svg
                aria-hidden="true"
                className="mr-3 h-5 w-5 text-sky-500"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-4.35-4.35m1.1-4.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
              <input
                className="w-full border-0 bg-transparent text-base outline-none placeholder:text-slate-400"
                placeholder="Search by name, specialty, or location"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
        <aside className="space-y-6 self-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Filter Results</h2>
            <p className="text-sm text-slate-500">Narrow down providers to match your needs.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Specialty
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {specialties.map((specialty) => {
                  const id = `specialty-${specialty.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                  const checked = selectedSpecialties.includes(specialty);
                  return (
                    <label
                      key={specialty}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
                      htmlFor={id}
                    >
                      <input
                        checked={checked}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        id={id}
                        type="checkbox"
                        onChange={() => toggleSpecialty(specialty)}
                      />
                      <span className="font-medium text-slate-700">{specialty}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Gender
              </h3>
              <div className="flex flex-wrap gap-2">
                {genderFilters.map((option) => (
                  <button
                    key={option}
                    className={`rounded-full border px-4 py-1 text-sm font-semibold transition ${
                      selectedGender === option
                        ? "border-sky-500 bg-sky-500 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-slate-800"
                    }`}
                    type="button"
                    onClick={() => setSelectedGender(option)}
                  >
                    {formatGenderLabel(option)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Availability
              </h3>
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium shadow-sm transition hover:border-sky-300 hover:bg-sky-50">
                <span className="text-slate-700">Accepting new patients</span>
                <input
                  checked={acceptingNewPatientsOnly}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  type="checkbox"
                  onChange={(event) => setAcceptingNewPatientsOnly(event.target.checked)}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium shadow-sm transition hover:border-sky-300 hover:bg-sky-50">
                <span className="text-slate-700">Offers virtual visits</span>
                <input
                  checked={virtualVisitsOnly}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  type="checkbox"
                  onChange={(event) => setVirtualVisitsOnly(event.target.checked)}
                />
              </label>
            </div>
          </div>

          {(selectedSpecialties.length > 0 ||
            selectedGender !== "all" ||
            acceptingNewPatientsOnly ||
            virtualVisitsOnly) && (
            <button
              className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
              type="button"
              onClick={() => {
                setSelectedSpecialties([]);
                setSelectedGender("all");
                setAcceptingNewPatientsOnly(false);
                setVirtualVisitsOnly(false);
              }}
            >
              Clear filters
            </button>
          )}
        </aside>

        <section className="space-y-4">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{filteredDoctors.length}</span> of {" "}
              <span className="font-semibold text-slate-900">{doctors.length}</span> providers
            </p>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-600" htmlFor="sort-by">
                Sort by
              </label>
              <select
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                id="sort-by"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              <h2 className="text-lg font-semibold text-slate-700">No providers found</h2>
              <p className="mt-2 text-sm">
                Try adjusting your filters or broadening your search criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
