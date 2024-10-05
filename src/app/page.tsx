import { Button, Typography } from "@mui/joy";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <section className="flex h-screen flex-col items-center justify-center">
        <Typography level="h1" sx={{ color: "primary.500" }}>
          InvoiceStack
        </Typography>
        <Typography level="title-lg">Simplified Invoice Payments</Typography>
        <div className="mt-4 flex gap-3">
          <Link href="/invoices/new">
            <Button>Get Started</Button>
          </Link>
          <Link href="/invoices/list">
            <Button color="neutral" variant="outlined">
              My Invoices
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
