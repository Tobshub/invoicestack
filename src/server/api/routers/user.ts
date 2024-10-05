import { adminAuth } from "@/firebase/admin";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";

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
});
