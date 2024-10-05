import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import ThemeRegistry from "./_components/ThemeRegistry";

export const metadata: Metadata = {
  title: "InvoiceStack",
  description: "Pay Invoices with Paystack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <ThemeRegistry options={{ key: "joy" }}>{children}</ThemeRegistry>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
