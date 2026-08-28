import {
  Bath,
  BedSingle,
  Car,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { getBedrooms, getHeroImage } from "./listings-browser.helpers";
import { type ListingRecord } from "./listings-browser.types";

export function ListingsSelectedPropertyPanel({
  listing,
}: Readonly<{
  listing: ListingRecord;
}>) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const images =
    listing.images.length > 0 ? listing.images : [getHeroImage(listing)];
  const primaryImage = images[activeImageIndex] ?? images[0];
  const thumbnails = images.slice(1, 4);
  const extraCount = Math.max(0, images.length - 4);
  const price = formatCurrency(listing.price / 100);
  const location = listing.location || "Kigali, Rwanda";
  const bedrooms = getBedrooms(listing) ?? 3;
  const bathrooms = Number(listing.meta?.bathrooms ?? 2);
  const garageCount = Number(listing.meta?.garage ?? 1);
  const area = `${listing.meta?.sqft ?? 180}m²`;
  const shortDescription =
    listing.description ||
    "The modern house offered for rent is an ideal option for those who appreciate a high quality of life. The house has large, spacious rooms with high ceilings and large windows that let in lots of natural light.";
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    setActiveImageIndex(0);
    setImageErrors({});
  }, [listing.id]);

  const goToPreviousImage = () => {
    setActiveImageIndex(
      (currentIndex) => (currentIndex - 1 + images.length) % images.length,
    );
  };

  const goToNextImage = () => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % images.length);
  };

  const markImageError = (index: number) => {
    setImageErrors((current) => ({ ...current, [index]: true }));
  };

  const hasPrimaryImageError = Boolean(imageErrors[activeImageIndex]);

  return (
    <aside className='hidden p-4 xl:block'>
      <div className='sticky top-4 rounded-[28px] bg-white p-4 shadow-[0_18px_60px_rgba(17,24,39,0.12)]'>
        <div
          className={`gap-3 ${
            hasMultipleImages ? "grid grid-cols-[minmax(0,1fr)_96px]" : "block"
          }`}
        >
          <div className='relative overflow-hidden rounded-[24px] bg-muted'>
            {hasPrimaryImageError ? (
              <div className='flex h-80 w-full items-center justify-center bg-[#f0f1f4] text-center'>
                <div className='space-y-2 px-6 text-[#7a7f8a]'>
                  <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-foreground'>
                    <Waves className='h-6 w-6' />
                  </div>
                  <div className='text-sm font-medium'>No image available</div>
                </div>
              </div>
            ) : (
              <img
                src={primaryImage}
                alt={listing.title}
                className='h-80 w-full object-cover'
                onError={() => markImageError(activeImageIndex)}
              />
            )}
            <button
              type='button'
              onClick={goToPreviousImage}
              className='absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm'
              aria-label='Previous image'
            >
              <ChevronLeft className='h-5 w-5' />
            </button>
            <button
              type='button'
              onClick={goToNextImage}
              className='absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm'
              aria-label='Next image'
            >
              <ChevronRight className='h-5 w-5' />
            </button>
          </div>

          {hasMultipleImages ? (
            <div className='flex flex-col gap-3'>
              {thumbnails.slice(0, 3).map((src, index) => {
                const imageIndex = index + 1;
                const hasThumbnailError = Boolean(imageErrors[imageIndex]);
                const isLastVisibleThumbnail =
                  index === Math.min(thumbnails.length, 3) - 1;
                const shouldShowExtraCount =
                  isLastVisibleThumbnail && extraCount > 0;

                return (
                  <button
                    key={src}
                    type='button'
                    onClick={() => setActiveImageIndex(imageIndex)}
                    className={`relative overflow-hidden rounded-2xl bg-muted transition-all ${
                      activeImageIndex === imageIndex
                        ? "ring-2 ring-[#4860f4]"
                        : ""
                    }`}
                    aria-label={`Show image ${imageIndex + 1}`}
                  >
                    {hasThumbnailError ? (
                      <div className='flex h-24 w-full items-center justify-center bg-[#f0f1f4] text-xs text-[#7a7f8a]'>
                        No image
                      </div>
                    ) : (
                      <img
                        src={src}
                        alt={`${listing.title} ${imageIndex + 1}`}
                        className='h-24 w-full object-cover'
                        onError={() => markImageError(imageIndex)}
                      />
                    )}
                    {shouldShowExtraCount ? (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/45 text-2xl font-semibold text-white'>
                        +{extraCount}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className='mt-5 flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h1 className='line-clamp-1 text-2xl leading-tight font-semibold text-foreground'>
              {listing.title}
            </h1>
            <div className='mt-1.5 flex items-center gap-1.5 text-sm text-[#6f7583]'>
              <MapPin className='h-4 w-4 shrink-0' />
              <span className='line-clamp-1'>{location}</span>
            </div>
          </div>
          <div className='shrink-0 text-right'>
            <div className='flex items-baseline justify-end gap-2'>
              <div className='text-3xl leading-none font-semibold text-[#4860f4]'>
                {price}
              </div>
              <div className='text-base text-[#656a77]'>/ month</div>
            </div>
          </div>
        </div>

        <div className='mt-5 flex flex-wrap gap-2'>
          <span className='inline-flex items-center gap-1.5 rounded-md bg-[#e8edf9] px-2 py-1 text-xs text-[#4f5663]'>
            <BedSingle className='h-3.5 w-3.5' />
            {bedrooms} Bedrooms
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-md bg-[#e8edf9] px-2 py-1 text-xs text-[#4f5663]'>
            <Bath className='h-3.5 w-3.5' />
            {bathrooms} Bathrooms
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-md bg-[#e8edf9] px-2 py-1 text-xs text-[#4f5663]'>
            <Car className='h-3.5 w-3.5' />
            {garageCount} Garage
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-md bg-[#e8edf9] px-2 py-1 text-xs text-[#4f5663]'>
            <Waves className='h-3.5 w-3.5' />
            Pool
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-md bg-[#e8edf9] px-2 py-1 text-xs text-[#4f5663]'>
            {area}
          </span>
        </div>

        <div className='mt-5 border-t border-border/60 pt-5'>
          <h3 className='mb-2 font-medium text-foreground'>
            Properties details
          </h3>
          <p className='text-sm leading-6 text-[#7a7f8a]'>
            {shortDescription}
            <button
              type='button'
              className='ml-2 font-medium text-[#4860f4] hover:underline'
            >
              Read more
            </button>
          </p>
        </div>

        <div className='mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-5'>
          <div className='flex min-w-0 items-center gap-3'>
            <div className='h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#d7dde9]'>
              <img
                src='https://placehold.co/72x72?text=MJ'
                alt='Agent avatar'
                className='h-full w-full object-cover'
              />
            </div>
            <div className='min-w-0'>
              <div className='text-base font-semibold text-foreground'>
                Michael Joseph
              </div>
              <div className='text-xs text-muted-foreground'>
                4.8 (15 reviews)
              </div>
            </div>
          </div>
          <div className='flex shrink-0 items-center gap-2'>
            <Button className='h-10 rounded-2xl bg-[#4860f4] px-4 text-sm font-medium text-white hover:bg-[#394fd6]'>
              <Phone className='mr-2 h-3.5 w-3.5' />
              Contact
            </Button>
            <Button
              variant='outline'
              className='h-10 w-10 rounded-2xl border-0 bg-[#2f3138] px-0 text-white hover:bg-[#25272d]'
            >
              <Mail className='h-3.5 w-3.5' />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
