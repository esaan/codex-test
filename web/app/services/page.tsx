import type { Metadata } from "next";

import { ServicesSearchClient } from "@/components/services/ServicesSearchClient";
import type { ServiceOffering } from "@/components/services/types";
import servicesData from "@/data/services.json";

const services = servicesData as ServiceOffering[];

export const metadata: Metadata = {
  title: "Services | FictionalHealthCare",
  description:
    "Browse FictionalHealthCare services, specialties, and programs with filters for care category, service line, and location.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <ServicesSearchClient services={services} />
    </main>
  );
}
