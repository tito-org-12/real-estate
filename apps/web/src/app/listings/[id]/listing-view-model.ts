export type ListingTrust = {
  verificationStatus: string;
  isStale: boolean;
};

export type ListingDetails = {
  id: string;
  ownerId: string;
  title: string;
  type: string;
  images: string[];
  price: number;
  description: string | null;
  location: string | null;
  createdAt: string | Date;
  status: string;
  meta: Record<string, unknown>;
  trust: ListingTrust;
  owner?: {
    instagram?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
  } | null;
};

export type InquiryDraft = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const HIDDEN_META_KEYS = new Set([
  "imagePublicId",
  "imagePublicIds",
  "publicId",
  "image_public_id",
  "cloudinaryPublicId",
  "cloudinary_public_id",
  "furnishingStatus",
  "publishedAt",
  "expiresAt",
  "revalidatedAt",
  "verificationStatus",
]);

const AVAILABILITY_LABELS: Record<string, string> = {
  published: "Available",
  rented: "Taken",
  sold: "Sold",
};

export function getAvailabilityLabel(status: string) {
  return AVAILABILITY_LABELS[status] ?? status;
}

export function getFurnishingLabel(meta: Record<string, unknown>) {
  const raw = meta.furnishingStatus;
  if (raw === "furnished") {
    return "Furnished";
  }
  if (raw === "unfurnished") {
    return "Unfurnished";
  }
  return "Furnishing not specified";
}

export function getVerificationLabel(
  verificationStatus: ListingTrust["verificationStatus"],
) {
  if (verificationStatus === "verified") {
    return "Verified Listing";
  }
  if (verificationStatus === "needs_review") {
    return "Under Review";
  }
  return "Pending Verification";
}

export function getPublishedAndExpiry(createdAt: string | Date) {
  const publishedAt = new Date(createdAt);
  const expiresAt = new Date(publishedAt);
  expiresAt.setDate(expiresAt.getDate() + 30);

  return { publishedAt, expiresAt };
}

export function buildWhatsAppHref(
  rawNumber: string,
  title: string,
  ref: string,
) {
  const digits = rawNumber.replaceAll(/\D/g, "");
  if (!digits) {
    return null;
  }

  const message = `Hello, I'm interested in ${title} (${ref})`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getPhoneHref(meta: Record<string, unknown>) {
  const rawPhone = meta.phone;
  const contactPhone =
    typeof rawPhone === "string" ? rawPhone.replaceAll(/\s+/g, "") : "";
  return contactPhone ? `tel:${contactPhone}` : null;
}

export function getMetaString(meta: Record<string, unknown>, key: string) {
  const value = meta[key];
  return typeof value === "string" ? value : "";
}

export function toDisplayValue(value: unknown) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return "";
}

export function getMapHref(location: string | null) {
  if (!location) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

export function getDisplayMetaEntries(meta: Record<string, unknown>) {
  return Object.entries(meta).filter(
    ([key, value]) =>
      !HIDDEN_META_KEYS.has(key) && value !== null && value !== "",
  );
}

export function normalizeExternalUrl(rawUrl?: string | null) {
  if (!rawUrl) {
    return null;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
