"use client";
import Logo from "@/app/_components/Logo";
import { api } from "@/trpc/react";
import { Button, Typography } from "@mui/joy";
import Link from "next/link";

export default function ListInvoicesPage() {
  const invoices = api.invoice.list.useQuery();
  return (
  <>
      <header>
        <nav className="mx-auto max-w-screen-xl py-4 flex items-center justify-between">
          <Logo />
          <Link href="/invoices/new">
            <Button>
              New Invoice
            </Button>
          </Link>
        </nav>
      </header>
    <main className="mx-auto max-w-screen-xl">
      <Typography level="title-lg">My Invoices</Typography>
      <ul>
        {invoices.data?.map((invoice) => (
          <li key={invoice.id}>
            <Link href={`/invoices/view/${invoice.id}`}>{invoice.name}</Link>
          </li>
        ))}
      </ul>
    </main>
    </>
  )
}
