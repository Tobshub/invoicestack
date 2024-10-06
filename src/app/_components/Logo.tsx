"use client";
import Typography from "@mui/joy/Typography";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();
  return (
    <Typography
      onClick={() => router.push("/")}
      level="h1"
      sx={{ color: "primary.500", cursor: "pointer" }}
    >
      InvoiceStack
    </Typography>
  );
}
