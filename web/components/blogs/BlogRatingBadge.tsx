"use client";

import { useEffect, useState } from "react";
import { gql } from "@/lib/graphqlClient";

type Summary = { average: number; count: number };

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="text-yellow-500 align-middle">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? '\u2605' : '\u2606'}</span>
      ))}
    </span>
  );
}

export default function BlogRatingBadge({ blogId }: { blogId: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await gql<{ ratingSummary: Summary }>(`query($id: ID!){ ratingSummary(blogId:$id){ average count } }`, { id: blogId });
        if (alive) setSummary(data.ratingSummary);
      } catch {
        // ignore
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => { alive = false; };
  }, [blogId]);

  if (!loaded) return <span className="ml-2 align-middle text-xs text-slate-400">...</span>;
  if (!summary || summary.count === 0) return <span className="ml-2 align-middle text-xs text-slate-500">No ratings</span>;
  return (
    <span className="ml-2 inline-flex items-center gap-1 align-middle text-xs text-slate-600 dark:text-slate-300">
      <Stars value={summary.average} />
      <span>{summary.average.toFixed(1)} ({summary.count})</span>
    </span>
  );
}
