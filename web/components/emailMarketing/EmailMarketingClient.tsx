"use client";

import { useMemo, useState } from "react";

import { EmailTemplateCard } from "./EmailTemplateCard";
import { EmailTemplatePreview } from "./EmailTemplatePreview";
import type { EmailTemplate } from "./types";

interface EmailMarketingClientProps {
  templates: EmailTemplate[];
}

export function EmailMarketingClient({ templates }: EmailMarketingClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate>(templates[0]);

  const tagOptions = useMemo(() => ["All", ...new Set(templates.flatMap((t) => t.tags))], [
    templates,
  ]);

  const filteredTemplates = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesTag = selectedTag === "All" || template.tags.includes(selectedTag);
      const matchesSearch =
        !normalized ||
        template.name.toLowerCase().includes(normalized) ||
        template.purpose.toLowerCase().includes(normalized) ||
        template.subject.toLowerCase().includes(normalized);
      return matchesTag && matchesSearch;
    });
  }, [templates, selectedTag, searchTerm]);

  return (
    <div className="bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 to-sky-900 py-12 text-white">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">
              Email Marketing Studio
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Build high-performing campaigns in minutes
            </h1>
            <p className="text-base text-slate-200">
              Explore proven templates for newsletters, service announcements, event promotions, and
              journey follow-ups. Customize copy, CTA, and accent color to match your message.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-1">
            <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-2xl">
              <input
                type="search"
                placeholder="Search templates by name, goal, or subject"
                className="flex-1 rounded-xl border border-transparent px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => {
                  const active = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
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
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <EmailTemplateCard
                key={template.id}
                template={template}
                onPreview={setActiveTemplate}
                isActive={activeTemplate.id === template.id}
              />
            ))}
            {filteredTemplates.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                No templates match your filters. Try another keyword or tag.
              </p>
            )}
          </div>
          <div className="space-y-6">
            <EmailTemplatePreview template={activeTemplate} />
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Implementation tips</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>Keep subject lines under 60 characters and pair with actionable preheaders.</li>
                <li>Segment by audience goal (awareness, conversion, retention) and clone templates.</li>
                <li>Test CTA, hero image, and send timeâ€”log learnings in your playbook.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

