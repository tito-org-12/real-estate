import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ListingMedia } from "./listing-media";
import { toDisplayValue, type ListingDetails } from "./listing-view-model";

export function ListingOverview({
  listing,
  referenceNumber,
  publishedAt,
  expiresAt,
  availabilityLabel,
  furnishingLabel,
  mapHref,
  displayMetaEntries,
}: Readonly<{
  listing: ListingDetails;
  referenceNumber: string;
  publishedAt: Date;
  expiresAt: Date;
  availabilityLabel: string;
  furnishingLabel: string;
  mapHref: string | null;
  displayMetaEntries: Array<[string, unknown]>;
}>) {
  return (
    <div className='space-y-6 lg:col-span-8 md:space-y-8'>
      <div className='mb-8'>
        <ListingMedia
          images={listing.images}
          title={listing.title}
          type={listing.type}
        />
      </div>

      <div className='space-y-4 border-border/40 border-b pb-6'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-3 font-medium text-muted-foreground text-xs uppercase tracking-wider'>
            {listing.location && (
              <div className='flex items-center gap-1'>
                <MapPin className='h-4 w-4' />
                <span className='capitalize'>{listing.location}</span>
              </div>
            )}
            <span className='text-border'>•</span>
            <span>
              Posted {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs uppercase tracking-wider'>
            <span>Ref {referenceNumber}</span>
            <span>Published {publishedAt.toLocaleDateString()}</span>
            <span>Expires {expiresAt.toLocaleDateString()}</span>
            <span>Verification {listing.trust.verificationStatus}</span>
            {listing.trust.isStale && <span>Needs revalidation</span>}
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge className='rounded-full border-0 bg-foreground px-3 py-1 font-medium text-[11px] text-background uppercase tracking-wider'>
              {availabilityLabel}
            </Badge>
            <Badge
              variant='outline'
              className='rounded-full px-3 py-1 font-medium text-[11px] uppercase tracking-wider'
            >
              {furnishingLabel}
            </Badge>
          </div>
          <h1 className='font-medium font-serif text-4xl text-foreground capitalize leading-none md:text-5xl'>
            {listing.title}
          </h1>
        </div>
      </div>

      {displayMetaEntries.length > 0 && (
        <div className='pt-2'>
          <h3 className='mb-5 font-medium font-serif text-2xl text-foreground md:text-3xl'>
            Details & Features
          </h3>
          <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
            {displayMetaEntries.map(([key, value]) => (
              <div
                key={key}
                className='rounded-xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-md'
              >
                <div className='mb-2 font-medium text-muted-foreground text-xs uppercase tracking-widest'>
                  {key.replaceAll(/([A-Z])/g, " $1").trim()}
                </div>
                <div className='font-sans font-medium text-base text-foreground capitalize not-italic'>
                  {toDisplayValue(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm md:p-8'>
        <h3 className='mb-4 font-medium font-serif text-2xl text-foreground md:text-3xl'>
          About this rental
        </h3>
        <p className='whitespace-pre-wrap font-sans text-base text-foreground/85 leading-7 not-italic'>
          {listing.description || "No description provided."}
        </p>
        {mapHref && (
          <a
            href={mapHref}
            target='_blank'
            rel='noreferrer'
            className='mt-6 inline-flex items-center rounded-full border border-primary/20 px-4 py-2 font-medium text-primary text-xs uppercase tracking-widest transition-colors hover:border-primary/40 hover:bg-primary/5'
          >
            View location on map
          </a>
        )}
      </div>
    </div>
  );
}
