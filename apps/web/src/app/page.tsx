"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  AtSign,
  Download,
  MapPin,
  MessageSquare,
  Share2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
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
];

const GUIDES = [
  {
    title: "How To Buy Property In Kigali In 2026",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Kigali Rental Yields: Districts To Watch",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Rwanda Legal Checklist For First-Time Investors",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Kigali Relocation Guide: Family-Friendly Neighborhoods",
    image:
      "https://images.unsplash.com/photo-1472220625704-91e1462799b2?q=80&w=1400&auto=format&fit=crop",
  },
];

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

export default function Home() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [marketTab, setMarketTab] = useState<MarketTab>("buy");

  const listingsQuery = useQuery(
    orpc.listings.list.queryOptions({
      input: {
        limit: 200,
      },
    }),
  );

  const propertyTypeCounts = useMemo(() => {
    const listings = listingsQuery.data ?? [];
    return {
      apartment: listings.filter((item) => item.type === "apartment").length,
      house: listings.filter((item) => item.type === "house").length,
      land: listings.filter((item) => item.meta?.propertyKind === "land")
        .length,
    };
  }, [listingsQuery.data]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const cmdOrCtrl = event.metaKey || event.ctrlKey;
      if (cmdOrCtrl && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    globalThis.addEventListener("keydown", handleShortcut);
    return () => {
      globalThis.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/listings?search=${encodeURIComponent(trimmed)}`);
      return;
    }
    router.push("/listings");
  };

  return (
    <main className='min-h-screen bg-background'>
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2600&auto=format&fit=crop'
            alt='Kigali properties'
            className='h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-[#0f2d62]/45' />
        </div>

        <div className='relative container mx-auto flex min-h-[58vh] max-w-[1400px] items-center px-4 py-20 md:px-6'>
          <div className='w-full text-center'>
            <h1 className='mx-auto max-w-3xl font-serif text-4xl text-white leading-tight md:text-6xl'>
              Find Your Place In Kigali
            </h1>
            <p className='mx-auto mt-4 max-w-2xl text-white/90 md:text-lg'>
              Search homes for sale and rent across Kigali with trusted local
              insights.
            </p>

            <div className='mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-white/30 bg-white/95 p-3 shadow-2xl backdrop-blur-sm'>
              <div className='flex flex-col gap-3 md:flex-row md:items-center'>
                <div className='relative flex-1'>
                  <MapPin className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#0f2d62]/70' />
                  <Input
                    ref={searchInputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder='Search by district, neighborhood, or landmark'
                    className='h-12 border-[#0f2d62]/20 bg-white pr-24 pl-9'
                  />
                  <div className='absolute top-1/2 right-3 -translate-y-1/2 rounded-md border border-[#0f2d62]/20 bg-[#f6f9ff] px-2 py-1 font-mono text-[#0f2d62] text-xs'>
                    CMD+K
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  className='h-12 bg-[#12b76a] px-6 text-white hover:bg-[#0fa75f]'
                >
                  Search
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container mx-auto max-w-[1400px] px-4 py-16 md:px-6'>
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

      <section className='bg-[#f4f8ff] py-16'>
        <div className='container mx-auto max-w-[900px] px-4 text-center md:px-6'>
          <h3 className='font-serif text-4xl text-[#0f2d62] md:text-5xl'>
            Thousands of Listings Across Rwanda
          </h3>
          <p className='mx-auto mt-4 max-w-2xl text-muted-foreground text-lg leading-relaxed'>
            From urban apartments in Kigali to homes in Rwanda's growing cities,
            Nestora helps you compare opportunities with local context and
            confidence.
          </p>
        </div>
      </section>

      <section className='container mx-auto max-w-[1400px] px-4 py-16 md:px-6'>
        <div className='mb-8 flex items-end justify-between'>
          <h2 className='font-serif text-3xl text-[#0f2d62] md:text-4xl'>
            Real Estate Guides
          </h2>
        </div>
        <div className='flex gap-5 overflow-x-auto pb-2'>
          {GUIDES.map((guide) => (
            <article
              key={guide.title}
              className='min-w-[290px] flex-1 rounded-xl border border-border/50 bg-card p-3 shadow-sm md:min-w-[320px]'
            >
              <img
                src={guide.image}
                alt={guide.title}
                className='h-44 w-full rounded-lg object-cover'
              />
              <h3 className='mt-4 font-medium text-[#0f2d62] text-lg'>
                {guide.title}
              </h3>
              <button className='mt-3 font-medium text-[#12b76a] text-sm hover:underline'>
                Read more
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className='container mx-auto max-w-[1400px] px-4 pb-16 md:px-6'>
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
          {Object.entries(REGION_LINKS[marketTab]).map(
            ([region, locations]) => (
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
            ),
          )}
        </div>

        <div className='mt-10 rounded-xl border border-border/50 bg-card p-6'>
          <h3 className='mb-4 font-serif text-2xl text-[#0f2d62]'>
            Property Types
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='rounded-lg bg-[#f4f8ff] p-4'>
              <p className='text-muted-foreground text-sm'>Apartments</p>
              <p className='mt-2 font-serif text-3xl text-[#0f2d62]'>
                {propertyTypeCounts.apartment}
              </p>
            </div>
            <div className='rounded-lg bg-[#f4fff8] p-4'>
              <p className='text-muted-foreground text-sm'>Houses</p>
              <p className='mt-2 font-serif text-3xl text-[#0f2d62]'>
                {propertyTypeCounts.house}
              </p>
            </div>
            <div className='rounded-lg bg-[#f4f8ff] p-4'>
              <p className='text-muted-foreground text-sm'>Land</p>
              <p className='mt-2 font-serif text-3xl text-[#0f2d62]'>
                {propertyTypeCounts.land}
              </p>
            </div>
          </div>
          <p className='mt-3 text-muted-foreground text-xs'>
            Average apartment asking price: {formatCurrency(1200)} / month
          </p>
        </div>
      </section>

      <footer className='border-border/60 border-t bg-[#0f2d62] py-14 text-white'>
        <div className='container mx-auto max-w-[1400px] px-4 md:px-6'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-5'>
            <div>
              <h4 className='mb-4 font-semibold text-[#8fe7b8]'>Resources</h4>
              <ul className='space-y-2 text-sm text-white/80'>
                <li>Help Center</li>
                <li>Market Reports</li>
                <li>Buying Checklist</li>
                <li>Rental Guides</li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 font-semibold text-[#8fe7b8]'>About Us</h4>
              <ul className='space-y-2 text-sm text-white/80'>
                <li>Company</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 font-semibold text-[#8fe7b8]'>
                For Professionals
              </h4>
              <ul className='space-y-2 text-sm text-white/80'>
                <li>List Properties</li>
                <li>Advertiser Directory</li>
                <li>Partner Program</li>
                <li>API Access</li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 font-semibold text-[#8fe7b8]'>Legal</h4>
              <ul className='space-y-2 text-sm text-white/80'>
                <li>Terms of Use</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li>Compliance</li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 font-semibold text-[#8fe7b8]'>Get The App</h4>
              <div className='space-y-3'>
                <button className='flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm'>
                  <Download className='h-4 w-4' />
                  App Store
                </button>
                <button className='flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm'>
                  <Download className='h-4 w-4' />
                  Google Play
                </button>
              </div>
            </div>
          </div>

          <div className='mt-10 flex flex-wrap items-center justify-between gap-4 border-white/15 border-t pt-6'>
            <p className='text-sm text-white/70'>
              © 2026 Nestora. All rights reserved.
            </p>
            <div className='flex items-center gap-2'>
              <Button
                size='icon-sm'
                variant='ghost'
                className='text-white hover:bg-white/10'
              >
                <Users className='h-4 w-4' />
              </Button>
              <Button
                size='icon-sm'
                variant='ghost'
                className='text-white hover:bg-white/10'
              >
                <AtSign className='h-4 w-4' />
              </Button>
              <Button
                size='icon-sm'
                variant='ghost'
                className='text-white hover:bg-white/10'
              >
                <MessageSquare className='h-4 w-4' />
              </Button>
              <Button
                size='icon-sm'
                variant='ghost'
                className='text-white hover:bg-white/10'
              >
                <Share2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
