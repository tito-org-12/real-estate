import { listings, listingTypeEnum } from "@my-better-t-app/db/schema";
import { and, asc, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

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
        limit: z.number().default(20),
        cursor: z.number().default(0), // Simple offset for now
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

      return items;
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
      const [newItem] = await context.db
        .insert(listings)
        .values({
          ...input,
          ownerId: context.session.user.id,
          status: "published", // Auto-publish for MVP
        })
        .returning();
      return newItem;
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
      return item;
    }),
};
