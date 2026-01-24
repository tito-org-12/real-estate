import { relations } from "drizzle-orm";
import {
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const listingTypeEnum = pgEnum("listing_type", [
	"property",
	"vehicle",
	"land",
]);
export const listingStatusEnum = pgEnum("listing_status", [
	"draft",
	"published",
	"sold",
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

export const listingsRelations = relations(listings, ({ one }) => ({
	owner: one(user, {
		fields: [listings.ownerId],
		references: [user.id],
	}),
}));
