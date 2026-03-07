import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";

import { inquiryRouter } from "./inquiries";
import { listingRouter } from "./listings";
import { profileRouter } from "./profile";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
      role: context.userRole,
    };
  }),
  listings: listingRouter,
  inquiries: inquiryRouter,
  profile: profileRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
