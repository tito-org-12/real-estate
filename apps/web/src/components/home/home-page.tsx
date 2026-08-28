"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { FeaturedSection } from "@/components/landing/featured-section";
import { HousenHero } from "@/components/landing/hero";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";

const TOP_DESTINATIONS = [
  {
    name: "Nyarutarama, Kigali",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2000&auto=format&fit=crop",
  },
  {
    name: "Kacyiru, Kigali",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop",
  },
  {
    name: "Kimihurura, Kigali",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2000&auto=format&fit=crop",
  },
  {
    name: "Kibagabaga, Kigali",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000&auto=format&fit=crop",
  },
] as const;

const REGION_LINKS = {
  buy: {
    "Kigali Districts": ["Gasabo", "Kicukiro", "Nyarugenge"],
    "Popular Neighborhoods": [
      "Kacyiru",
      "Kimihurura",
      "Nyarutarama",
      "Kibagabaga",
      "Gisozi",
    ],
    "Secondary Cities": ["Huye", "Musanze", "Rubavu", "Rwamagana", "Muhanga"],
    "Growth Corridors": [
      "Kigali Special Economic Zone",
      "Kigali Innovation City",
      "Nyamirambo Corridor",
      "Kanombe Axis",
    ],
  },
  rent: {
    "Kigali Districts": ["Gasabo", "Kicukiro", "Nyarugenge"],
    "High-Demand Areas": [
      "Kacyiru",
      "Remera",
      "Kimironko",
      "Nyarutarama",
      "Kibagabaga",
    ],
    "Student Hubs": ["Nyarugenge", "Gikondo", "Kacyiru", "Gisozi"],
    "Commuter-Friendly Zones": ["Kanombe", "Kimironko", "Kagarama", "Gacuriro"],
  },
} as const;

type MarketTab = "buy" | "rent";

function TopDestinationsSection() {
  return (
    <section className='container mx-auto max-w-350 px-4 py-16 md:px-6'>
      <div className='mb-8 flex items-end justify-between'>
        <h2 className='font-serif text-3xl text-[#0f2d62] md:text-4xl'>
          Top Destinations
        </h2>
        <Link
          href='/listings'
          className='font-medium text-[#12b76a] text-sm hover:underline'
        >
          Explore all destinations
        </Link>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
        {TOP_DESTINATIONS.map((destination) => (
          <div
            key={destination.name}
            className='group overflow-hidden rounded-xl border border-border/50 bg-card'
          >
            <div className='relative h-52 overflow-hidden'>
              <img
                src={destination.image}
                alt={destination.name}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-linear-to-t from-[#0f2d62]/75 to-transparent' />
              <p className='absolute bottom-4 left-4 font-serif text-2xl text-white'>
                {destination.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LatestListingsSection() {
  const listingsQuery = useQuery(
    orpc.listings.list.queryOptions({
      input: { limit: 200 },
    }),
  );

  const latestListings = listingsQuery.data?.slice(0, 12) ?? [];

  let latestListingsContent = (
    <div className='rounded-xl border border-border/60 bg-card p-8 text-center text-muted-foreground'>
      No listings available right now.
    </div>
  );

  if (listingsQuery.isLoading) {
    latestListingsContent = (
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className='h-105 animate-pulse rounded-sm bg-muted' />
        ))}
      </div>
    );
  } else if (latestListings.length > 0) {
    latestListingsContent = (
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {latestListings.map((listing) => (
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
    );
  }

  return (
    <section className='container mx-auto max-w-350 px-4 pb-8 md:px-6'>
      <div className='mb-8 flex items-center gap-4'>
        <h2 className='font-serif text-3xl text-[#0f2d62] md:text-4xl'>
          Latest Listings
        </h2>
        <Link
          href='/listings'
          className='ml-auto inline-flex items-center gap-2 rounded-full border border-[#12b76a]/30 bg-[#12b76a]/8 px-4 py-2 font-medium text-[#0f7f4c] text-sm leading-none transition-colors hover:bg-[#12b76a]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12b76a]/40 whitespace-nowrap'
        >
          View all properties
          <ArrowRight className='h-3.5 w-3.5' />
        </Link>
      </div>
      {latestListingsContent}
    </section>
  );
}

function MarketExplorerSection() {
  const [marketTab, setMarketTab] = useState<MarketTab>("buy");

  return (
    <section className='container mx-auto max-w-350 px-4 pb-16 md:px-6'>
      <div className='mb-6 inline-flex rounded-lg border border-border/60 bg-card p-1'>
        <button
          type='button'
          onClick={() => setMarketTab("buy")}
          className={`rounded-md px-5 py-2 font-medium text-sm transition ${
            marketTab === "buy"
              ? "bg-[#0f2d62] text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          type='button'
          onClick={() => setMarketTab("rent")}
          className={`rounded-md px-5 py-2 font-medium text-sm transition ${
            marketTab === "rent"
              ? "bg-[#12b76a] text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rent
        </button>
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4'>
        {Object.entries(REGION_LINKS[marketTab]).map(([region, locations]) => (
          <div
            key={region}
            className='rounded-xl border border-border/50 bg-card p-5'
          >
            <h4 className='mb-3 font-semibold text-[#0f2d62]'>{region}</h4>
            <ul className='space-y-2'>
              {locations.map((location: string) => (
                <li key={location}>
                  <button
                    type='button'
                    className='text-muted-foreground text-sm transition-colors hover:text-[#12b76a]'
                  >
                    {location}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickSearchSection() {
  return (
    <section className='container mx-auto max-w-350 px-4 pb-12 md:px-6'>
      <div className='mx-auto w-full max-w-3xl rounded-2xl border border-border/60 bg-card p-6 shadow-sm'>
        <p className='mb-4 font-serif text-xl text-[#0f2d62]'>
          Quick property search
        </p>
        <div className='flex flex-col gap-3 md:flex-row md:items-center'>
          <div className='relative flex-1'>
            <MapPin className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#0f2d62]/70' />
            <Input
              placeholder='Search by district, neighborhood, or landmark'
              className='h-12 border-[#0f2d62]/20 bg-white pr-24 pl-9'
            />
            <div className='absolute top-1/2 right-3 -translate-y-1/2 rounded-md border border-[#0f2d62]/20 bg-[#f6f9ff] px-2 py-1 font-mono text-[#0f2d62] text-xs'>
              CMD+K
            </div>
          </div>
          <Link
            href='/listings'
            className='flex h-12 items-center justify-center gap-2 rounded-md bg-[#12b76a] px-6 text-sm font-medium text-white hover:bg-[#0fa75f]'
          >
            Search
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className='bg-black px-4 py-12 text-white md:px-6 md:py-16'>
      <div className='mx-auto max-w-350'>
        <div className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr] lg:items-start'>
          <div className='space-y-6'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5'>
                <span className='font-serif text-2xl leading-none'>⌂</span>
              </div>
              <div>
                <p className='text-[11px] uppercase tracking-[0.32em] text-white/45'>
                  Kigali Home
                </p>
                <p className='font-serif text-lg text-white/90'>
                  Modern real estate
                </p>
              </div>
            </div>

            <div className='space-y-1 text-white/75'>
              <p className='text-[11px] uppercase tracking-[0.28em] text-white/40'>
                Shoot us an email
              </p>
              <a
                href='mailto:info@kigalihome.com'
                className='text-sm transition-colors hover:text-white'
              >
                info@kigalihome.com
              </a>
            </div>
          </div>

          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:justify-self-center'>
            <div className='space-y-4'>
              <p className='text-[11px] uppercase tracking-[0.28em] text-white/40'>
                • Navigation
              </p>
              <div className='space-y-2 text-2xl leading-tight text-white/92'>
                <Link
                  href='/'
                  className='block transition-opacity hover:opacity-70'
                >
                  Home
                </Link>
                <Link
                  href='/listings'
                  className='block transition-opacity hover:opacity-70'
                >
                  Listings
                </Link>
                <Link
                  href='/advertisers'
                  className='block transition-opacity hover:opacity-70'
                >
                  About
                </Link>
                <Link
                  href='/dashboard'
                  className='block transition-opacity hover:opacity-70'
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className='space-y-4 lg:justify-self-end'>
            <p className='text-[11px] uppercase tracking-[0.28em] text-white/40'>
              • Socials
            </p>
            <div className='space-y-2 text-2xl leading-tight text-white/92'>
              <a
                href='https://x.com'
                target='_blank'
                rel='noreferrer'
                className='block transition-opacity hover:opacity-70'
              >
                Twitter
              </a>
              <a
                href='https://www.linkedin.com'
                target='_blank'
                rel='noreferrer'
                className='block transition-opacity hover:opacity-70'
              >
                Linkedin
              </a>
              <a
                href='https://www.instagram.com'
                target='_blank'
                rel='noreferrer'
                className='block transition-opacity hover:opacity-70'
              >
                Instagram
              </a>
              <a
                href='https://www.facebook.com'
                target='_blank'
                rel='noreferrer'
                className='block transition-opacity hover:opacity-70'
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className='mt-14 grid gap-6 lg:grid-cols-[0.35fr_1fr] lg:items-center'>
          <div className='text-[11px] uppercase tracking-[0.28em] text-white/40'>
            • Newsletter
          </div>

          <div className='grid gap-4 md:grid-cols-[1fr_auto] md:items-end'>
            <div className='space-y-4'>
              <p className='text-[11px] uppercase tracking-[0.28em] text-white/40'>
                Receive updates and news from us
              </p>
              <div className='flex items-center gap-3 border-b border-white/25 pb-3'>
                <Mail className='h-4 w-4 shrink-0 text-white/45' />
                <input
                  type='email'
                  placeholder='Your email address'
                  className='w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none'
                />
              </div>
            </div>

            <Button className='h-12 rounded-full bg-[#f8be7c] px-7 text-sm font-medium text-[#171717] hover:bg-[#f6b468]'>
              Submit
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HomePage() {
  return (
    <main className='min-h-screen bg-background'>
      <HousenHero />
      <FeaturedSection />
      <TopDestinationsSection />
      <LatestListingsSection />
      <MarketExplorerSection />
      <QuickSearchSection />
      <FooterSection />
    </main>
  );
}
