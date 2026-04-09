"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";

export function FeaturedSection() {
  const featuredProperties = [
    {
      title: "Beachside Villa",
      price: "$1.2M",
      beds: "3 Bed",
      baths: "2 Bath",
      area: "1,570 sq ft",
      location: "Suburban Area, Los Angeles",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: "Urban Loft",
      price: "$1.2M",
      beds: "3 Bed",
      baths: "2 Bath",
      area: "1,570 sq ft",
      location: "Suburban Area, Los Angeles",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: "Penthouse View",
      price: "$1.2M",
      beds: "3 Bed",
      baths: "2 Bath",
      area: "1,570 sq ft",
      location: "Suburban Area, Los Angeles",
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1400&auto=format&fit=crop",
    },
  ];

  return (
    <section className='bg-background py-16 md:py-24'>
      <div className='container mx-auto max-w-350 px-4 md:px-6'>
        <div className='mb-10 grid gap-6 md:mb-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:items-start'>
          <div>
            <p className='mb-3 text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground'>
              Curated selection
            </p>
            <h2 className='max-w-xl font-sans text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl'>
              <span className='block'>Featured</span>
              <span className='mt-1 block font-serif italic font-normal text-[#0f0f10]'>
                Properties
              </span>
            </h2>
          </div>

          <div className='md:ml-auto md:max-w-sm md:text-left'>
            <p className='max-w-sm text-base leading-7 text-muted-foreground'>
              We blend design, technology, and trust to connect people with
              spaces they&apos;ll love.
            </p>
            <Link
              href='/listings'
              className='mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#f8be7c] px-6 font-medium text-[#171717] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f6b468] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8be7c]/50'
            >
              View All
              <ArrowUpRight className='h-4 w-4' />
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:items-stretch'>
          {featuredProperties.map((property) => (
            <Link
              href='/listings'
              key={property.title}
              className='group block h-full'
            >
              <div className='relative h-97.5 overflow-hidden rounded-[14px] bg-muted md:h-102.5 xl:h-107.5'>
                <img
                  src={property.image}
                  alt={property.title}
                  className='h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-linear-to-t from-[#0f2d62]/82 via-[#0f2d62]/28 to-transparent' />

                <div className='absolute inset-x-0 bottom-0 p-4 text-white md:p-5'>
                  <div className='mb-2.5 flex items-end justify-between gap-4'>
                    <h3 className='font-medium text-[1.15rem] tracking-tight text-white md:text-[1.2rem]'>
                      {property.title}
                    </h3>
                    <span className='shrink-0 text-[1.05rem] font-medium text-white md:text-[1.1rem]'>
                      {property.price}
                    </span>
                  </div>

                  <div className='mb-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.88rem] text-white/86'>
                    <span>{property.beds}</span>
                    <span className='text-white/50'>|</span>
                    <span>{property.baths}</span>
                    <span className='text-white/50'>|</span>
                    <span>{property.area}</span>
                  </div>

                  <div className='flex items-center gap-1.5 text-[0.82rem] text-white/78'>
                    <MapPin className='h-4 w-4 shrink-0' />
                    <span>{property.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
