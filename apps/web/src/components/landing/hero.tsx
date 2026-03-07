"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATS = [
  { value: "2.4k+", label: "Active Listings" },
  { value: "1", label: "Pilot City" },
  { value: "12k+", label: "Monthly Renters" },
];

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      router.push(`/listings?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push("/listings");
    }
  };

  const _handleSearchButtonClick = () => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      router.push(`/listings?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push("/listings");
    }
  };

  return (
    <section className='relative bg-secondary/20 py-20 md:py-28 lg:py-36'>
      <div className='container mx-auto max-w-[1100px] px-4 text-center md:px-6'>
        {/* Tagline */}
        <span className='mb-6 inline-block font-semibold text-primary text-xs uppercase tracking-[0.2em] md:text-sm'>
          Kigali House Rentals
        </span>

        {/* Headline */}
        <h1 className='mb-4 font-serif text-5xl text-foreground leading-[1.1] tracking-tight md:text-6xl lg:text-7xl'>
          Find your home
          <br />
          <span className='text-primary italic'>in Kigali.</span>
        </h1>

        {/* Subheadline */}
        <p className='mx-auto mb-10 max-w-xl text-lg text-muted-foreground leading-relaxed md:text-xl'>
          Browse trusted rental homes with clear pricing, neighborhood info, and
          fast landlord inquiries.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className='relative mx-auto mb-16 max-w-lg'
        >
          <div className='flex items-center rounded-full border border-border/60 bg-background p-1.5 shadow-lg transition-all duration-300 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30'>
            <Search className='ml-4 h-4 w-4 shrink-0 text-muted-foreground' />
            <Input
              type='text'
              className='h-10 border-0 bg-transparent text-sm shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0'
              placeholder='Search by city, neighborhood, or address...'
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <Button
              type='submit'
              size='icon'
              className='h-9 w-9 shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/90'
              aria-label='Search'
            >
              <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
        </form>

        {/* Stats */}
        <div className='flex items-center justify-center gap-12 md:gap-20'>
          {STATS.map((stat) => (
            <div key={stat.label} className='text-center'>
              <span className='block font-serif text-3xl text-foreground md:text-4xl'>
                {stat.value}
              </span>
              <span className='mt-1 block text-muted-foreground text-xs uppercase tracking-widest'>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
