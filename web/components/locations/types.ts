export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationFacility {
  id: string;
  name: string;
  shortDescription: string;
  facilityType: string;
  careTypes: string[];
  specialties: string[];
  address: Address;
  phone: string;
  hours: string;
  coordinates: Coordinates;
  acceptingNewPatients: boolean;
  virtualVisits: boolean;
  featured?: boolean;
}
