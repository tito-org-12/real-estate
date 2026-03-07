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
  meta: jsonb("meta").$type<Record<string, any>>().notNull(), // dynamic attributes
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
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("inquiries_listing_idx").on(table.listingId),
    index("inquiries_user_idx").on(table.userId),
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
