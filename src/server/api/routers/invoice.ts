import { z } from "zod";
import { authenticatedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { initPaystackTransaction } from "@/server/utils/paystack";
import type { Invoice } from "@/types";

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
  }),
  initPayment: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        invoiceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.db.invoice.findUnique({ where: { id: input.invoiceId } });
        if (!invoice) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
        }

        if (invoice.status === "PAID") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Invoice already paid" });
        }

        // convert total to subunit
        const invoiceTotal =
          parseFloat(
            (JSON.parse(invoice.data as string) as Invoice).items
              .reduce((a, b) => a + b.rate * b.quantity, 0)
              .toFixed(2)
          ) * 100;

        const payment = await initPaystackTransaction(invoiceTotal.toString(), input.email, input);
        await ctx.db.invoicePayment.create({
          data: {
            txRef: payment.txRef,
            status: "PENDING",
            email: input.email,
            invoiceId: input.invoiceId,
            amount: invoiceTotal,
          },
        });

        console.log(`New Transaction Initialized: ${payment.txRef}`);
        return payment;
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later.",
        });
      }
    }),
});
