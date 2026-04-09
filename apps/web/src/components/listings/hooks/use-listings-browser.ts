"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { orpc } from "@/utils/orpc";
import {
  computeQualityScore,
  getApiListingType,
  getDisplayCategory,
  getQueryPriceRange,
  getBedrooms,
  hasConvenience,
  mapSortToApi,
  matchesRoomFilter,
  toggleConvenience,
} from "../listings-browser.helpers";
import {
  type ConvenienceKey,
  type ListingRecord,
  type LocationOption,
  type PropertyTypeFilter,
  type RoomFilter,
  type SortFilter,
} from "../listings-browser.types";

export function useListingsBrowser() {
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const listingParam = searchParams.get("listing");
  const initialSearch = searchParams.get("search") ?? "";
  const initialListingId = listingParam ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState<PropertyTypeFilter>("all");
  const [sortBy, setSortBy] = useState<SortFilter>("recommended");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [priceFilterEnabled, setPriceFilterEnabled] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<RoomFilter>("any");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationOption>("All locations");
  const [activeConveniences, setActiveConveniences] = useState<
    ConvenienceKey[]
  >([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialListingId || null,
  );

  const updateListingParam = (id: string) => {
    const nextParams = new URLSearchParams(searchParamsString);
    if (nextParams.get("listing") === id) {
      return;
    }

    nextParams.set("listing", id);

    if (globalThis.window !== undefined) {
      const nextUrl = `/listings?${nextParams.toString()}`;
      globalThis.window.history.replaceState(null, "", nextUrl);
    }
  };

  const { data: listings, isLoading } = useQuery(
    orpc.listings.list.queryOptions({
      staleTime: 0,
      input: {
        type: getApiListingType(type) ?? undefined,
        search: search.trim() || undefined,
        ...getQueryPriceRange(priceRange, priceFilterEnabled),
        sortBy: mapSortToApi(sortBy),
      },
    }),
  );

  const visibleListings = useMemo(() => {
    const source = listings ?? [];

    const filtered = source.filter((listing) => {
      const typeMatch = type === "all" || getDisplayCategory(listing) === type;

      const roomCount = getBedrooms(listing);
      const roomMatch = matchesRoomFilter(roomCount, selectedRooms);

      const locationMatch =
        selectedLocation === "All locations"
          ? true
          : `${listing.location ?? ""}`
              .toLowerCase()
              .includes(selectedLocation.toLowerCase());

      const convenienceMatch = activeConveniences.every((convenience) =>
        hasConvenience(listing, convenience),
      );

      return typeMatch && roomMatch && locationMatch && convenienceMatch;
    });

    if (sortBy === "recommended") {
      return [...filtered].sort(
        (a, b) => computeQualityScore(b) - computeQualityScore(a),
      );
    }

    return filtered;
  }, [
    activeConveniences,
    listings,
    selectedLocation,
    selectedRooms,
    sortBy,
    type,
  ]);

  const selectedListing = useMemo(() => {
    if (visibleListings.length === 0) {
      return undefined;
    }

    if (selectedId) {
      return (
        visibleListings.find((listing) => listing.id === selectedId) ??
        visibleListings[0]
      );
    }

    if (listingParam) {
      return (
        visibleListings.find((listing) => listing.id === listingParam) ??
        visibleListings[0]
      );
    }

    return visibleListings[0];
  }, [listingParam, selectedId, visibleListings]);

  const selectListing = (id: string) => {
    setSelectedId(id);
    updateListingParam(id);
  };

  const goToNextListing = () => {
    if (!selectedListing) return;

    const currentIndex = visibleListings.findIndex(
      (listing) => listing.id === selectedListing.id,
    );
    const nextListing =
      visibleListings[(currentIndex + 1) % visibleListings.length];

    if (nextListing) {
      setSelectedId(nextListing.id);
      updateListingParam(nextListing.id);
    }
  };

  const goToPreviousListing = () => {
    if (!selectedListing) return;

    const currentIndex = visibleListings.findIndex(
      (listing) => listing.id === selectedListing.id,
    );
    const previousListing =
      visibleListings[
        (currentIndex - 1 + visibleListings.length) % visibleListings.length
      ];

    if (previousListing) {
      setSelectedId(previousListing.id);
      updateListingParam(previousListing.id);
    }
  };

  const clearAll = () => {
    setSearch("");
    setType("all");
    setSortBy("recommended");
    setPriceRange([0, 100000]);
    setPriceFilterEnabled(false);
    setSelectedRooms("any");
    setSelectedLocation("All locations");
    setActiveConveniences([]);
  };

  const setPriceRangeFromSlider = (value: [number, number]) => {
    setPriceRange(value);
    setPriceFilterEnabled(true);
  };

  const toggleConvenienceFilter = (key: ConvenienceKey) => {
    setActiveConveniences((current) => toggleConvenience(current, key));
  };

  return {
    isLoading,
    visibleListings: visibleListings as ListingRecord[],
    selectedListing,
    search,
    type,
    sortBy,
    priceRange,
    selectedRooms,
    selectedLocation,
    activeConveniences,
    setSearch,
    setType,
    setSortBy,
    setSelectedRooms,
    setSelectedLocation,
    setPriceRangeFromSlider,
    toggleConvenienceFilter,
    clearAll,
    selectListing,
    goToNextListing,
    goToPreviousListing,
  };
}
