"use client";

import { useMemo, useState } from "react";

import { LocationCard } from "./LocationCard";
import type { LocationFacility } from "./types";

interface LocationsSearchClientProps {
  locations: LocationFacility[];
}

type SortOption = "featured" | "name" | "city";

export function LocationsSearchClient({ locations }: LocationsSearchClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [onlyAccepting, setOnlyAccepting] = useState(false);
  const [onlyVirtual, setOnlyVirtual] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const careTypeOptions = useMemo(() => {
    return Array.from(new Set(locations.flatMap((location) => location.careTypes))).sort();
  }, [locations]);

  const specialtyOptions = useMemo(() => {
    return Array.from(new Set(locations.flatMap((location) => location.specialties))).sort();
  }, [locations]);

  const cityOptions = useMemo(() => {
    return Array.from(new Set(locations.map((location) => location.address.city))).sort();
  }, [locations]);

  const filteredLocations = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return locations
      .filter((location) => {
        const matchesSearch =
          !normalizedTerm ||
          location.name.toLowerCase().includes(normalizedTerm) ||
          location.shortDescription.toLowerCase().includes(normalizedTerm) ||
          location.address.city.toLowerCase().includes(normalizedTerm);

        const matchesCareType =
          selectedCareTypes.length === 0 ||
          selectedCareTypes.some((care) => location.careTypes.includes(care));

        const matchesSpecialty =
          selectedSpecialties.length === 0 ||
          selectedSpecialties.some((spec) => location.specialties.includes(spec));

        const matchesCity = !selectedCity || location.address.city === selectedCity;

        const matchesAccepting = !onlyAccepting || location.acceptingNewPatients;

        const matchesVirtual = !onlyVirtual || location.virtualVisits;

        return (
          matchesSearch &&
          matchesCareType &&
          matchesSpecialty &&
          matchesCity &&
          matchesAccepting &&
          matchesVirtual
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "city": {
            const cityCompare = a.address.city.localeCompare(b.address.city);
            if (cityCompare !== 0) return cityCompare;
            return a.name.localeCompare(b.name);
          }
          case "featured":
          default:
            if (a.featured === b.featured) {
              return a.name.localeCompare(b.name);
            }
            return a.featured ? -1 : 1;
        }
      });
  }, [
    locations,
    searchTerm,
    selectedCareTypes,
    selectedSpecialties,
    selectedCity,
    onlyAccepting,
    onlyVirtual,
    sortBy,
  ]);

  const filtersActive =
    selectedCareTypes.length > 0 ||
    selectedSpecialties.length > 0 ||
    selectedCity !== "" ||
    onlyAccepting ||
    onlyVirtual;

  const clearFilters = () => {
    setSelectedCareTypes([]);
    setSelectedSpecialties([]);
    setSelectedCity("");
    setOnlyAccepting(false);
    setOnlyVirtual(false);
  };

  return (
    <div className="bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 to-sky-900 py-12 text-white">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">
              Locations Directory
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Find care locations across FictionalHealthCare
            </h1>
            <p className="text-base text-slate-200">
              Search hospitals, urgent care, specialty clinics, and outpatient centers. Filter by
              care type, specialty, or city to discover the most convenient option for you.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-1">
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl">
              <input
                type="search"
                placeholder="Search by location name, city, or service"
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
            <h2 className="text-base font-semibold text-slate-900">Filter locations</h2>
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
              Care type
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {careTypeOptions.map((care) => {
                const active = selectedCareTypes.includes(care);
                return (
                  <button
                    key={care}
                    type="button"
                    onClick={() =>
                      setSelectedCareTypes((prev) =>
                        active ? prev.filter((entry) => entry !== care) : [...prev, care]
                      )
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:border-sky-200 hover:text-slate-800"
                    }`}
                  >
                    {care}
                  </button>
                );
              })}
            </div>
          </div>

  <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Specialties
            </p>
            <div className="mt-3 max-h-44 space-y-2 overflow-auto pr-1 text-sm text-slate-600">
              {specialtyOptions.map((specialty) => {
                const checked = selectedSpecialties.includes(specialty);
                return (
                  <label key={specialty} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      checked={checked}
                      onChange={() =>
                        setSelectedSpecialties((prev) =>
                          checked ? prev.filter((entry) => entry !== specialty) : [...prev, specialty]
                        )
                      }
                    />
                    {specialty}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">City</p>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
            >
              <option value="">All cities</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                checked={onlyAccepting}
                onChange={() => setOnlyAccepting((prev) => !prev)}
              />
              Accepting patients
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                checked={onlyVirtual}
                onChange={() => setOnlyVirtual((prev) => !prev)}
              />
              Offers virtual visits
            </label>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">{filteredLocations.length}</span> of{" "}
                <span className="font-semibold text-slate-900">{locations.length}</span> locations
              </p>
              {filtersActive && (
                <p className="text-xs text-slate-500">Filters applied</p>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <label className="font-semibold text-slate-700" htmlFor="sort-locations">
                Sort by
              </label>
              <select
                id="sort-locations"
                className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
              >
                <option value="featured">Featured first</option>
                <option value="name">Name (A-Z)</option>
                <option value="city">City (A-Z)</option>
              </select>
            </div>
          </div>

          {filteredLocations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <p className="text-lg font-semibold text-slate-900">No locations found</p>
              <p className="mt-2 text-sm text-slate-600">
                Try removing a filter or searching for a different service or city.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLocations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
