"use client";
import FormInput from "@/app/_components/Input";
import Logo from "@/app/_components/Logo";
import { firebaseAuth } from "@/firebase/client";
import { Button, Snackbar } from "@mui/joy";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Please enter your password"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const formErrors = validation.error.format();
      for (const errorKey in formErrors) {
        type T = keyof typeof formErrors;
        const error = formErrors[errorKey as unknown as T];
        if (!error || Array.isArray(error)) continue;
        setErrors((state) => ({ ...state, [errorKey]: error._errors.at(-1)! }));
      }
      return;
    }

    try {
      await signInWithEmailAndPassword(
        firebaseAuth(),
        validation.data.email,
        validation.data.password
      );
      router.push(
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        decodeURIComponent(searchParams.get("redirect") || "/invoices/list") // using || here to catch empty strings
      );
    } catch (e) {
      console.error(e);
      if (e instanceof FirebaseError && e.code === "auth/invalid-credential") {
        setErrors((state) => ({ ...state, toast: "Invalid email or password" }));
        return;
      }
      setErrors((state) => ({ ...state, toast: "Something went wrong! Please try again later." }));
    }
  };

  return (
    <main>
      <Snackbar
        size="lg"
        color="danger"
        open={!!errors.toast}
        onClose={() => setErrors((state) => ({ ...state, toast: "" }))}
        endDecorator={
          <Button
            onClick={() => setErrors((state) => ({ ...state, toast: "" }))}
            size="sm"
            variant="soft"
            color="danger"
          >
            Dismiss
          </Button>
        }
      >
        {errors.toast}
      </Snackbar>
      <section className="flex h-screen flex-col items-center justify-center">
        <Logo />
        <form
          onSubmit={handleSubmit}
          onInputCapture={(e) => {
            if ("name" in e.target) {
              const inputName = e.target.name as string;
              if (errors[inputName]) setErrors((prev) => ({ ...prev, [inputName]: "" }));
            }
          }}
          className="mt-5 flex w-[500px] flex-col gap-5"
        >
          <FormInput
            label="Email"
            placeholder="user@invoicestack.com"
            name="email"
            type="email"
            error={errors.email}
          />
          <FormInput
            label="Password"
            placeholder="********"
            name="password"
            type="password"
            error={errors.password}
          />
          <Button type="submit">Login</Button>
        </form>
        <span className="mt-4">
          Don&apos;t have an account? <Link href="/register" className="text-blue-600">Register</Link>
        </span>
      </section>
    </main>
  );
}
