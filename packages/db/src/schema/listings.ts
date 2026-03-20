import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export type ListingMeta = {
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  neighborhood?: string;
  phone?: string;
  whatsapp?: string;
  imagePublicId?: string; // legacy — keep for backward compat
  imagePublicIds?: string[]; // new multi-image
  verificationStatus?: "pending" | "verified" | "needs_review";
  publishedAt?: string;
  expiresAt?: string;
  revalidatedAt?: string;
  propertyKind?: string;
  furnishingStatus?: "furnished" | "unfurnished";
  [key: string]: any; // allow other dynamic fields
};

export const listingTypeEnum = pgEnum("listing_type", [
  "apartment",
  "house",
  "villa",
  "studio",
]);
export const listingStatusEnum = pgEnum("listing_status", [
  "draft",
  "published",
  "rented",
  "sold",
]);
export const inquiryChannelEnum = pgEnum("inquiry_channel", [
  "form",
  "whatsapp",
  "call",
]);
export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "responded",
  "archived",
]);

export const listings = pgTable("listings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  price: integer("price").notNull(), // stored in cents
  status: listingStatusEnum("status").notNull().default("draft"),
  type: listingTypeEnum("type").notNull(),
  description: text("description"),
  location: text("location"),
  meta: jsonb("meta").$type<ListingMeta>().notNull(), // dynamic attributes
  images: text("images").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const inquiries = pgTable(
  "inquiries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    message: text("message"),
    channel: inquiryChannelEnum("channel").notNull().default("form"),
    status: inquiryStatusEnum("status").notNull().default("new"),
    respondedAt: timestamp("responded_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("inquiries_listing_idx").on(table.listingId),
    index("inquiries_user_idx").on(table.userId),
    index("inquiries_status_idx").on(table.status),
  ],
);

export const listingsRelations = relations(listings, ({ one, many }) => ({
  owner: one(user, {
    fields: [listings.ownerId],
    references: [user.id],
  }),
  inquiries: many(inquiries),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  listing: one(listings, {
    fields: [inquiries.listingId],
    references: [listings.id],
  }),
  user: one(user, {
    fields: [inquiries.userId],
    references: [user.id],
  }),
}));
