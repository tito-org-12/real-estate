import { Search, X } from "lucide-react";
import { type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { type ListingRecord } from "./listings-browser.types";
import { ListingResultCard } from "./listing-result-card";

export function ListingsResultsPanel({
  isLoading,
  listings,
  search,
  setSearch,
  selectedListingId,
  onSelect,
}: Readonly<{
  isLoading: boolean;
  listings: ListingRecord[];
  search: string;
  setSearch: (value: string) => void;
  selectedListingId?: string;
  onSelect: (id: string) => void;
}>) {
  let resultsContent: ReactNode;

  if (isLoading) {
    resultsContent = (
      <div className='space-y-4'>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className='h-32 animate-pulse rounded-2xl bg-muted' />
        ))}
      </div>
    );
  } else if (listings.length === 0) {
    resultsContent = (
      <div className='rounded-2xl border border-border/60 bg-white p-10 text-center text-muted-foreground'>
        No rental homes found matching your criteria.
      </div>
    );
  } else {
    resultsContent = (
      <div className='space-y-4'>
        {listings.map((listing) => (
          <ListingResultCard
            key={listing.id}
            listing={listing}
            active={selectedListingId === listing.id}
            onClick={() => onSelect(listing.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <section className='h-screen overflow-y-auto border-border/60 bg-[#ececef] px-4 py-6 md:px-6 lg:border-r lg:px-6 xl:px-8 [scrollbar-color:#4860f4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#4860f4] [&::-webkit-scrollbar-track]:bg-transparent'>
      <div className='mb-5 flex items-center gap-4'>
        <h1 className='shrink-0 text-2xl font-semibold text-foreground'>
          Search results ({listings.length})
        </h1>
        <div className='relative min-w-0 flex-1'>
          <Search className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Search for houses, apartments...'
            className='h-12 rounded-full border-border/60 bg-white pl-11 pr-11 text-sm shadow-sm'
          />
          {search ? (
            <button
              type='button'
              onClick={() => setSearch("")}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
              aria-label='Clear search'
            >
              <X className='h-4 w-4' />
            </button>
          ) : null}
        </div>
      </div>

      {resultsContent}
    </section>
  );
}
