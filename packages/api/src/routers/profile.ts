import { user, userRoleEnum } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../index";

export const profileRouter = {
  setRole: protectedProcedure
    .input(
      z.object({
        role: z.enum(userRoleEnum.enumValues),
      }),
    )
    .handler(async ({ context, input }) => {
      const [updatedUser] = await context.db
        .update(user)
        .set({ role: input.role })
        .where(eq(user.id, context.session.user.id))
        .returning({
          id: user.id,
          role: user.role,
        });

      if (!updatedUser) {
        throw new Error("Unable to update user role");
      }

      return updatedUser;
    }),
};
