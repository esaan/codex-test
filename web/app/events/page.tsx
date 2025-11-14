import type { Metadata } from "next";

import { EventsSearchClient } from "@/components/events/EventsSearchClient";
import type { CommunityEvent } from "@/components/events/types";
import eventsData from "@/data/events.json";

const events = eventsData as CommunityEvent[];

export const metadata: Metadata = {
  title: "Classes & Events | FictionalHealthCare",
  description:
    "Search upcoming classes, support groups, and community events across FictionalHealthCare locations.",
};

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <EventsSearchClient events={events} />
    </main>
  );
}
