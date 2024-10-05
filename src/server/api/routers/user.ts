import { adminAuth } from "@/firebase/admin";
import { authenticatedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  createProfile: authenticatedProcedure.mutation(async ({ ctx }) => {
    try {
      await ctx.db.user.create({
        data: { firebaseUid: ctx.firebaseUid },
      });
    } catch (e) {
      console.error(e);
      await adminAuth().deleteUser(ctx.firebaseUid);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  getContactData: publicProcedure.input(z.string()).query(async ({ input }) => {
    const user = await adminAuth().getUser(input);
    return {
      name: user.displayName,
      email: user.email,
    }
  })
});
