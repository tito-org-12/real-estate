"use client";

import { CheckCircle2, Phone, User } from "lucide-react";
import Link from "next/link";
import { trackPhase0Event } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ListingOverview } from "./listing-overview";
import { useListingDetails } from "./use-listing-details";

function SocialIconLink({
  href,
  label,
  children,
}: Readonly<{
  href: string;
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary'
      aria-label={label}
      title={label}
    >
      {children}
    </a>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox='0 0 24 24' className='h-4 w-4' fill='none' aria-hidden='true'>
      <rect
        x='3'
        y='3'
        width='18'
        height='18'
        rx='6'
        stroke='currentColor'
        strokeWidth='1.8'
      />
      <circle cx='12' cy='12' r='4.2' stroke='currentColor' strokeWidth='1.8' />
      <circle cx='17.3' cy='6.8' r='1.2' fill='currentColor' />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg
      viewBox='0 0 24 24'
      className='h-4 w-4'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M6.94 8.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM5.6 9.9h2.7V18H5.6V9.9Zm4.39 0h2.59v1.1h.04c.36-.68 1.25-1.4 2.58-1.4 2.75 0 3.26 1.8 3.26 4.15V18h-2.7v-3.78c0-.9-.02-2.06-1.26-2.06-1.26 0-1.45.98-1.45 2V18h-2.7V9.9Z' />
    </svg>
  );
}

function XLogo() {
  return (
    <svg
      viewBox='0 0 24 24'
      className='h-4 w-4'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M17.52 4h2.98l-6.5 7.44L21.64 20h-5.98l-4.69-5.53L6.11 20H3.12l6.95-7.94L2.76 4h6.13l4.23 4.99L17.52 4Zm-1.05 14.2h1.65L7.99 5.7H6.22l10.25 12.5Z' />
    </svg>
  );
}

function WhatsAppLogo() {
  return (
    <svg
      viewBox='0 0 24 24'
      className='h-4 w-4'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M20.52 3.48A11.77 11.77 0 0 0 12.1 0C5.53 0 .18 5.35.18 11.93c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.64a11.88 11.88 0 0 0 5.84 1.49h.01c6.57 0 11.92-5.35 11.92-11.93a11.82 11.82 0 0 0-3.51-8.44ZM12.1 21.83h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.22-3.72.98.99-3.62-.24-.37a9.89 9.89 0 0 1-1.53-5.28c0-5.47 4.45-9.92 9.92-9.92a9.8 9.8 0 0 1 7.03 2.91 9.84 9.84 0 0 1 2.89 7.01c0 5.47-4.45 9.92-9.92 9.92Zm5.44-7.42c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47a9.06 9.06 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.94-2.24-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.5 0 1.48 1.08 2.9 1.24 3.1.15.2 2.12 3.24 5.13 4.55.72.31 1.29.5 1.73.64.73.23 1.39.2 1.92.12.59-.09 1.78-.73 2.03-1.43.25-.7.25-1.31.18-1.43-.08-.13-.28-.2-.58-.35Z' />
    </svg>
  );
}

export default function ListingDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const details = useListingDetails(params);

  if (details.isLoading)
    return (
      <div className='container py-20'>
        <Skeleton className='mx-auto h-96 w-full max-w-5xl rounded-lg' />
      </div>
    );

  if (!details.listingDetails || !details.publishedAt || !details.expiresAt)
    return (
      <div className='container py-20 text-center'>Listing not found.</div>
    );

  return (
    <div className='min-h-screen bg-background pb-20'>
      <div className='container mx-auto max-w-[1400px] px-4 py-8 md:px-6 md:py-12'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12'>
          <ListingOverview
            listing={details.listingDetails}
            referenceNumber={details.referenceNumber}
            publishedAt={details.publishedAt}
            expiresAt={details.expiresAt}
            availabilityLabel={details.availabilityLabel}
            furnishingLabel={details.furnishingLabel}
            mapHref={details.mapHref}
            displayMetaEntries={details.displayMetaEntries}
          />

          <div className='lg:col-span-4'>
            <div className='sticky top-24 space-y-6'>
              <div className='rounded-2xl border border-border/60 bg-card p-8 shadow-[#0f2d62]/5 shadow-xl'>
                <div className='mb-8 space-y-2'>
                  <div className='font-medium text-muted-foreground text-xs uppercase tracking-wider'>
                    Monthly Rent
                  </div>
                  <div className='font-serif text-4xl text-primary md:text-5xl'>
                    {formatCurrency(details.listingDetails.price / 100)}
                  </div>
                </div>

                <form
                  className='space-y-4'
                  onSubmit={details.handleInquirySubmit}
                >
                  <div className='space-y-2'>
                    <Label
                      htmlFor='inquiry-name'
                      className='font-medium text-muted-foreground text-xs uppercase tracking-wider'
                    >
                      Full Name
                    </Label>
                    <Input
                      id='inquiry-name'
                      required
                      value={details.inquiry.name}
                      onChange={(event) =>
                        details.updateInquiryField("name", event.target.value)
                      }
                      placeholder='Your name'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='inquiry-email'
                      className='font-medium text-muted-foreground text-xs uppercase tracking-wider'
                    >
                      Email
                    </Label>
                    <Input
                      id='inquiry-email'
                      type='email'
                      required
                      value={details.inquiry.email}
                      onChange={(event) =>
                        details.updateInquiryField("email", event.target.value)
                      }
                      placeholder='you@example.com'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='inquiry-phone'
                      className='font-medium text-muted-foreground text-xs uppercase tracking-wider'
                    >
                      Phone (optional)
                    </Label>
                    <Input
                      id='inquiry-phone'
                      type='tel'
                      value={details.inquiry.phone}
                      onChange={(event) =>
                        details.updateInquiryField("phone", event.target.value)
                      }
                      placeholder='Your phone number'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='inquiry-message'
                      className='font-medium text-muted-foreground text-xs uppercase tracking-wider'
                    >
                      Message
                    </Label>
                    <Textarea
                      id='inquiry-message'
                      required
                      minLength={10}
                      value={details.inquiry.message}
                      onChange={(event) =>
                        details.updateInquiryField(
                          "message",
                          event.target.value,
                        )
                      }
                      placeholder="I'm interested in this home. Please share availability and next steps."
                    />
                  </div>
                  <Button
                    type='submit'
                    size='lg'
                    className='h-14 w-full rounded-full font-semibold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30'
                    disabled={details.inquiryMutation.isPending}
                  >
                    {details.inquiryMutation.isPending
                      ? "Sending..."
                      : "I'm Interested"}
                  </Button>
                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      className='h-10 w-10 rounded-full p-0'
                      aria-label='WhatsApp'
                      title='WhatsApp'
                      disabled={!details.whatsappHref}
                      onClick={() => {
                        if (!details.whatsappHref) return;
                        trackPhase0Event("contact_whatsapp_clicked" as any, {
                          listingId: details.id,
                          referenceNumber: details.referenceNumber,
                        });
                        details.trackClickMutation.mutate({
                          listingId: details.id,
                          channel: "whatsapp",
                        });
                        globalThis.open(
                          details.whatsappHref,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                    >
                      <WhatsAppLogo />
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      className='h-10 w-10 rounded-full p-0'
                      aria-label='Call'
                      title='Call'
                      disabled={!details.phoneHref}
                      onClick={() => {
                        if (!details.phoneHref) return;
                        trackPhase0Event("contact_call_clicked" as any, {
                          listingId: details.id,
                          referenceNumber: details.referenceNumber,
                        });
                        details.trackClickMutation.mutate({
                          listingId: details.id,
                          channel: "call",
                        });
                        globalThis.location.href = details.phoneHref;
                      }}
                    >
                      <Phone className='h-4 w-4' />
                    </Button>

                    {(details.instagramHref ||
                      details.linkedinHref ||
                      details.twitterHref) && (
                      <div className='flex items-center gap-2'>
                        {details.instagramHref && (
                          <SocialIconLink
                            href={details.instagramHref}
                            label='Instagram'
                          >
                            <InstagramLogo />
                          </SocialIconLink>
                        )}
                        {details.linkedinHref && (
                          <SocialIconLink
                            href={details.linkedinHref}
                            label='LinkedIn'
                          >
                            <LinkedInLogo />
                          </SocialIconLink>
                        )}
                        {details.twitterHref && (
                          <SocialIconLink
                            href={details.twitterHref}
                            label='Twitter / X'
                          >
                            <XLogo />
                          </SocialIconLink>
                        )}
                      </div>
                    )}
                  </div>
                  {!details.whatsappHref && !details.phoneHref && (
                    <p className='text-center text-muted-foreground text-xs'>
                      Contact number not provided by landlord for this listing.
                    </p>
                  )}
                </form>

                {details.showSignUpPrompt && (
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
                        onClick={() => details.setShowSignUpPrompt(false)}
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
                    <div className='font-medium text-base text-foreground'>
                      Landlord Contact
                    </div>
                    <div className='flex items-center gap-1 text-muted-foreground text-sm'>
                      <CheckCircle2 className='h-3 w-3 text-green-600' />
                      {details.verificationLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
