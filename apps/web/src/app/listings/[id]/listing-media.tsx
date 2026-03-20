"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

function ImageCarousel({
  images,
  title,
  type,
}: Readonly<{
  images: string[];
  title: string;
  type?: string;
}>) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((previous) => (index + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goTo(current - 1);
      }
      if (event.key === "ArrowRight") {
        goTo(current + 1);
      }
    };

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [current, goTo]);

  return (
    <>
      <div className='group relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-md md:h-[60vh] md:max-h-[600px]'>
        <div
          className='flex h-full transition-transform duration-500 ease-in-out'
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className='relative h-full w-full shrink-0'
            >
              <img
                src={src}
                alt={`${title} ${index + 1}`}
                className='h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105'
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60' />

        {total > 1 && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              aria-label='Previous slide'
              className='absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60'
            >
              <ChevronLeft className='h-5 w-5' />
            </button>
            <button
              onClick={() => goTo(current + 1)}
              aria-label='Next slide'
              className='absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60'
            >
              <ChevronRight className='h-5 w-5' />
            </button>
          </>
        )}

        {total > 1 && (
          <div className='absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm'>
            {current + 1} / {total}
          </div>
        )}

        {type && (
          <Badge className='absolute bottom-6 left-6 rounded-md border-0 bg-white/95 px-4 py-1.5 font-medium text-black text-xs uppercase tracking-wide shadow-lg backdrop-blur-md'>
            {type}
          </Badge>
        )}

        {total > 1 && (
          <div className='absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5'>
            {images.map((src, index) => (
              <button
                key={`${src}-dot-${index}`}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {total > 1 && (
        <div className='mb-12 flex gap-2 overflow-x-auto pb-1'>
          {images.map((src, index) => (
            <button
              key={`${src}-thumb-${index}`}
              onClick={() => goTo(index)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                index === current
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <img
                src={src}
                alt={`Thumbnail ${index + 1}`}
                className='h-full w-full object-cover'
                loading='lazy'
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function ListingMedia({
  images,
  title,
  type,
}: Readonly<{
  images: string[];
  title: string;
  type?: string;
}>) {
  if (images.length > 1) {
    return <ImageCarousel images={images} title={title} type={type} />;
  }

  return (
    <div className='group relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-md md:h-[60vh] md:max-h-[600px]'>
      <img
        src={images[0] || "https://placehold.co/1200x800?text=No+Image"}
        alt={title}
        className='h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60' />
      <Badge className='absolute bottom-6 left-6 rounded-md border-0 bg-white/95 px-4 py-1.5 font-medium text-black text-xs uppercase tracking-wide shadow-lg backdrop-blur-md'>
        {type}
      </Badge>
    </div>
  );
}
