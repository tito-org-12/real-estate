"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { trackPhase0Event } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { orpc } from "@/utils/orpc";

type ListingTypeFilter = "all" | "apartment" | "house" | "villa" | "studio";
type SortFilter = "recommended" | "newest" | "priceLowHigh" | "priceHighLow";

function computeQualityScore(listing: any) {
  const imageScore = Math.min((listing.images?.length ?? 0) * 10, 40);
  const descriptionScore = listing.description ? 20 : 0;
  const metaScore = Object.keys(listing.meta ?? {}).length * 5;
  const freshnessDays =
    (Date.now() - new Date(listing.createdAt).getTime()) /
    (1000 * 60 * 60 * 24);
  const freshnessScore = Math.max(0, 30 - Math.min(30, freshnessDays));
  return (
    imageScore + descriptionScore + Math.min(metaScore, 30) + freshnessScore
  );
}

function mapSortToApi(
  sortBy: SortFilter,
): "recency" | "price_asc" | "price_desc" {
  if (sortBy === "priceLowHigh") {
    return "price_asc";
  }

  if (sortBy === "priceHighLow") {
    return "price_desc";
  }

  return "recency";
}

function ListingsPageLoading() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto max-w-[1600px] px-4 py-10 md:px-6'>
        <div className='mb-8 h-16 animate-pulse rounded-xl bg-muted' />
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className='h-64 animate-pulse rounded-lg bg-muted' />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsPageLoading />}>
      <ListingsContent />
    </Suspense>
  );
}

function ListingsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(initialSearch);

  // Sync search state when URL param changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    setSearch(urlSearch);
  }, [searchParams]);
  const [type, setType] = useState<ListingTypeFilter>("all");
  const [sortBy, setSortBy] = useState<SortFilter>("recommended");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showPricePanel, setShowPricePanel] = useState(false);

  const apiListingType =
    type === "apartment" ||
    type === "house" ||
    type === "villa" ||
    type === "studio"
      ? type
      : undefined;

  const apiSortBy = mapSortToApi(sortBy);

  useEffect(() => {
    trackPhase0Event("listing_list_viewed", {
      search: initialSearch,
    });
  }, [initialSearch]);

  const { data: listings, isLoading } = useQuery(
    orpc.listings.list.queryOptions({
      input: {
        type: apiListingType,
        search: search.trim() || undefined,
        minPrice: priceRange[0] * 100,
        maxPrice: priceRange[1] * 100,
        sortBy: apiSortBy,
      },
    }),
  );

  const filteredListings =
    sortBy === "recommended"
      ? [...(listings ?? [])].sort(
          (a: any, b: any) => computeQualityScore(b) - computeQualityScore(a),
        )
      : listings;

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto max-w-[1600px] px-4 py-10 md:px-6'>
        <div className='mb-8 rounded-xl border border-border/60 bg-card p-3 shadow-lg'>
          <div className='flex flex-wrap items-center gap-3'>
            <div className='relative min-w-[280px] flex-1'>
              <Search className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                className='h-11 border-border/60 bg-background pr-10 pl-9 placeholder:text-muted-foreground/70 focus-visible:ring-primary/40'
                placeholder='Search by neighborhood, tower, or keyword...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type='button'
                  onClick={() => setSearch("")}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
                  aria-label='Clear search'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>

            <Select
              value={type}
              onValueChange={(val) => setType(val as ListingTypeFilter)}
            >
              <SelectTrigger className='h-11 min-w-[170px] border-border/60 bg-background'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Home Types</SelectItem>
                <SelectItem value='apartment'>Apartment</SelectItem>
                <SelectItem value='house'>House</SelectItem>
                <SelectItem value='villa'>Villa</SelectItem>
                <SelectItem value='studio'>Studio</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as SortFilter)}
            >
              <SelectTrigger className='h-11 min-w-[190px] border-border/60 bg-background'>
                <SelectValue placeholder='Sort By' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='recommended'>Recommended</SelectItem>
                <SelectItem value='newest'>Newest</SelectItem>
                <SelectItem value='priceLowHigh'>Price: Low to High</SelectItem>
                <SelectItem value='priceHighLow'>Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type='button'
              variant='outline'
              className='h-11 border-border/60 bg-background hover:bg-accent'
              onClick={() => setShowPricePanel((current) => !current)}
            >
              <SlidersHorizontal className='mr-2 h-4 w-4' />
              Price
            </Button>

            <Button
              type='button'
              variant='outline'
              className='h-11 border-border/60 bg-background hover:bg-accent'
              onClick={() => {
                setSearch("");
                setType("all");
                setSortBy("recommended");
                setPriceRange([0, 100000]);
                setShowPricePanel(false);
              }}
            >
              Clear All
            </Button>
          </div>

          {showPricePanel && (
            <div className='mt-4 rounded-lg border border-border/60 bg-background p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <Label className='font-medium text-muted-foreground text-xs uppercase tracking-widest'>
                  Price Range
                </Label>
                <span className='font-mono text-primary text-xs'>
                  {formatCurrency(priceRange[0])} -{" "}
                  {formatCurrency(priceRange[1])}
                </span>
              </div>
              <Slider
                min={0}
                max={100000}
                step={500}
                value={priceRange}
                onValueChange={(val) => setPriceRange(val as number[])}
                className='py-2'
              />
            </div>
          )}
        </div>

        <main>
          {isLoading ? (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className='h-64 animate-pulse rounded-lg bg-muted'
                />
              ))}
            </div>
          ) : filteredListings?.length === 0 ? (
            <div className='py-20 text-center text-muted-foreground'>
              No rental homes found matching your criteria.
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredListings?.map((listing: any) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  type={listing.type}
                  location={listing.location}
                  images={listing.images}
                  meta={listing.meta}
                  status={listing.status}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
