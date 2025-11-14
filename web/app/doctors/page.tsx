import type { Metadata } from "next";

import { DoctorsSearchClient } from "@/components/doctors/DoctorsSearchClient";
import type { Doctor } from "@/components/doctors/types";
import doctorsData from "@/data/doctors.json";

const doctors = doctorsData as Doctor[];

export const metadata: Metadata = {
  title: "Find Doctors | BayCare Inspired Search",
  description:
    "Search BayCare doctors and specialists by specialty, location, or availability.",
};

export default function DoctorsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <DoctorsSearchClient doctors={doctors} />
    </main>
  );
}
