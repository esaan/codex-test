"use client";

import { useMemo, useState } from "react";

import { ServiceCard } from "./ServiceCard";
import type { ServiceOffering } from "./types";

interface ServicesSearchClientProps {
  services: ServiceOffering[];
}

type SortOption = "featured" | "name";
type CareCategoryFilter = "all" | ServiceOffering["careCategory"];
type ReferralFilter = "all" | "required" | "not-required";

export function ServicesSearchClient({ services }: ServicesSearchClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [careCategory, setCareCategory] = useState<CareCategoryFilter>("all");
  const [selectedServiceLines, setSelectedServiceLines] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [referralFilter, setReferralFilter] = useState<ReferralFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const serviceLineOptions = useMemo(() => {
    return Array.from(new Set(services.flatMap((service) => service.serviceLines))).sort();
  }, [services]);

  const locationOptions = useMemo(() => {
    return Array.from(new Set(services.flatMap((service) => service.locationsServed))).sort();
  }, [services]);

  const filteredServices = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return services
      .filter((service) => {
        const matchesSearch =
          !normalizedTerm ||
          service.name.toLowerCase().includes(normalizedTerm) ||
          service.summary.toLowerCase().includes(normalizedTerm) ||
          service.serviceLines.some((line) => line.toLowerCase().includes(normalizedTerm));

        const matchesCare =
          careCategory === "all" || service.careCategory === careCategory;

        const matchesServiceLines =
          selectedServiceLines.length === 0 ||
          selectedServiceLines.some((line) => service.serviceLines.includes(line));

        const matchesLocation =
          selectedLocations.length === 0 ||
          selectedLocations.some((city) => service.locationsServed.includes(city));

        const matchesReferral =
          referralFilter === "all" ||
          (referralFilter === "required" && service.referralRequired) ||
          (referralFilter === "not-required" && !service.referralRequired);

        return (
          matchesSearch &&
          matchesCare &&
          matchesServiceLines &&
          matchesLocation &&
          matchesReferral
        );
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (a.featured === b.featured) {
          return a.name.localeCompare(b.name);
        }
        return a.featured ? -1 : 1;
      });
  }, [
    services,
    searchTerm,
    careCategory,
    selectedServiceLines,
    selectedLocations,
    referralFilter,
    sortBy,
  ]);

  const filtersActive =
    careCategory !== "all" ||
    selectedServiceLines.length > 0 ||
    selectedLocations.length > 0 ||
    referralFilter !== "all";

  const clearFilters = () => {
    setCareCategory("all");
    setSelectedServiceLines([]);
    setSelectedLocations([]);
    setReferralFilter("all");
  };

  return (
    <div className="bg-slate-50">
      <section className="bg-gradient-to-br from-sky-900 to-slate-900 py-12 text-white">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">
              Services Directory
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Explore care programs by specialty, location, or delivery type
            </h1>
            <p className="text-base text-slate-200">
              Rochester-style browsing with FictionalHealthCare flair: filter by care category, service
              line, or region to find the right program fast.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-1">
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-xl">
              <input
                type="search"
                placeholder="Search services, conditions, or procedures"
                className="w-full rounded-xl border border-transparent px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[300px,1fr] lg:px-8">
        <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Filter services</h2>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-sky-700 hover:text-sky-900"
              >
                Reset
              </button>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Care category
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["all", "Primary", "Specialty", "Support"] as CareCategoryFilter[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCareCategory(option)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    careCategory === option
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-600 hover:border-sky-200 hover:text-slate-800"
                  }`}
                >
                  {option === "all" ? "All care" : `${option} care`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Service lines
            </p>
            <div className="mt-3 max-h-48 space-y-2 overflow-auto pr-1 text-sm text-slate-600">
              {serviceLineOptions.map((line) => {
                const checked = selectedServiceLines.includes(line);
                return (
                  <label key={line} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      checked={checked}
                      onChange={() =>
                        setSelectedServiceLines((prev) =>
                          checked ? prev.filter((entry) => entry !== line) : [...prev, line]
                        )
                      }
                    />
                    {line}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Locations</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {locationOptions.map((city) => {
                const active = selectedLocations.includes(city);
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() =>
                      setSelectedLocations((prev) =>
                        active ? prev.filter((entry) => entry !== city) : [...prev, city]
                      )
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:border-sky-200 hover:text-slate-800"
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Referral requirements
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {(["all", "required", "not-required"] as ReferralFilter[]).map((option) => (
                <label key={option} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="referral-filter"
                    value={option}
                    checked={referralFilter === option}
                    onChange={() => setReferralFilter(option)}
                    className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {option === "all"
                    ? "All services"
                    : option === "required"
                      ? "Referral required"
                      : "No referral needed"}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">{filteredServices.length}</span> of{" "}
                <span className="font-semibold text-slate-900">{services.length}</span> services
              </p>
              {filtersActive && (
                <p className="text-xs text-slate-500">Filters applied</p>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <label className="font-semibold text-slate-700" htmlFor="sort-services">
                Sort by
              </label>
              <select
                id="sort-services"
                className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
              >
                <option value="featured">Featured first</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-900">No services match your filters</p>
              <p className="mt-2 text-sm text-slate-600">
                Try changing your search term or removing a filter to see more programs.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
