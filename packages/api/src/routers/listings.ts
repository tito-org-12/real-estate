import { listings, listingTypeEnum } from "@my-better-t-app/db/schema";
import { and, asc, desc, eq, gte, ilike, inArray, lte, or } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

const verificationStatusSchema = z.enum([
  "pending",
  "verified",
  "needs_review",
]);

function withTrustSignals<
  T extends { createdAt: Date; meta: Record<string, unknown> },
>(listing: T) {
  const meta = listing.meta ?? {};
  const publishedAt = new Date(
    typeof meta.publishedAt === "string" ? meta.publishedAt : listing.createdAt,
  );
  const expiresAt = new Date(
    typeof meta.expiresAt === "string"
      ? meta.expiresAt
      : publishedAt.getTime() + 30 * 24 * 60 * 60 * 1000,
  );
  const revalidatedAt =
    typeof meta.revalidatedAt === "string"
      ? new Date(meta.revalidatedAt)
      : null;
  const verificationStatus = verificationStatusSchema.safeParse(
    meta.verificationStatus,
  ).success
    ? (meta.verificationStatus as z.infer<typeof verificationStatusSchema>)
    : "pending";

  const now = Date.now();
  const isExpired = expiresAt.getTime() < now;
  const isStale = isExpired && !revalidatedAt;

  return {
    ...listing,
    trust: {
      verificationStatus,
      publishedAt: publishedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      revalidatedAt: revalidatedAt?.toISOString() ?? null,
      isExpired,
      isStale,
    },
  };
}

export const listingRouter = {
  list: publicProcedure
    .input(
      z.object({
        type: z.enum(listingTypeEnum.enumValues).optional(),
        search: z.string().trim().min(1).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sortBy: z
          .enum(["recency", "price_asc", "price_desc"])
          .default("recency"),
        limit: z.number().int().positive().default(20),
        cursor: z.number().int().nonnegative().default(0), // Simple offset for now
      }),
    )
    .handler(async ({ context, input }) => {
      const filters = [];
      filters.push(eq(listings.status, "published"));

      if (input.type) {
        filters.push(eq(listings.type, input.type));
      }
      if (input.search) {
        const term = `%${input.search}%`;
        filters.push(
          or(ilike(listings.title, term), ilike(listings.location, term))!,
        );
      }
      if (input.minPrice !== undefined) {
        filters.push(gte(listings.price, input.minPrice));
      }
      if (input.maxPrice !== undefined) {
        filters.push(lte(listings.price, input.maxPrice));
      }

      let orderBy = desc(listings.createdAt);
      if (input.sortBy === "price_asc") {
        orderBy = asc(listings.price);
      } else if (input.sortBy === "price_desc") {
        orderBy = desc(listings.price);
      }

      const items = await context.db.query.listings.findMany({
        where: and(...filters),
        limit: input.limit,
        offset: input.cursor,
        orderBy,
      });

      return items.map(withTrustSignals);
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        price: z.number().int().positive(),
        type: z.enum(listingTypeEnum.enumValues),
        description: z.string(),
        location: z.string(),
        meta: z.record(z.string(), z.unknown()),
        images: z.array(z.string()).default([]),
      }),
    )
    .handler(async ({ context, input }) => {
      const publishedAt = new Date();
      const expiresAt = new Date(publishedAt);
      expiresAt.setDate(expiresAt.getDate() + 30);

      const [newItem] = await context.db
        .insert(listings)
        .values({
          ...input,
          meta: {
            ...input.meta,
            verificationStatus: "pending",
            publishedAt: publishedAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
          },
          ownerId: context.session.user.id,
          status: "published", // Auto-publish for MVP
        })
        .returning();

      if (!newItem) {
        throw new Error("Failed to create listing");
      }

      return withTrustSignals(newItem);
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ context, input }) => {
      const item = await context.db.query.listings.findFirst({
        where: and(eq(listings.id, input.id), eq(listings.status, "published")),
        with: {
          owner: true,
        },
      });
      return item ? withTrustSignals(item) : null;
    }),

  mine: protectedProcedure
    .input(
      z.object({
        status: z.enum(["draft", "published", "rented"]).optional(),
        limit: z.number().int().positive().default(50),
      }),
    )
    .handler(async ({ context, input }) => {
      const filters = [eq(listings.ownerId, context.session.user.id)];
      if (input.status) {
        filters.push(eq(listings.status, input.status));
      }

      const items = await context.db.query.listings.findMany({
        where: and(...filters),
        limit: input.limit,
        orderBy: desc(listings.updatedAt),
      });

      return items.map(withTrustSignals);
    }),

  bulkUpdateStatus: protectedProcedure
    .input(
      z.object({
        listingIds: z.array(z.string()).min(1).max(50),
        status: z.enum(["draft", "published", "rented"]),
      }),
    )
    .handler(async ({ context, input }) => {
      const updated = await context.db
        .update(listings)
        .set({
          status: input.status,
        })
        .where(
          and(
            eq(listings.ownerId, context.session.user.id),
            inArray(listings.id, input.listingIds),
          ),
        )
        .returning({ id: listings.id, status: listings.status });

      return {
        updatedCount: updated.length,
        updated,
      };
    }),

  revalidate: protectedProcedure
    .input(
      z.object({
        listingId: z.string(),
      }),
    )
    .handler(async ({ context, input }) => {
      const existing = await context.db.query.listings.findFirst({
        where: and(
          eq(listings.id, input.listingId),
          eq(listings.ownerId, context.session.user.id),
        ),
      });

      if (!existing) {
        throw new Error("Listing not found for current owner");
      }

      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 30);

      const [updated] = await context.db
        .update(listings)
        .set({
          meta: {
            ...existing.meta,
            verificationStatus: "verified",
            revalidatedAt: now.toISOString(),
            publishedAt:
              typeof existing.meta?.publishedAt === "string"
                ? existing.meta.publishedAt
                : existing.createdAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
          },
        })
        .where(eq(listings.id, existing.id))
        .returning();

      if (!updated) {
        throw new Error("Failed to revalidate listing");
      }

      return withTrustSignals(updated);
    }),

  advertisersDirectory: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().default(100),
      }),
    )
    .handler(async ({ context, input }) => {
      const activeListings = await context.db.query.listings.findMany({
        where: eq(listings.status, "published"),
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        limit: input.limit,
        orderBy: desc(listings.createdAt),
      });

      const byAdvertiser = new Map<
        string,
        {
          id: string;
          name: string;
          image: string | null;
          activeListings: number;
          verifiedListings: number;
          staleListings: number;
        }
      >();

      for (const item of activeListings) {
        if (!item.owner) continue;
        const trust = withTrustSignals(item).trust;
        const current = byAdvertiser.get(item.owner.id) ?? {
          id: item.owner.id,
          name: item.owner.name,
          image: item.owner.image ?? null,
          activeListings: 0,
          verifiedListings: 0,
          staleListings: 0,
        };

        current.activeListings += 1;
        if (trust.verificationStatus === "verified") {
          current.verifiedListings += 1;
        }
        if (trust.isStale) {
          current.staleListings += 1;
        }

        byAdvertiser.set(item.owner.id, current);
      }

      return [...byAdvertiser.values()].sort(
        (a, b) =>
          b.verifiedListings - a.verifiedListings ||
          b.activeListings - a.activeListings,
      );
    }),

  advertiserProfile: publicProcedure
    .input(
      z.object({
        ownerId: z.string(),
      }),
    )
    .handler(async ({ context, input }) => {
      const ownerListings = await context.db.query.listings.findMany({
        where: and(
          eq(listings.ownerId, input.ownerId),
          eq(listings.status, "published"),
        ),
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: desc(listings.createdAt),
      });

      if (!ownerListings.length || !ownerListings[0]?.owner) {
        return null;
      }

      const listingsWithTrust = ownerListings.map(withTrustSignals);
      const verifiedListings = listingsWithTrust.filter(
        (item) => item.trust.verificationStatus === "verified",
      ).length;
      const staleListings = listingsWithTrust.filter(
        (item) => item.trust.isStale,
      ).length;

      return {
        advertiser: ownerListings[0].owner,
        trust: {
          activeListings: ownerListings.length,
          verifiedListings,
          staleListings,
        },
        listings: listingsWithTrust,
      };
    }),
};
