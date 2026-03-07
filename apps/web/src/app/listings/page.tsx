"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { trackPhase0Event } from "@/lib/analytics";
import { formatCurrency, PILOT_CITY } from "@/lib/utils";
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
      <div className='relative flex h-[40vh] min-h-[400px] w-full items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0 animate-pulse bg-muted' />
      </div>
      <div className='container mx-auto max-w-[1600px] px-4 py-12'>
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
      {/* Hero Section */}
      <div className='relative flex h-[40vh] min-h-[400px] w-full items-center justify-center overflow-hidden'>
        {/* Background Image */}
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop'
            alt='Luxury Home'
            className='h-full w-full object-cover opacity-90'
          />
          <div className='absolute inset-0 bg-black/40' />
        </div>

        <div className='relative z-10 w-full max-w-4xl animate-fade-up space-y-8 px-4 text-center'>
          <div className='space-y-4'>
            <h1 className='font-medium font-serif text-5xl text-white tracking-tight drop-shadow-sm md:text-6xl lg:text-7xl'>
              Find Your Next Rental Home
            </h1>
            <p className='font-light text-lg text-white/80 tracking-wide md:text-xl'>
              Browse verified homes across {PILOT_CITY}.
            </p>
          </div>

          <div className='relative mx-auto max-w-2xl'>
            <div className='flex items-center rounded-full border border-white/20 bg-background/95 p-2 shadow-2xl backdrop-blur-md transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50'>
              <Search className='ml-4 h-5 w-5 text-muted-foreground' />
              <Input
                className='h-12 border-0 bg-transparent text-base shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0'
                placeholder='Search by neighborhood, tower, or keyword...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                size='icon'
                className='h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90'
              >
                <Search className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto flex max-w-[1600px] flex-col gap-10 px-4 py-12 md:flex-row md:px-6'>
        {/* Sidebar Filters */}
        <aside className='w-full shrink-0 space-y-10 pr-4 md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:w-72 md:overflow-y-auto'>
          <div>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='font-serif text-2xl text-foreground'>Refine</h3>
              <button
                type='button'
                onClick={() => {
                  setSearch("");
                  setType("all");
                  setSortBy("recommended");
                  setPriceRange([0, 100000]);
                }}
                className='text-muted-foreground text-xs uppercase tracking-widest transition-colors hover:text-primary'
              >
                Clear all
              </button>
            </div>

            <div className='space-y-8'>
              <div className='space-y-3'>
                <Label className='font-medium text-muted-foreground text-xs uppercase tracking-widest'>
                  Category
                </Label>
                <Select
                  value={type}
                  onValueChange={(val) => setType(val as ListingTypeFilter)}
                >
                  <SelectTrigger className='h-11 border-border/60 bg-background transition-colors focus:border-primary/50 focus:ring-0'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Home Types</SelectItem>
                    <SelectItem value='apartment'>Apartment</SelectItem>
                    <SelectItem value='house'>House</SelectItem>
                    <SelectItem value='villa'>Villa</SelectItem>
                    <SelectItem value='studio'>Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-3'>
                <Label className='font-medium text-muted-foreground text-xs uppercase tracking-widest'>
                  Sort By
                </Label>
                <Select
                  value={sortBy}
                  onValueChange={(val) => setSortBy(val as SortFilter)}
                >
                  <SelectTrigger className='h-11 border-border/60 bg-background transition-colors focus:border-primary/50 focus:ring-0'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='recommended'>Recommended</SelectItem>
                    <SelectItem value='newest'>Newest</SelectItem>
                    <SelectItem value='priceLowHigh'>
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value='priceHighLow'>
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label className='font-medium text-muted-foreground text-xs uppercase tracking-widest'>
                    Price Range
                  </Label>
                  <span className='font-mono text-primary text-xs'>
                    {formatCurrency(priceRange[0])} —{" "}
                    {formatCurrency(priceRange[1])}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100000}
                  step={500}
                  value={priceRange}
                  onValueChange={(val) => setPriceRange(val as number[])}
                  className='py-4'
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <main className='flex-1'>
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
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
