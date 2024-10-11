import { getBanks } from "@/server/utils/paystack";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const paystackRouter = createTRPCRouter({
  listBanks: publicProcedure.query(async () => {
    const banks = await getBanks();
    return banks;
  })
})
