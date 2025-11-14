export interface CommunityEvent {
  id: string;
  title: string;
  summary: string;
  type: string;
  format: "In-person" | "Virtual" | "Hybrid";
  location: string;
  address: string;
  city: string;
  startDate: string;
  endDate: string;
  cost: string;
  isFree: boolean;
  tags: string[];
  registrationUrl: string;
  registrationPhone: string;
  status: string;
  spots: number;
  featured?: boolean;
}
