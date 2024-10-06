import { env } from "@/env";
import { db } from "@/server/db";
import crypto from "crypto";
import type { NextRequest } from "next/server";

type PaystackEvent = {
  event: string;
  data: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as PaystackEvent;
  const hash = crypto
    .createHmac("sha512", env.PAYSTACK_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");
  if (hash !== req.headers.get("x-paystack-signature")) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log(`Received webhook event from Paystack: ${body.event}`);

  if (body.event === "charge.success") {
    if (body.data.status === "success") {
      const metadata = body.data.metadata as Record<string, string>;
      await db.invoicePayment.update({
        where: { txRef: body.data.reference as string },
        data: { status: "SUCCESS" },
      });
      await db.invoice.update({ where: { id: metadata.invoiceId }, data: { status: "PAID" } })
    }
  }

  return Response.json({ message: "Received" }, { status: 200 });
}
