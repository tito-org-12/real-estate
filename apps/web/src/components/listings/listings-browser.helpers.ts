import {
  type ConvenienceKey,
  type ListingRecord,
  type PropertyTypeFilter,
  type RoomFilter,
  type SortFilter,
} from "./listings-browser.types";

export function computeQualityScore(listing: ListingRecord) {
  const imageScore = Math.min((listing.images?.length ?? 0) * 10, 40);
  const descriptionScore = listing.description ? 20 : 0;
  const metaScore = Math.min(Object.keys(listing.meta ?? {}).length * 5, 30);
  const freshnessDays = listing.createdAt
    ? (Date.now() - new Date(listing.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
    : 30;
  const freshnessScore = Math.max(0, 30 - Math.min(30, freshnessDays));

  return imageScore + descriptionScore + metaScore + freshnessScore;
}

export function getDisplayCategory(listing: ListingRecord): PropertyTypeFilter {
  const propertyKind = String(listing.meta?.propertyKind ?? "").toLowerCase();

  if (propertyKind === "commercial") return "commercial";
  if (propertyKind === "land") return "land";
  if (listing.type === "apartment") return "apartment";
  if (listing.type === "house" || listing.type === "villa") return "house";

  return "house";
}

export function getBedrooms(listing: ListingRecord) {
  const bedrooms = Number(listing.meta?.bedrooms);
  return Number.isFinite(bedrooms) && bedrooms > 0 ? bedrooms : undefined;
}

export function hasConvenience(listing: ListingRecord, key: ConvenienceKey) {
  const metadata =
    `${listing.meta?.furnishingStatus ?? ""} ${listing.meta?.propertyKind ?? ""}`.toLowerCase();
  const parking = Number(listing.meta?.garage ?? listing.meta?.parking ?? 0);

  if (key === "garage") {
    return parking > 0 || metadata.includes("garage");
  }

  if (key === "petAllowed") {
    return Boolean(listing.meta?.petAllowed || listing.meta?.pet_friendly);
  }

  if (key === "furnished") {
    return (
      metadata.includes("furnished") ||
      metadata.includes("semi_furnished") ||
      metadata.includes("semi-furnished")
    );
  }

  return getDisplayCategory(listing) === "land";
}

export function getHeroImage(listing: ListingRecord) {
  return listing.images[0] || "https://placehold.co/1200x900?text=No+Image";
}

export function getApiListingType(type: PropertyTypeFilter) {
  if (type === "all" || type === "commercial" || type === "land") {
    return undefined;
  }

  return type;
}

export function mapSortToApi(sortBy: SortFilter) {
  if (sortBy === "priceLowHigh") return "price_asc";
  if (sortBy === "priceHighLow") return "price_desc";

  return "recency";
}

export function getQueryPriceRange(
  priceRange: [number, number],
  priceFilterEnabled: boolean,
) {
  if (!priceFilterEnabled) {
    return {
      minPrice: undefined,
      maxPrice: undefined,
    };
  }

  return {
    minPrice: priceRange[0] * 100,
    maxPrice: priceRange[1] * 100,
  };
}

export function toggleConvenience(
  current: ConvenienceKey[],
  key: ConvenienceKey,
) {
  if (current.includes(key)) {
    return current.filter((item) => item !== key);
  }

  return [...current, key];
}

export function matchesRoomFilter(
  roomCount: number | undefined,
  selectedRooms: RoomFilter,
) {
  if (selectedRooms === "any") {
    return true;
  }

  if (selectedRooms === 4) {
    return (roomCount ?? 0) >= 4;
  }

  return (roomCount ?? 0) === selectedRooms;
}
