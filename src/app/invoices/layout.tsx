"use client";

import { firebaseAuth } from "@/firebase/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InvoicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    void firebaseAuth()
      .authStateReady()
      .then(() => {
        if (!pathName.startsWith("/invoices/view") && !firebaseAuth().currentUser)
          router.replace(`/login?${pathName ? `redirect=${encodeURIComponent(pathName)}` : ""}`);
      });
  }, [router, pathName]);

  return <>{children}</>;
}
