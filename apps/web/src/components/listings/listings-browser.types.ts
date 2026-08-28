export type PropertyTypeFilter =
  | "all"
  | "house"
  | "apartment"
  | "commercial"
  | "land";

export type RoomFilter = 1 | 2 | 3 | 4 | "any";
export type SortFilter =
  | "recommended"
  | "newest"
  | "priceLowHigh"
  | "priceHighLow";
export type ConvenienceKey = "garage" | "petAllowed" | "furnished" | "land";

export type ListingRecord = {
  id: string;
  title: string;
  price: number;
  type: "apartment" | "house" | "villa" | "studio";
  location?: string | null;
  images: string[];
  meta: Record<string, any>;
  status?: string;
  description?: string | null;
  createdAt?: string | Date;
};

export const PROPERTY_TYPES: Array<{
  label: string;
  value: PropertyTypeFilter;
}> = [
  { label: "House", value: "house" },
  { label: "Apartment", value: "apartment" },
  { label: "Commercial", value: "commercial" },
  { label: "Land plot", value: "land" },
];

export const LOCATION_OPTIONS = [
  "All locations",
  "Kigali, Rwanda",
  "Nyarutarama",
  "Kacyiru",
  "Kimihurura",
  "Kibagabaga",
  "Remera",
  "Gasabo",
  "Kicukiro",
] as const;

export type LocationOption = (typeof LOCATION_OPTIONS)[number];

export const ROOM_OPTIONS: RoomFilter[] = [1, 2, 3, 4];

export const CONVENIENCE_OPTIONS: Array<{
  label: string;
  key: ConvenienceKey;
}> = [
  { label: "Garage", key: "garage" },
  { label: "Pet allowed", key: "petAllowed" },
  { label: "Furnished", key: "furnished" },
  { label: "Land plot", key: "land" },
];
