import { z } from "zod";
import { authenticatedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const invoiceRouter = createTRPCRouter({
  create: authenticatedProcedure
    .input(z.object({ name: z.string(), data: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.db.invoice.create({
          data: {
            userId: ctx.firebaseUid,
            name: input.name,
            data: input.data,
            status: "PENDING",
          },
        });
        return invoice.id;
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
        });
      }
    }),
  list: authenticatedProcedure.query(async ({ ctx }) => {
    return ctx.db.invoice.findMany({
      where: { userId: ctx.firebaseUid },
      select: { name: true, status: true, id: true },
    });
  }),
  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.invoice.findUnique({
      where: { id: input },
      select: { name: true, status: true, data: true, userId: true },
    });
  })
});
