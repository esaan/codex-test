"use client";

import { useMemo, useState } from "react";

import { EventCard } from "./EventCard";
import type { CommunityEvent } from "./types";

interface EventsSearchClientProps {
  events: CommunityEvent[];
}

const dateFilters = [
  { label: "Any time", value: "any" },
  { label: "This week", value: "this-week" },
  { label: "This month", value: "this-month" },
  { label: "Next 90 days", value: "next-90-days" },
] as const;

type DateFilter = (typeof dateFilters)[number]["value"];
type CostFilter = "all" | "free" | "paid";

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function isWithinDateFilter(eventDate: Date, filter: DateFilter) {
  if (filter === "any") return true;
  if (Number.isNaN(eventDate.getTime())) return false;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case "this-week": {
      const inSevenDays = addDays(startOfToday, 7);
      return eventDate >= startOfToday && eventDate <= inSevenDays;
    }
    case "this-month":
      return (
        eventDate.getFullYear() === now.getFullYear() && eventDate.getMonth() === now.getMonth()
      );
    case "next-90-days": {
      const inNinetyDays = addDays(startOfToday, 90);
      return eventDate >= startOfToday && eventDate <= inNinetyDays;
    }
    default:
      return true;
  }
}

export function EventsSearchClient({ events }: EventsSearchClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [costFilter, setCostFilter] = useState<CostFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");

  const typeOptions = useMemo(() => {
    return Array.from(new Set(events.map((event) => event.type))).sort();
  }, [events]);

  const formatOptions = useMemo(() => {
    return Array.from(new Set(events.map((event) => event.format))).sort();
  }, [events]);

  const locationOptions = useMemo(() => {
    return Array.from(new Set(events.map((event) => event.city || event.location))).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return events
      .filter((event) => {
        const matchesSearch =
          !normalizedTerm ||
          event.title.toLowerCase().includes(normalizedTerm) ||
          event.summary.toLowerCase().includes(normalizedTerm) ||
          event.location.toLowerCase().includes(normalizedTerm) ||
          event.tags.some((tag) => tag.toLowerCase().includes(normalizedTerm));

        const matchesType =
          selectedTypes.length === 0 || selectedTypes.includes(event.type);

        const matchesFormat =
          selectedFormats.length === 0 || selectedFormats.includes(event.format);

        const matchesLocation =
          selectedLocations.length === 0 ||
          selectedLocations.includes(event.city || event.location);

        const matchesCost =
          costFilter === "all" ||
          (costFilter === "free" && event.isFree) ||
          (costFilter === "paid" && !event.isFree);

        const matchesDate = isWithinDateFilter(new Date(event.startDate), dateFilter);

        return (
          matchesSearch &&
          matchesType &&
          matchesFormat &&
          matchesLocation &&
          matchesCost &&
          matchesDate
        );
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  }, [
    events,
    searchTerm,
    selectedTypes,
    selectedFormats,
    selectedLocations,
    costFilter,
    dateFilter,
  ]);

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedFormats([]);
    setSelectedLocations([]);
    setCostFilter("all");
    setDateFilter("any");
  };

  return (
    <div className="bg-slate-50">
      <section className="bg-gradient-to-br from-sky-900 to-slate-900 py-12 text-white">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">
              Classes & Events
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              Explore community classes, support groups, and wellness events
            </h1>
            <p className="mt-4 max-w-3xl text-base text-slate-200">
              Search by topic, filter by location or format, and find the next opportunity to learn,
              connect, or receive support from Fictional HealthCare  experts.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-1">
            <div className="flex items-center gap-2 rounded-2xl bg-white/90 p-2 shadow-xl backdrop-blur">
              <input
                type="search"
                placeholder="Search by topic, keyword, or city"
                className="w-full rounded-xl border border-transparent bg-white/90 px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
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

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px,1fr] lg:px-8">
        <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Filter events</h2>
            {(selectedTypes.length > 0 ||
              selectedFormats.length > 0 ||
              selectedLocations.length > 0 ||
              costFilter !== "all" ||
              dateFilter !== "any") && (
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
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Event type</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {typeOptions.map((type) => {
                const checked = selectedTypes.includes(type);
                return (
                  <label key={type} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      checked={checked}
                      onChange={() =>
                        setSelectedTypes((prev) =>
                          checked ? prev.filter((entry) => entry !== type) : [...prev, type]
                        )
                      }
                    />
                    {type}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Format</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {formatOptions.map((format) => {
                const active = selectedFormats.includes(format);
                return (
                  <button
                    key={format}
                    type="button"
                    onClick={() =>
                      setSelectedFormats((prev) =>
                        active ? prev.filter((entry) => entry !== format) : [...prev, format]
                      )
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:border-sky-200 hover:text-slate-800"
                    }`}
                  >
                    {format}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">City</p>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={selectedLocations[0] ?? ""}
              onChange={(event) =>
                setSelectedLocations(event.target.value ? [event.target.value] : [])
              }
            >
              <option value="">All locations</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cost</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["all", "free", "paid"] as CostFilter[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCostFilter(option)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition ${
                    costFilter === option
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-600 hover:border-sky-200 hover:text-slate-800"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {dateFilters.map((filter) => (
                <label key={filter.value} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="date-filter"
                    value={filter.value}
                    checked={dateFilter === filter.value}
                    onChange={() => setDateFilter(filter.value)}
                    className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {filter.label}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">{filteredEvents.length}</span> of{" "}
                <span className="font-semibold text-slate-900">{events.length}</span> events
              </p>
              {searchTerm && (
                <p className="text-xs text-slate-500">Matching "{searchTerm}"</p>
              )}
            </div>
            {filteredEvents.length > 0 && (
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Soonest events first
              </p>
            )}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-900">No events match your filters</p>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your search, choosing a different date range, or clearing filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
