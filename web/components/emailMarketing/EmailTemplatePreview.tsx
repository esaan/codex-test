import type { EmailTemplate } from "./types";

interface EmailTemplatePreviewProps {
  template: EmailTemplate;
}

export function EmailTemplatePreview({ template }: EmailTemplatePreviewProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-lg">
      <div
        className="rounded-t-3xl px-6 py-6 text-white"
        style={{ background: template.accentColor }}
      >
        <p className="text-xs uppercase tracking-wide opacity-80">{template.heroTone} series</p>
        <h2 className="mt-1 text-2xl font-bold">{template.subject}</h2>
        <p className="mt-2 text-sm opacity-90">{template.preheader}</p>
      </div>
      <div className="space-y-6 px-6 py-8">
        {template.contentBlocks.map((block) => (
          <div key={block.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{block.title}</p>
            <p className="mt-1 text-sm text-slate-600">{block.body}</p>
            {block.buttonLabel && block.buttonUrl && (
              <a
                href={block.buttonUrl}
                className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
              >
                {block.buttonLabel}
              </a>
            )}
          </div>
        ))}
        <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-600">
          {template.footerNote}
        </div>
      </div>
      <div className="border-t border-slate-100 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Metrics to watch
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {template.metricsFocus.map((metric) => (
            <span
              key={metric}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              {metric}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
