import { auth } from "@my-better-t-app/auth";
import { db } from "@my-better-t-app/db";
import { user } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: new Headers(context.req.header()), //context.req.raw.headers,
  });

  let userRole: "renter" | "landlord" | null = null;
  if (session?.user?.id) {
    try {
      const dbUser = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
        columns: {
          role: true,
        },
      });

      userRole = dbUser?.role ?? "renter";
    } catch {
      userRole = "renter";
    }
  }

  return {
    session,
    userRole,
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
