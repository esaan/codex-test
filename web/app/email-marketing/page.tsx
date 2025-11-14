import type { Metadata } from "next";

import { EmailMarketingClient } from "@/components/emailMarketing/EmailMarketingClient";
import type { EmailTemplate } from "@/components/emailMarketing/types";
import emailTemplatesData from "@/data/emailTemplates.json";

const templates = emailTemplatesData as EmailTemplate[];

export const metadata: Metadata = {
  title: "Email Marketing Studio | FictionalHealthCare",
  description:
    "Browse reusable email templates for newsletters, announcements, events, and post-visit journeys.",
};

export default function EmailMarketingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <EmailMarketingClient templates={templates} />
    </main>
  );
}
