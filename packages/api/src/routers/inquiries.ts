import { inquiries, listings } from "@my-better-t-app/db/schema";
import { and, eq, desc, or } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../index";

export const inquiryRouter = {
  create: publicProcedure
    .input(
      z.object({
        listingId: z.string(),
        name: z.string().min(2).max(120).optional(),
        email: z.email().optional(),
        phone: z.string().max(30).optional(),
        message: z.string().min(10).max(2_000).optional(),
        channel: z.enum(["form", "whatsapp", "call"]).default("form"),
      }).refine(
        (d) => d.channel !== "form" || (d.name && d.email && d.message),
        { message: "name, email, and message are required for form inquiries" }
      ),
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
          name: input.name ?? null,
          email: input.email ?? null,
          phone: input.phone ?? null,
          message: input.message ?? null,
          channel: input.channel,
          status: "new",
          userId: context.session?.user?.id ?? null,
        })
        .returning({
          id: inquiries.id,
          listingId: inquiries.listingId,
          channel: inquiries.channel,
          createdAt: inquiries.createdAt,
        });

      return newInquiry;
    }),

  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(["new", "responded", "archived"]).optional(),
        listingId: z.string().optional(),
        limit: z.number().int().positive().default(50),
        offset: z.number().int().nonnegative().default(0),
      }),
    )
    .handler(async ({ context, input }) => {
      // Get all inquiries for listings owned by the current user
      const ownerListings = await context.db.query.listings.findMany({
        where: eq(listings.ownerId, context.session.user.id),
        columns: {
          id: true,
          title: true,
        },
      });

      const listingIds = ownerListings.map((l) => l.id);
      if (listingIds.length === 0) {
        return { inquiries: [], total: 0 };
      }

      const listingMap = Object.fromEntries(
        ownerListings.map((l) => [l.id, l.title])
      );

      // Build query conditions - inquiries must belong to owner's listings
      const conditions: any[] = [];

      // Match inquiries from any of the owner's listings
      if (listingIds.length === 1) {
        conditions.push(eq(inquiries.listingId, listingIds[0]));
      } else {
        conditions.push(or(...listingIds.map((id) => eq(inquiries.listingId, id))));
      }

      // Optional filters
      if (input.status) {
        conditions.push(eq(inquiries.status, input.status));
      }
      if (input.listingId) {
        conditions.push(eq(inquiries.listingId, input.listingId));
      }

      const results = await context.db
        .select()
        .from(inquiries)
        .where(and(...conditions))
        .orderBy(desc(inquiries.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        inquiries: results.map((inq) => ({
          ...inq,
          listingTitle: listingMap[inq.listingId] || "Unknown",
        })),
        total: results.length,
      };
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        inquiryId: z.string(),
        status: z.enum(["new", "responded", "archived"]),
      }),
    )
    .handler(async ({ context, input }) => {
      // Load inquiry with its listing to verify ownership
      const inquiry = await context.db.query.inquiries.findFirst({
        where: eq(inquiries.id, input.inquiryId),
        with: {
          listing: {
            columns: {
              ownerId: true,
              id: true,
              title: true,
            },
          },
        },
      });

      if (!inquiry) {
        throw new ORPCError("NOT_FOUND", {
          message: "Inquiry not found",
        });
      }

      if (inquiry.listing.ownerId !== context.session.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message: "You do not have permission to update this inquiry",
        });
      }

      // Only set respondedAt on first transition to "responded"
      const respondedAt =
        input.status === "responded" && inquiry.respondedAt === null
          ? new Date()
          : inquiry.respondedAt;

      const [updated] = await context.db
        .update(inquiries)
        .set({
          status: input.status,
          respondedAt,
        })
        .where(eq(inquiries.id, input.inquiryId))
        .returning();

      return {
        ...updated,
        listingTitle: inquiry.listing.title,
      };
    }),
};
