"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, MapPin, User } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { trackPhase0Event } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";

export default function ListingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    message: "",
  });

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
        toast.success("Inquiry sent. The landlord has received your message.");
        setInquiry({
          name: "",
          email: "",
          message: "",
        });
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
      message: inquiry.message,
    });
  };

  const coverImage =
    listing.images[0] || "https://placehold.co/1200x800?text=No+Image";

  return (
    <div className='min-h-screen bg-background pb-20'>
      <div className='container mx-auto max-w-[1400px] px-4 py-8 md:px-6 md:py-12'>
        <div className='group relative mb-12 aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-md md:h-[60vh] md:max-h-[600px]'>
          <img
            src={coverImage}
            alt={listing.title}
            className='h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60' />
          <Badge className='absolute bottom-6 left-6 rounded-md border-0 bg-white/95 px-4 py-1.5 font-medium text-black text-xs uppercase tracking-wide shadow-lg backdrop-blur-md'>
            {listing.type}
          </Badge>
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
            </div>

            <div className='pt-8'>
              <h3 className='mb-8 font-medium font-serif text-3xl text-foreground'>
                Details & Features
              </h3>
              <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
                {Object.entries(listing.meta).map(([key, value]) => (
                  <div
                    key={key}
                    className='rounded-xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-md'
                  >
                    <div className='mb-2 font-medium text-muted-foreground text-xs uppercase tracking-widest'>
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className='font-serif text-2xl text-foreground capitalize'>
                      {value?.toString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                </form>

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
                      Verified Member
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
