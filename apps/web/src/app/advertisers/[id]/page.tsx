"use client";

import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { orpc } from "@/utils/orpc";

export default function AdvertiserProfilePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = use(params);

  const { data, isLoading } = useQuery(
    orpc.listings.advertiserProfile.queryOptions({
      input: { ownerId: id },
    }),
  );

  if (isLoading) {
    return (
      <div className='container mx-auto max-w-6xl px-4 py-10'>
        <div className='h-28 animate-pulse rounded-lg bg-muted' />
      </div>
    );
  }

  if (!data) {
    return (
      <div className='container mx-auto max-w-6xl px-4 py-10'>
        <p className='text-muted-foreground'>Advertiser profile not found.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-6xl px-4 py-10'>
      <Link
        href={"/advertisers" as Route}
        className='mb-4 inline-flex items-center text-muted-foreground text-sm hover:text-foreground'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to advertisers
      </Link>

      <div className='mb-8 rounded-lg border bg-card p-6'>
        <h1 className='font-serif text-4xl'>{data.advertiser.name}</h1>
        <div className='mt-4 grid gap-3 text-sm md:grid-cols-3'>
          <div className='rounded-md bg-muted/40 p-3'>
            <p className='text-muted-foreground'>Active listings</p>
            <p className='font-medium text-xl'>{data.trust.activeListings}</p>
          </div>
          <div className='rounded-md bg-muted/40 p-3'>
            <p className='text-muted-foreground'>Verified listings</p>
            <p className='font-medium text-xl'>{data.trust.verifiedListings}</p>
          </div>
          <div className='rounded-md bg-muted/40 p-3'>
            <p className='text-muted-foreground'>Stale listings</p>
            <p className='font-medium text-xl'>{data.trust.staleListings}</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {data.listings.map((listing) => (
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
    </div>
  );
}
