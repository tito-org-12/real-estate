"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { trackPhase0Event } from "@/lib/analytics";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import {
  buildWhatsAppHref,
  getAvailabilityLabel,
  getDisplayMetaEntries,
  getFurnishingLabel,
  getMapHref,
  getMetaString,
  normalizeExternalUrl,
  getPhoneHref,
  getPublishedAndExpiry,
  getVerificationLabel,
  type InquiryDraft,
  type ListingDetails,
} from "./listing-view-model";

export function useListingDetails(params: Promise<{ id: string }>) {
  const { id } = use(params);
  const { data: session } = authClient.useSession();
  const [inquiry, setInquiry] = useState<InquiryDraft>({
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

  const trackClickMutation = useMutation(
    orpc.inquiries.create.mutationOptions({
      onError: () => {
        // Silent failure keeps contact actions fast.
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

  const listingDetails = listing ? (listing as ListingDetails) : null;

  const referenceNumber = listingDetails
    ? `NST-${listingDetails.id.slice(0, 8).toUpperCase()}`
    : "";
  const availabilityLabel = listingDetails
    ? getAvailabilityLabel(listingDetails.status)
    : "";
  const furnishingLabel = listingDetails
    ? getFurnishingLabel(listingDetails.meta)
    : "";

  const publishedAndExpiry = listingDetails
    ? getPublishedAndExpiry(listingDetails.createdAt)
    : null;

  const whatsappHref = listingDetails
    ? buildWhatsAppHref(
        getMetaString(listingDetails.meta, "whatsapp"),
        listingDetails.title,
        referenceNumber,
      )
    : null;

  const phoneHref = listingDetails ? getPhoneHref(listingDetails.meta) : null;
  const mapHref = listingDetails ? getMapHref(listingDetails.location) : null;

  const verificationLabel = listingDetails
    ? getVerificationLabel(listingDetails.trust.verificationStatus)
    : "Pending Verification";

  const displayMetaEntries = listingDetails
    ? getDisplayMetaEntries(listingDetails.meta)
    : [];

  const instagramHref = normalizeExternalUrl(listingDetails?.owner?.instagram);
  const linkedinHref = normalizeExternalUrl(listingDetails?.owner?.linkedin);
  const twitterHref = normalizeExternalUrl(listingDetails?.owner?.twitter);

  const updateInquiryField = (field: keyof InquiryDraft, value: string) => {
    setInquiry((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleInquirySubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!listingDetails) {
      return;
    }

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

  return {
    id,
    inquiry,
    isLoading,
    listingDetails,
    showSignUpPrompt,
    setShowSignUpPrompt,
    inquiryMutation,
    trackClickMutation,
    referenceNumber,
    availabilityLabel,
    furnishingLabel,
    publishedAt: publishedAndExpiry?.publishedAt,
    expiresAt: publishedAndExpiry?.expiresAt,
    whatsappHref,
    phoneHref,
    mapHref,
    verificationLabel,
    displayMetaEntries,
    instagramHref,
    linkedinHref,
    twitterHref,
    updateInquiryField,
    handleInquirySubmit,
  };
}
