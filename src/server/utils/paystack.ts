import { env } from "@/env";
import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://api.paystack.co",
  headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET}`, "Content-Type": "application/json" },
});

interface InitTx {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initPaystackTransaction(
  amount: string,
  email: string,
  metadata: Record<string, string>
): Promise<{ txRef: string; txUrl: string }> {
  const res = await axiosBase.post<InitTx>("/transaction/initialize", {
    amount,
    email,
    metadata,
    currency: "NGN",
  });
  if (!res.data.status) throw new Error(`Failed to initialize Paystack Transaction: ${res.data.message}`);
  return { txRef: res.data.data.reference, txUrl: res.data.data.authorization_url };
}
