import { env } from "@/env";
import axios from "axios";

export const axiosBase = axios.create({
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
) {
  const res = await axiosBase.post<InitTx>("/transaction/initialize", {
    amount,
    email,
    metadata,
    currency: "NGN",
  });
  if (!res.data.status)
    throw new Error(`Failed to initialize Paystack Transaction: ${res.data.message}`);
  return {
    amount: amount,
    txRef: res.data.data.reference,
    txUrl: res.data.data.authorization_url,
    accessCode: res.data.data.access_code,
  };
}

export async function getBanks() {
  const res = await axiosBase.get("/bank", { params: { country: "nigeria", currency: "NGN" } });
  return res.data as {
    status: boolean;
    message: string;
    data: { id: number; name: string; code: string }[];
  };
}

interface CreateTransferRecipient {
  status: boolean;
  message: string;
  data: {
    recipient_code: string;
  };
}

export async function createTransferRecipient(name: string, bankCode: string, nuban: string) {
  const res = await axiosBase.post<CreateTransferRecipient>("/transferrecipient", {
    name,
    type: "nuban",
    bank_code: bankCode,
    currency: "NGN",
    account_number: nuban,
  });

  if (!res.data.status)
    throw new Error(`Failed to create Paystack Transfer Recipient: ${res.data.message}`);
  return res.data.data;
}

interface Transfer {
  status: boolean;
  message: string;
  data: {
    transfer_code: string;
  };
}
export async function transfer(amount: number, recipient: string) {
  const res = await axiosBase.post<Transfer>("/transfer", {
    source: "balance",
    amount,
    recipient,
    reason: "Invoice Payout",
    currency: "NGN",
  });
  return res.data.data;
}

export async function finalizeTransfer(transferCode: string) {
  const res = await axiosBase.post("/transfer/finalize_transfer", {
    transfer_code: transferCode,
  });
  return res.data.data;
}
