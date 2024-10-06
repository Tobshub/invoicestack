"use client";
import FormInput from "@/app/_components/Input";
import Logo from "@/app/_components/Logo";
import { firebaseAuth } from "@/firebase/client";
import { api } from "@/trpc/react";
import { Button, Snackbar } from "@mui/joy";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
  type User,
} from "firebase/auth";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const registerSchema = z
  .strictObject({
    firstName: z
      .string()
      .min(1, "Please enter your first name")
      .min(3, "First name is too short")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Please enter your last name")
      .min(3, "Last name is too short")
      .max(50, "Last name is too long"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(1, "Please enter your password")
      .min(8, "Password is too short")
      .max(32, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createProfileMut = api.user.createProfile.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const validation = registerSchema.safeParse(formData);
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

    setIsLoading(true);
    let user: User | null = null;
    try {
      ({ user } = await createUserWithEmailAndPassword(
        firebaseAuth(),
        validation.data.email,
        validation.data.password
      ));
      await updateProfile(user, {
        displayName: `${validation.data.firstName} ${validation.data.lastName}`,
      });
      await createProfileMut.mutateAsync();
      router.push(
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        decodeURIComponent(searchParams.get("redirect") || "/invoices/new") // using || here to catch empty strings
      );
    } catch (e) {
      console.error(e);
      if (user) await deleteUser(user);
      setIsLoading(false);
      if (e instanceof FirebaseError && e.code === "auth/email-already-in-use") {
        setErrors((state) => ({ ...state, email: "Email already in use" }));
        return;
      }
      setErrors((state) => ({ ...state, toast: "Something went wrong! Please try again later." }));
    } finally {
      setIsLoading(false);
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
              if (inputName === "password" && errors.confirmPassword)
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }
          }}
          className="mt-5 flex w-[500px] flex-col gap-5"
        >
          <FormInput
            label="First Name"
            placeholder="John"
            name="firstName"
            type="text"
            error={errors.firstName}
          />
          <FormInput
            label="Last Name"
            placeholder="Does"
            name="lastName"
            type="text"
            error={errors.lastName}
          />
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
          <FormInput
            label="Confirm Password"
            placeholder="********"
            name="confirmPassword"
            type="password"
            error={errors.confirmPassword}
          />
          <Button disabled={isLoading} type="submit">
            Register
          </Button>
        </form>
        <span className="mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </section>
    </main>
  );
}
