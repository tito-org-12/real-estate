import { inquiries, listings } from "@my-better-t-app/db/schema";
import { and, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { publicProcedure } from "../index";

export const inquiryRouter = {
  create: publicProcedure
    .input(
      z.object({
        listingId: z.string(),
        name: z.string().min(2).max(120),
        email: z.email(),
        message: z.string().min(10).max(2_000),
      }),
    )
    .handler(async ({ context, input }) => {
      const listing = await context.db.query.listings.findFirst({
        where: and(
          eq(listings.id, input.listingId),
          eq(listings.status, "published"),
        ),
        columns: {
          id: true,
        },
      });

      if (!listing) {
        throw new ORPCError("NOT_FOUND", {
          message: "Listing is not available",
        });
      }

      const [newInquiry] = await context.db
        .insert(inquiries)
        .values({
          listingId: input.listingId,
          name: input.name,
          email: input.email,
          message: input.message,
          userId: context.session?.user?.id ?? null,
        })
        .returning({
          id: inquiries.id,
          listingId: inquiries.listingId,
          createdAt: inquiries.createdAt,
        });

      return newInquiry;
    }),
};
