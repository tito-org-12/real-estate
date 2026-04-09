import { BedSingle, Car, Heart, Ruler } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { getBedrooms, getHeroImage } from "./listings-browser.helpers";
import { type ListingRecord } from "./listings-browser.types";

export function ListingResultCard({
  listing,
  active,
  onClick,
}: Readonly<{
  listing: ListingRecord;
  active: boolean;
  onClick: () => void;
}>) {
  const price = formatCurrency(listing.price / 100);
  const bedrooms = getBedrooms(listing);
  const location = listing.location || "Kigali, Rwanda";
  const garageCount = Number(listing.meta?.garage ?? 1);

  return (
    <button
      type='button'
      onClick={onClick}
      className={`group relative flex w-full gap-3 rounded-3xl border p-2.5 text-left transition-all ${
        active
          ? "border-[#9aa9ff] bg-white"
          : "border-transparent bg-white hover:border-[#d8ddff]"
      }`}
    >
      <div className='h-30 w-32 shrink-0 overflow-hidden rounded-2xl bg-[#d9dde6] md:h-32 md:w-36'>
        <img
          src={getHeroImage(listing)}
          alt={listing.title}
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
        />
      </div>

      <div className='flex min-w-0 flex-1 flex-col justify-between py-1 pr-1'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <div className='mb-1.5 flex items-center gap-1.5 text-[#4860f4]'>
              <span className='text-lg leading-none font-semibold md:text-xl'>
                {price}
              </span>
              <span className='text-xs text-[#6a6f7a] md:text-sm'>/ month</span>
            </div>
            <h3 className='line-clamp-1 text-base leading-tight font-semibold text-[#232530] md:text-lg'>
              {listing.title}
            </h3>
            <p className='mt-0.5 line-clamp-1 text-xs text-[#8a8f99] md:text-sm'>
              {location}
            </p>
          </div>
          <Heart
            className={`mt-1 h-5 w-5 shrink-0 ${
              active ? "fill-[#232530] text-[#232530]" : "text-[#747985]"
            }`}
          />
        </div>

        <div className='mt-2.5 flex flex-wrap gap-1.5'>
          <span className='inline-flex items-center gap-1 rounded-md bg-[#e8edf9] px-2 py-1 text-xs text-[#4f5663]'>
            <BedSingle className='h-3 w-3 text-[#52596a]' />
            {bedrooms ?? 3}
          </span>
          <span className='inline-flex items-center gap-1 rounded-md bg-[#e8edf9] px-2 py-1 text-xs text-[#4f5663]'>
            <Ruler className='h-3 w-3 text-[#52596a]' />
            {listing.meta?.sqft ? `${listing.meta.sqft}m²` : "180m²"}
          </span>
          <span className='inline-flex items-center gap-1 rounded-md bg-[#e8edf9] px-2 py-1 text-xs text-[#4f5663]'>
            <Car className='h-3 w-3 text-[#52596a]' />
            {garageCount} Garage
          </span>
        </div>
      </div>
    </button>
  );
}
