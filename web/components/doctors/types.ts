export interface Doctor {
  id: string;
  name: string;
  specialties: string[];
  locations: string[];
  languages: string[];
  gender: "Male" | "Female" | "Non-binary" | "Other";
  yearsExperience: number;
  acceptingNewPatients: boolean;
  virtualVisits: boolean;
  topConditions: string[];
  phone: string;
}
