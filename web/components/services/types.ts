export interface ServiceOffering {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  careCategory: "Primary" | "Specialty" | "Support";
  serviceLines: string[];
  locationsServed: string[];
  appointmentOptions: string[];
  highlights: string[];
  contactPhone: string;
  referralRequired: boolean;
  featured?: boolean;
}
