"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ChevronLeft, ChevronRight, MapPin, Phone, User, X } from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { trackPhase0Event } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

function ImageCarousel({
  images,
  title,
  type,
}: {
  images: string[];
  title: string;
  type?: string;
}) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const goTo = useCallback((i: number) => {
    setCurrent((current) => (i + total) % total);
  }, [total]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, total, goTo]);

  return (
    <>
      {/* Main slide container */}
      <div className="group relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-md md:h-[60vh] md:max-h-[600px]">
        {/* Sliding track */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="relative h-full w-full shrink-0">
              <img
                src={src}
                alt={`${title} — photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => goTo(current + 1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter badge */}
        {total > 1 && (
          <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-white text-xs backdrop-blur-sm">
            {current + 1} / {total}
          </div>
        )}

        {/* Type badge — same position as before */}
        {type && (
          <Badge className="absolute bottom-6 left-6 rounded-md border-0 bg-white/95 px-4 py-1.5 font-medium text-black text-xs uppercase tracking-wide shadow-lg backdrop-blur-md">
            {type}
          </Badge>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="mb-12 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                i === current
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default function ListingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = authClient.useSession();
  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  const listingQueryOptions = orpc.listings.get.queryOptions({
    input: { id },
  });

  const { data: listing, isLoading } = useQuery({
    ...listingQueryOptions,
    enabled: Boolean(id),
  });

  const inquiryMutation = useMutation(
    orpc.inquiries.create.mutationOptions({
      onSuccess: () => {
        trackPhase0Event("inquiry_submitted", {
          listingId: id,
        });
        trackPhase0Event("request_details_submitted" as any, {
          listingId: id,
        });
        toast.success("Inquiry sent. The landlord has received your message.");
        setInquiry({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        if (!session?.user) {
          setShowSignUpPrompt(true);
        }
      },
      onError: (error) => {
        trackPhase0Event("inquiry_submit_failed", {
          listingId: id,
          reason: error.message,
        });
        toast.error(error.message || "Unable to send inquiry.");
      },
    }),
  );

  // Separate mutation for click tracking (fire-and-forget for WhatsApp/Call)
  const trackClickMutation = useMutation(
    orpc.inquiries.create.mutationOptions({
      onError: () => {
        // Silent failure — click tracking should not interrupt user flow
      },
    }),
  );

  useEffect(() => {
    if (!listing) {
      return;
    }

    trackPhase0Event("listing_detail_viewed", {
      listingId: listing.id,
      type: listing.type,
    });
  }, [listing]);

  if (isLoading)
    return (
      <div className='container py-20'>
        <Skeleton className='mx-auto h-96 w-full max-w-5xl rounded-lg' />
      </div>
    );

  if (!listing)
    return (
      <div className='container py-20 text-center'>Listing not found.</div>
    );

  const handleInquirySubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    trackPhase0Event("inquiry_cta_clicked", {
      listingId: id,
    });

    inquiryMutation.mutate({
      listingId: id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || undefined,
      message: inquiry.message,
      channel: "form",
    });
  };

  const referenceNumber = `NST-${listing.id.slice(0, 8).toUpperCase()}`;
  const publishedAt = new Date(listing.createdAt);
  const expiresAt = new Date(publishedAt);
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Helper to build WhatsApp deep link with proper phone number sanitization
  const buildWhatsAppHref = (rawNumber: string, title: string, ref: string): string | null => {
    const digits = rawNumber.replace(/\D/g, "");
    if (!digits) return null;
    const message = `Hello, I'm interested in ${title} (${ref})`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  };

  const whatsappHref = buildWhatsAppHref(
    String(listing.meta?.whatsapp ?? ""),
    listing.title,
    referenceNumber,
  );
  const contactPhone = String(listing.meta?.phone ?? "").replaceAll(/\s+/g, "");
  const phoneHref = contactPhone ? `tel:${contactPhone}` : null;
  const mapHref = listing.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location)}`
    : null;
  let verificationLabel = "Pending Verification";
  if (listing.trust.verificationStatus === "verified") {
    verificationLabel = "Verified Listing";
  } else if (listing.trust.verificationStatus === "needs_review") {
    verificationLabel = "Under Review";
  }
  const hiddenMetaKeys = new Set([
    "imagePublicId",
    "imagePublicIds",
    "publicId",
    "image_public_id",
    "cloudinaryPublicId",
    "cloudinary_public_id",
  ]);
  const displayMetaEntries = Object.entries(listing.meta ?? {}).filter(
    ([key, value]) =>
      !hiddenMetaKeys.has(key) && value !== null && value !== "",
  );

  return (
    <div className='min-h-screen bg-background pb-20'>
      <div className='container mx-auto max-w-[1400px] px-4 py-8 md:px-6 md:py-12'>
        {/* Gallery carousel or static hero */}
        <div className='mb-12'>
          {listing.images.length > 1 ? (
            <ImageCarousel
              images={listing.images}
              title={listing.title}
              type={listing.type}
            />
          ) : (
            <div className='group relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-md md:h-[60vh] md:max-h-[600px]'>
              <img
                src={
                  listing.images[0] ||
                  "https://placehold.co/1200x800?text=No+Image"
                }
                alt={listing.title}
                className='h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60' />
              <Badge className='absolute bottom-6 left-6 rounded-md border-0 bg-white/95 px-4 py-1.5 font-medium text-black text-xs uppercase tracking-wide shadow-lg backdrop-blur-md'>
                {listing.type}
              </Badge>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12'>
          <div className='space-y-10 lg:col-span-8'>
            <div className='space-y-6 border-border/40 border-b pb-10'>
              <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-3 font-medium text-muted-foreground text-sm uppercase tracking-widest'>
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
                <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs uppercase tracking-widest'>
                  <span>Ref {referenceNumber}</span>
                  <span>Published {publishedAt.toLocaleDateString()}</span>
                  <span>Expires {expiresAt.toLocaleDateString()}</span>
                  <span>Verification {listing.trust.verificationStatus}</span>
                  {listing.trust.isStale && <span>Needs revalidation</span>}
                </div>
                <h1 className='font-medium font-serif text-5xl text-foreground capitalize leading-none md:text-6xl'>
                  {listing.title}
                </h1>
              </div>
            </div>

            <div className='prose max-w-none text-muted-foreground leading-relaxed'>
              <h3 className='mb-6 font-medium font-serif text-3xl text-foreground'>
                About this rental
              </h3>
              <p className='whitespace-pre-wrap font-light text-foreground/80 text-xl leading-relaxed'>
                {listing.description || "No description provided."}
              </p>
              {mapHref && (
                <a
                  href={mapHref}
                  target='_blank'
                  rel='noreferrer'
                  className='mt-4 inline-flex text-primary text-sm underline-offset-4 hover:underline'
                >
                  View location on map
                </a>
              )}
            </div>

            {displayMetaEntries.length > 0 && (
              <div className='pt-8'>
                <h3 className='mb-8 font-medium font-serif text-3xl text-foreground'>
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
                      <div className='font-serif text-2xl text-foreground capitalize'>
                        {value?.toString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='lg:col-span-4'>
            <div className='sticky top-24 space-y-6'>
              <div className='rounded-2xl border border-border/60 bg-card p-8 shadow-black/5 shadow-xl'>
                <div className='mb-8 space-y-2'>
                  <div className='font-medium text-muted-foreground text-xs uppercase tracking-widest'>
                    Monthly Rent
                  </div>
                  <div className='font-serif text-5xl text-primary'>
                    {formatCurrency(listing.price / 100)}
                  </div>
                </div>

                <form className='space-y-4' onSubmit={handleInquirySubmit}>
                  <div className='space-y-2'>
                    <Label htmlFor='inquiry-name'>Full Name</Label>
                    <Input
                      id='inquiry-name'
                      required
                      value={inquiry.name}
                      onChange={(event) =>
                        setInquiry((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      placeholder='Your name'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='inquiry-email'>Email</Label>
                    <Input
                      id='inquiry-email'
                      type='email'
                      required
                      value={inquiry.email}
                      onChange={(event) =>
                        setInquiry((previous) => ({
                          ...previous,
                          email: event.target.value,
                        }))
                      }
                      placeholder='you@example.com'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='inquiry-phone'>Phone (optional)</Label>
                    <Input
                      id='inquiry-phone'
                      type='tel'
                      value={inquiry.phone}
                      onChange={(event) =>
                        setInquiry((previous) => ({
                          ...previous,
                          phone: event.target.value,
                        }))
                      }
                      placeholder='Your phone number'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='inquiry-message'>Message</Label>
                    <Textarea
                      id='inquiry-message'
                      required
                      minLength={10}
                      value={inquiry.message}
                      onChange={(event) =>
                        setInquiry((previous) => ({
                          ...previous,
                          message: event.target.value,
                        }))
                      }
                      placeholder="I'm interested in this home. Please share availability and next steps."
                    />
                  </div>
                  <Button
                    type='submit'
                    size='lg'
                    className='h-14 w-full rounded-full font-semibold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30'
                    disabled={inquiryMutation.isPending}
                  >
                    {inquiryMutation.isPending
                      ? "Sending..."
                      : "I'm Interested"}
                  </Button>
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <Button
                      type='button'
                      variant='outline'
                      className='h-12'
                      disabled={!whatsappHref}
                      onClick={() => {
                        if (!whatsappHref) return;
                        trackPhase0Event("contact_whatsapp_clicked" as any, {
                          listingId: id,
                          referenceNumber,
                        });
                        // Fire-and-forget lead record
                        trackClickMutation.mutate({
                          listingId: id,
                          channel: "whatsapp",
                        });
                        globalThis.open(
                          whatsappHref,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                    >
                      WhatsApp
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      className='h-12'
                      disabled={!phoneHref}
                      onClick={() => {
                        if (!phoneHref) return;
                        trackPhase0Event("contact_call_clicked" as any, {
                          listingId: id,
                          referenceNumber,
                        });
                        // Fire-and-forget lead record
                        trackClickMutation.mutate({
                          listingId: id,
                          channel: "call",
                        });
                        globalThis.location.href = phoneHref;
                      }}
                    >
                      <Phone className='mr-2 h-4 w-4' />
                      Call
                    </Button>
                  </div>
                  {!whatsappHref && !phoneHref && (
                    <p className='text-center text-muted-foreground text-xs'>
                      Contact number not provided by landlord for this listing.
                    </p>
                  )}
                </form>

                {showSignUpPrompt && (
                  <div className='mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4'>
                    <p className='mb-3 text-sm font-medium'>
                      Track your inquiry with a free account.
                    </p>
                    <div className='flex gap-2'>
                      <Link href='/login'>
                        <Button size='sm'>Create Account</Button>
                      </Link>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => setShowSignUpPrompt(false)}
                      >
                        No thanks
                      </Button>
                    </div>
                  </div>
                )}

                <div className='mt-8 flex items-center gap-4 border-border/40 border-t pt-6'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10'>
                    <User className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <div className='font-medium text-foreground'>
                      Landlord Contact
                    </div>
                    <div className='flex items-center gap-1 text-muted-foreground text-sm'>
                      <CheckCircle2 className='h-3 w-3 text-green-600' />
                      {verificationLabel}
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 p-8'>
                <h4 className='mb-2 font-serif text-primary-foreground/80 text-xl mix-blend-multiply'>
                  Renter Checklist
                </h4>
                <p className='mb-6 font-light text-muted-foreground text-sm leading-relaxed'>
                  Prepare your ID, move-in date, and household details to speed
                  up landlord response.
                </p>
                <Button
                  variant='link'
                  className='h-auto p-0 font-medium text-primary hover:text-primary/80'
                >
                  Get rental tips &rarr;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
