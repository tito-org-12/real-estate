import { Bath, BedDouble, Home, MapPin, Sofa } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  type: "apartment" | "house" | "villa" | "studio";
  location?: string | null;
  images: string[];
  meta: Record<string, any>;
  status?: string;
}

function getFurnishingLabel(value: unknown): string {
  if (typeof value !== "string") {
    return "Unfurnished";
  }

  const normalized = value.toLowerCase();

  if (normalized === "furnished") {
    return "Furnished";
  }

  if (normalized === "semi_furnished" || normalized === "semi-furnished") {
    return "Semi furnished";
  }

  return "Unfurnished";
}

export function ListingCard({
  id,
  title,
  price,
  type,
  location,
  images,
  meta,
  status,
}: ListingCardProps) {
  const coverImage = images[0] || "https://placehold.co/600x400?text=No+Image";
  const hasStatusBadge = status === "sold" || status === "rented";
  const statusLabel = status === "sold" ? "Sold" : "Taken";
  const furnishingLabel = getFurnishingLabel(meta?.furnishingStatus);

  return (
    <Link href={`/listings/${id}`} className='group block h-full'>
      <div className='flex h-full flex-col overflow-hidden rounded-sm border border-border/40 bg-card transition-all duration-300 hover:border-border/80 hover:shadow-lg'>
        {/* Image Container */}
        <div className='relative aspect-[3/2] overflow-hidden bg-muted'>
          <img
            src={coverImage}
            alt={title}
            className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-30 transition-opacity group-hover:opacity-20' />

          {hasStatusBadge && (
            <div className='absolute top-3 right-3'>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-foreground/85 px-3 py-1.5 font-medium text-[11px] text-white uppercase tracking-wide shadow-sm backdrop-blur-sm'>
                <span
                  className='h-1.5 w-1.5 rounded-full bg-red-400'
                  aria-hidden='true'
                />
                {statusLabel}
              </span>
            </div>
          )}

          <div className='absolute inset-x-3 top-3 flex items-start justify-between'>
            <div className='flex items-center gap-2'>
              <div className='rounded-sm bg-background/90 px-2.5 py-1 font-semibold text-[10px] text-foreground uppercase tracking-widest shadow-sm backdrop-blur-sm'>
                {type}
              </div>
              <div className='rounded-sm bg-emerald-600/90 px-2.5 py-1 font-medium text-[10px] text-white uppercase tracking-wide shadow-sm backdrop-blur-sm'>
                {furnishingLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex flex-grow flex-col space-y-4 p-5'>
          <div className='space-y-1'>
            <div className='flex items-baseline justify-between gap-2'>
              <h3 className='line-clamp-1 font-medium font-serif text-foreground text-xl transition-colors group-hover:text-primary'>
                {title}
              </h3>
              <span className='shrink-0 font-semibold text-primary'>
                {formatCurrency(price / 100)}
              </span>
            </div>

            {location && (
              <div className='flex items-center text-muted-foreground text-xs uppercase tracking-wider'>
                <MapPin className='mr-1 h-3.5 w-3.5' />
                <span className='line-clamp-1'>{location}</span>
              </div>
            )}
          </div>

          <div className='h-px w-full bg-border/40' />

          <div className='mt-auto grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground text-xs'>
            {meta.bedrooms && (
              <div className='flex items-center'>
                <BedDouble className='mr-1.5 h-3.5 w-3.5 opacity-70' />
                <span>{meta.bedrooms} Beds</span>
              </div>
            )}
            {meta.bathrooms && (
              <div className='flex items-center'>
                <Bath className='mr-1.5 h-3.5 w-3.5 opacity-70' />
                <span>{meta.bathrooms} Baths</span>
              </div>
            )}
            {meta.sqft && (
              <div className='flex items-center'>
                <Home className='mr-1.5 h-3.5 w-3.5 opacity-70' />
                <span>{meta.sqft} sqft</span>
              </div>
            )}
            {meta.neighborhood && (
              <div className='col-span-2 flex items-center'>
                <MapPin className='mr-1.5 h-3.5 w-3.5 opacity-70' />
                <span>{meta.neighborhood}</span>
              </div>
            )}
            {meta.furnishingStatus && (
              <div className='col-span-2 flex items-center'>
                <Sofa className='mr-1.5 h-3.5 w-3.5 opacity-70' />
                <span className='capitalize'>{meta.furnishingStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
