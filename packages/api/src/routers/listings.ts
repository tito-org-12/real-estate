import { listings, listingTypeEnum } from "@my-better-t-app/db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

export const listingRouter = {
	list: publicProcedure
		.input(
			z.object({
				type: z.enum(listingTypeEnum.enumValues).optional(),
				minPrice: z.number().optional(),
				maxPrice: z.number().optional(),
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
			if (input.minPrice) {
				filters.push(gte(listings.price, input.minPrice));
			}
			if (input.maxPrice) {
				filters.push(lte(listings.price, input.maxPrice));
			}

			const items = await context.db.query.listings.findMany({
				where: and(...filters),
				limit: input.limit,
				offset: input.cursor,
				orderBy: desc(listings.createdAt),
			});

			return items;
		}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				price: z.number().int().positive(),
				type: z.enum(listingTypeEnum.enumValues),
				description: z.string().optional(),
				location: z.string().optional(),
				meta: z.record(z.string(), z.any()),
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
				where: eq(listings.id, input.id),
				with: {
					owner: true,
				},
			});
			return item;
		}),
};
