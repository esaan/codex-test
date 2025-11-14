import type { Metadata } from "next";

import { NewsSearchClient } from "@/components/news/NewsSearchClient";
import type { NewsArticle } from "@/components/news/types";
import newsData from "@/data/news.json";

const articles = newsData as NewsArticle[];

export const metadata: Metadata = {
  title: "News & Articles | Fictional HealthCare ",
  description:
    "Discover Fictional HealthCare  news, press releases, community highlights, and research updates.",
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <NewsSearchClient articles={articles} />
    </main>
  );
}
