"use client";

import { useListingsBrowser } from "./hooks/use-listings-browser";
import { ListingsFiltersPanel } from "./listings-filters-panel";
import { ListingsResultsPanel } from "./listings-results-panel";
import { ListingsSelectedPropertyPanel } from "./listings-selected-property-panel";

export function ListingsBrowser() {
  const {
    isLoading,
    visibleListings,
    selectedListing,
    search,
    type,
    sortBy,
    priceRange,
    selectedRooms,
    selectedLocation,
    setSearch,
    setType,
    setSortBy,
    setSelectedRooms,
    setSelectedLocation,
    setPriceRangeFromSlider,
    clearAll,
    selectListing,
  } = useListingsBrowser();

  return (
    <div className='min-h-screen bg-[#f4f4f5] text-foreground'>
      <div className='grid min-h-screen grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_440px]'>
        <ListingsFiltersPanel
          type={type}
          sortBy={sortBy}
          priceRange={priceRange}
          selectedRooms={selectedRooms}
          selectedLocation={selectedLocation}
          setType={setType}
          setSortBy={setSortBy}
          setPriceRange={setPriceRangeFromSlider}
          setSelectedRooms={setSelectedRooms}
          setSelectedLocation={setSelectedLocation}
          clearAll={clearAll}
        />

        <ListingsResultsPanel
          isLoading={isLoading}
          listings={visibleListings}
          search={search}
          setSearch={setSearch}
          selectedListingId={selectedListing?.id}
          onSelect={selectListing}
        />

        {selectedListing ? (
          <ListingsSelectedPropertyPanel
            key={`${selectedListing.id}`}
            listing={selectedListing}
          />
        ) : (
          <aside className='hidden p-4 xl:block'>
            <div className='sticky top-4 rounded-[28px] border border-border/60 bg-white p-8 text-center text-muted-foreground'>
              Select a property to preview details.
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
