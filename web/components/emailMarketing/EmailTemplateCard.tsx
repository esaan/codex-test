import type { EmailTemplate } from "./types";

interface EmailTemplateCardProps {
  template: EmailTemplate;
  onPreview: (template: EmailTemplate) => void;
  isActive: boolean;
}

export function EmailTemplateCard({ template, onPreview, isActive }: EmailTemplateCardProps) {
  return (
    <button
      type="button"
      onClick={() => onPreview(template)}
      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
        isActive
          ? "border-sky-500 bg-sky-50 shadow-md"
          : "border-slate-200 bg-white hover:border-sky-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {template.frequency}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{template.name}</h3>
          <p className="mt-2 text-sm text-slate-600">{template.purpose}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {template.tags.join(" / ")}
        </span>
      </div>
      <div className="mt-4 space-y-1 text-xs text-slate-500">
        <p>
          <span className="font-semibold text-slate-700">Subject:</span> {template.subject}
        </p>
        <p>
          <span className="font-semibold text-slate-700">Audience:</span> {template.audience}
        </p>
      </div>
    </button>
  );
}
