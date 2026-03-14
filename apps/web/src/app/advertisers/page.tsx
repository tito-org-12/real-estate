"use client";

import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { BadgeCheck, Building2 } from "lucide-react";
import { orpc } from "@/utils/orpc";

export default function AdvertisersPage() {
  const { data, isLoading } = useQuery(
    orpc.listings.advertisersDirectory.queryOptions({ input: {} }),
  );

  const advertisers = data ?? [];

  return (
    <div className='container mx-auto max-w-6xl px-4 py-10'>
      <div className='mb-8'>
        <h1 className='font-serif text-4xl'>Advertisers Directory</h1>
        <p className='mt-2 text-muted-foreground'>
          Discover active agents and landlords with marketplace trust signals.
        </p>
      </div>

      {isLoading && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className='h-36 animate-pulse rounded-lg bg-muted' />
          ))}
        </div>
      )}

      {!isLoading && advertisers.length === 0 && (
        <div className='rounded-lg border bg-card p-8 text-center text-muted-foreground'>
          No advertisers found yet.
        </div>
      )}

      {!isLoading && advertisers.length > 0 && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {advertisers.map((advertiser) => (
            <Link
              key={advertiser.id}
              href={`/advertisers/${advertiser.id}` as Route}
              className='rounded-lg border bg-card p-5 transition-colors hover:border-primary/40'
            >
              <div className='mb-3 flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                  <Building2 className='h-5 w-5 text-primary' />
                </div>
                <div className='min-w-0'>
                  <p className='truncate font-medium'>{advertiser.name}</p>
                  <p className='text-muted-foreground text-xs'>
                    ID: {advertiser.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className='space-y-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Active listings</span>
                  <span className='font-medium'>
                    {advertiser.activeListings}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>
                    Verified listings
                  </span>
                  <span className='font-medium'>
                    {advertiser.verifiedListings}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Stale listings</span>
                  <span className='font-medium'>
                    {advertiser.staleListings}
                  </span>
                </div>
              </div>

              {advertiser.verifiedListings > 0 && (
                <div className='mt-4 inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-green-700 text-xs'>
                  <BadgeCheck className='h-3.5 w-3.5' />
                  Verified advertiser
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
