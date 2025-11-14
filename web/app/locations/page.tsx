import type { Metadata } from "next";

import { LocationsSearchClient } from "@/components/locations/LocationsSearchClient";
import type { LocationFacility } from "@/components/locations/types";
import locationsData from "@/data/locations.json";

const locations = locationsData as LocationFacility[];

export const metadata: Metadata = {
  title: "Locations | Fictional HealthCare ",
  description:
    "Search Fictional HealthCare  hospitals, clinics, urgent care centers, and specialty facilities.",
};

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <LocationsSearchClient locations={locations} />
    </main>
  );
}
