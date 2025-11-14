"use client";

import { useMemo, useState } from "react";

import { NewsCard } from "./NewsCard";
import type { NewsArticle } from "./types";

interface NewsSearchClientProps {
  articles: NewsArticle[];
}

type SortOption = "latest" | "oldest" | "title";
type TimeFilter = "all" | "last-30" | "last-90";

function subtractDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function matchesTimeFilter(articleDate: Date, filter: TimeFilter) {
  if (filter === "all") return true;
  const threshold = filter === "last-30" ? subtractDays(30) : subtractDays(90);
  return articleDate >= threshold;
}

export function NewsSearchClient({ articles }: NewsSearchClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStoryTypes, setSelectedStoryTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const categoryOptions = useMemo(
    () => Array.from(new Set(articles.map((article) => article.category))).sort(),
    [articles]
  );
  const storyTypeOptions = useMemo(
    () => Array.from(new Set(articles.map((article) => article.storyType))).sort(),
    [articles]
  );
  const tagOptions = useMemo(
    () => Array.from(new Set(articles.flatMap((article) => article.tags))).sort(),
    [articles]
  );
  const yearOptions = useMemo(
    () => Array.from(new Set(articles.map((article) => new Date(article.publishedAt).getFullYear()))).sort((a, b) => b - a),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return articles
      .filter((article) => {
        const date = new Date(article.publishedAt);
        const matchesSearch =
          !normalizedTerm ||
          article.title.toLowerCase().includes(normalizedTerm) ||
          article.summary.toLowerCase().includes(normalizedTerm) ||
          article.tags.some((tag) => tag.toLowerCase().includes(normalizedTerm));

        const matchesCategory =
          selectedCategories.length === 0 || selectedCategories.includes(article.category);

        const matchesStoryType =
          selectedStoryTypes.length === 0 || selectedStoryTypes.includes(article.storyType);

        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => article.tags.includes(tag));

        const matchesYear =
          yearFilter === "all" || date.getFullYear().toString() === yearFilter;

        const matchesTime = matchesTimeFilter(date, timeFilter);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStoryType &&
          matchesTags &&
          matchesYear &&
          matchesTime
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "oldest":
            return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
          case "latest":
          default:
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
      });
  }, [
    articles,
    searchTerm,
    selectedCategories,
    selectedStoryTypes,
    selectedTags,
    yearFilter,
    timeFilter,
    sortBy,
  ]);

  const filtersActive =
    selectedCategories.length > 0 ||
    selectedStoryTypes.length > 0 ||
    selectedTags.length > 0 ||
    yearFilter !== "all" ||
    timeFilter !== "all";

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStoryTypes([]);
    setSelectedTags([]);
    setYearFilter("all");
    setTimeFilter("all");
  };

  return (
    <div className="bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 to-sky-900 py-12 text-white">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">
              News & Articles
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Stay current with updates across Fictional HealthCare 
            </h1>
            <p className="text-base text-slate-200">
              Filter by category, story type, tags, or time frame to catch the latest announcements,
              press releases, and community highlights.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-1">
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl">
              <input
                type="search"
                placeholder="Search news, topics, or keywords"
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

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px,1fr] lg:px-8">
        <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Filter news</h2>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryOptions.map((category) => {
                const active = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        active ? prev.filter((item) => item !== category) : [...prev, category]
                      )
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:border-sky-200 hover:text-slate-800"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Story type
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {storyTypeOptions.map((type) => {
                const checked = selectedStoryTypes.includes(type);
                return (
                  <label key={type} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      checked={checked}
                      onChange={() =>
                        setSelectedStoryTypes((prev) =>
                          checked ? prev.filter((item) => item !== type) : [...prev, type]
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
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        active ? prev.filter((item) => item !== tag) : [...prev, tag]
                      )
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:border-sky-200 hover:text-slate-800"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Publish year
            </p>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
            >
              <option value="all">All years</option>
              {yearOptions.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timeframe</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {([
                { label: "Any time", value: "all" },
                { label: "Last 30 days", value: "last-30" },
                { label: "Last 90 days", value: "last-90" },
              ] as { label: string; value: TimeFilter }[]).map((option) => (
                <label key={option.value} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="time-filter"
                    value={option.value}
                    checked={timeFilter === option.value}
                    onChange={() => setTimeFilter(option.value)}
                    className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {option.label}
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
                <span className="font-semibold text-slate-900">{filteredArticles.length}</span> of{" "}
                <span className="font-semibold text-slate-900">{articles.length}</span> stories
              </p>
              {filtersActive && (
                <p className="text-xs text-slate-500">Filters applied</p>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <label className="font-semibold text-slate-700" htmlFor="sort-news">
                Sort by
              </label>
              <select
                id="sort-news"
                className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-900">No stories match your filters</p>
              <p className="mt-2 text-sm text-slate-600">
                Try a different keyword or remove a filter to view more articles.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
