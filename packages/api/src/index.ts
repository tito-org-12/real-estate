import { ORPCError, os } from "@orpc/server";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  if (!context.userRole) {
    throw new ORPCError("FORBIDDEN", {
      message: "User role is not configured",
    });
  }

  return next({
    context: {
      ...context,
      session: context.session,
      userRole: context.userRole,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);
