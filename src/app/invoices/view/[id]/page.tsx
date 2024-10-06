"use client";
import FormInput from "@/app/_components/Input";
import Logo from "@/app/_components/Logo";
import FormTextArea from "@/app/_components/Textarea";
import { api } from "@/trpc/react";
import {
  Button,
  Chip,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Skeleton,
  Snackbar,
  Typography,
} from "@mui/joy";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Invoice } from "@/types";
import { firebaseAuth } from "@/firebase/client";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import ClipboardIcon from "@mui/icons-material/ContentPaste";
import ClipboardCheckedIcon from "@mui/icons-material/AssignmentTurnedIn";
import PaymentIcon from "@mui/icons-material/Payment";
import Image from "next/image";
import paystackSvg from "@/assets/paystack.svg";
import { z } from "zod";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import PaystackPop from "@paystack/inline-js";
import { env } from "@/env";

function InvoiceSkeleton() {
  return (
    <main className="min-h-screen pt-8">
      <section className="mx-auto max-w-screen-xl">
        <Logo />
      </section>
      <section className="my-10 w-full bg-gray-100 py-8">
        <div className="elevated mx-auto flex min-h-[500px] max-w-screen-xl flex-col gap-4 rounded-sm bg-white px-4 py-4">
          <div className="flex flex-col items-end gap-4">
            <h1 className="text-5xl font-extralight">INVOICE</h1>
            <Skeleton variant="text" sx={{ width: 200 }} />
          </div>
          <div className="flex flex-row items-end justify-between">
            <div>
              <Skeleton variant="rectangular" sx={{ width: 500, height: 150 }} />
              <div className="mt-8 flex flex-row gap-4">
                <Skeleton variant="rectangular" sx={{ width: 300, height: 150 }} />
                <Skeleton variant="rectangular" sx={{ width: 300, height: 150 }} />
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton variant="text" sx={{ width: 200 }} />
              <Skeleton variant="text" sx={{ width: 200 }} />
            </div>
          </div>
          <div>
            <Skeleton variant="text" sx={{ width: "100%" }} />
          </div>
          <div className="flex flex-row items-start justify-between">
            <Skeleton variant="rectangular" sx={{ width: 600, height: 100 }} />
            <div className="flex flex-row items-center gap-10">
              <Skeleton variant="text" sx={{ width: 250 }} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface ShareInvoiceModalProps {
  open: boolean;
  close: () => void;
}

function ShareInvoiceModal(props: ShareInvoiceModalProps) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => {
        setHasCopied(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [hasCopied]);

  return (
    <Modal open={props.open} onClose={props.close}>
      <ModalDialog>
        <ModalClose />
        <Typography level="title-lg">Share Invoice</Typography>

        <Sheet>
          <Typography sx={{ mb: 1 }}>
            Copy and share the link to this invoice to get paid.
          </Typography>
          <Button
            startDecorator={hasCopied ? <ClipboardCheckedIcon /> : <ClipboardIcon />}
            onClick={() => {
              setHasCopied(true);
              void navigator.clipboard.writeText(window.location.href);
            }}
            color={hasCopied ? "success" : "primary"}
          >
            Copy Link
          </Button>
        </Sheet>
      </ModalDialog>
    </Modal>
  );
}

export default function ViewInvoicePage({ params }: { params: { id: string } }) {
  const invoiceQuery = api.invoice.get.useQuery(params.id);
  const invoice = useMemo(
    () =>
      invoiceQuery.data?.data ? (JSON.parse(invoiceQuery.data.data as string) as Invoice) : null,
    [invoiceQuery.data?.data]
  );
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  if (invoiceQuery.isLoading) {
    return <InvoiceSkeleton />;
  }

  if (!invoiceQuery.data || !invoice) {
    return (
      <main className="min-h-screen pt-8">
        <section className="mx-auto max-w-screen-xl">
          <Logo />
          <Typography level="title-lg">Invoice not found</Typography>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-8">
      <ShareInvoiceModal open={shareModalOpen} close={() => setShareModalOpen(false)} />
      <section className="mx-auto max-w-screen-xl">
        <Logo />
        {firebaseAuth().currentUser?.uid === invoiceQuery.data.userId &&
        invoiceQuery.data.status === "PENDING" ? (
          <>
            <Typography level="title-lg">Share this invoice to get paid for your work</Typography>
            <Button
              sx={{ mt: 1 }}
              onClick={() => setShareModalOpen(true)}
              startDecorator={<ShareIcon />}
            >
              Share Invoice
            </Button>
          </>
        ) : (
          <Chip
            size="lg"
            color={
              invoiceQuery.data.status === "PAID"
                ? "success"
                : invoiceQuery.data.status === "PENDING"
                  ? "warning"
                  : "danger"
            }
          >
            {invoiceQuery.data.status}
          </Chip>
        )}
      </section>
      <section className="my-10 w-full bg-gray-100 py-8">
        <div className="elevated mx-auto flex min-h-[500px] max-w-screen-xl flex-col gap-4 rounded-sm bg-white px-4 py-4">
          <div className="flex flex-col items-end gap-4">
            <h1 className="text-5xl font-extralight">INVOICE</h1>
            <FormInput
              endDecorator="#"
              name="id"
              sx={{ direction: "rtl", width: 200 }}
              value={invoice.id}
              readOnly
            />
          </div>
          <div className="flex flex-row items-end justify-between">
            <div>
              <FormTextArea
                minRows={2}
                sx={{ width: 500 }}
                placeholder="Who is this from?"
                value={invoice.from}
                readOnly
              />
              <div className="mt-8 flex flex-row gap-4">
                <FormTextArea
                  label="Bill To"
                  minRows={2}
                  sx={{ minWidth: 300 }}
                  placeholder="Who is this to?"
                  value={invoice.billTo}
                  readOnly
                />
                <FormTextArea
                  label="Ship To"
                  minRows={2}
                  sx={{ minWidth: 300 }}
                  placeholder="(optional)"
                  value={invoice.shipTo}
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <FormInput
                label="Date"
                horizontal
                sx={{ width: 200 }}
                value={new Date(invoice.date).toISOString().split("T")[0]}
                type="date"
                readOnly
              />
              <FormInput
                label="Due Date"
                horizontal
                sx={{ width: 200 }}
                value={
                  invoice.dueDate
                    ? new Date(invoice.dueDate).toISOString().split("T")[0]
                    : undefined
                }
                type="date"
                readOnly
              />
            </div>
          </div>
          <div>
            <div className="flex flex-row justify-between rounded-sm bg-gray-200 px-2 py-1">
              <h2 className="w-[60%]">Items</h2>
              <h2>Quantity</h2>
              <h2>Rate</h2>
              <h2>Amount</h2>
            </div>
            {invoice.items.map((item, idx) => (
              <div
                key={idx}
                className="group relative my-1 flex flex-row items-center justify-start gap-2"
              >
                <FormInput
                  controlSx={{ width: "60%" }}
                  placeholder="Description of item/service..."
                  value={item.name}
                  readOnly
                />
                <FormInput
                  controlSx={{ width: "13%" }}
                  type="number"
                  value={item.quantity || ""}
                  readOnly
                />
                <FormInput
                  controlSx={{ width: "15%" }}
                  type="number"
                  startDecorator="N"
                  value={item.rate || ""}
                  readOnly
                />
                <span className="w-[10%] text-center">
                  N {(item.rate * item.quantity).toLocaleString("en-GB").split(".")[0]}.
                  {(item.rate * item.quantity).toFixed(2).split(".")[1]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-row items-start justify-between">
            <FormTextArea
              label="Notes"
              minRows={2}
              placeholder="Notes - any relevant information not already covered"
              sx={{ width: 600 }}
              value={invoice.notes}
              readOnly
            />
            <div className="flex flex-row items-center gap-10">
              Total
              <span>
                NGN
                {
                  invoice.items
                    .reduce((a, b) => a + b.rate * b.quantity, 0)
                    .toLocaleString("en-GB")
                    .split(".")[0]
                }
                .
                {
                  invoice.items
                    .reduce((a, b) => a + b.rate * b.quantity, 0)
                    .toFixed(2)
                    .split(".")[1]
                }
              </span>
            </div>
          </div>
        </div>
        {firebaseAuth().currentUser?.uid !== invoiceQuery.data.userId &&
        invoiceQuery.data.status === "PENDING" ? (
          <div className="mx-auto my-3 flex max-w-screen-xl justify-end">
            {showPaymentForm ? (
              <Button
                size="lg"
                onClick={() => setShowPaymentForm(false)}
                color="danger"
                variant="soft"
              >
                Cancel
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setShowPaymentForm(true)}
                startDecorator={<PaymentIcon />}
              >
                Pay Invoice
              </Button>
            )}
          </div>
        ) : null}
      </section>
      {showPaymentForm && (
        <section className="mx-auto max-w-screen-xl">
          <InvoicePaymentForm invoiceId={params.id} />
        </section>
      )}
    </main>
  );
}

const invoicePaymentSchema = z.strictObject({
  invoiceId: z.string(),
  email: z.string().email(),
  name: z.string().min(1, "Full name is required"),
});

function InvoicePaymentForm(props: { invoiceId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string>("");
  const paystackInstance = useMemo(
    () =>
      new PaystackPop({
        onCancel: () => {
          console.log("DEEZ NUTS");
        },
      }),
    []
  );
  const initPaymentMut = api.invoice.initPayment.useMutation();

  useEffect(() => {
    if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const validation = invoicePaymentSchema.safeParse(formData);
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

    const payment = await initPaymentMut.mutateAsync(validation.data);
    paystackInstance.newTransaction({
      key: env.NEXT_PUBLIC_PAYSTACK_KEY,
      reference: payment.txRef,
      amount: payment.amount,
      email: validation.data.email,
      onError: (e) => {
        console.error("PaystackPop Error::", e);
        setErrors(state => ({ ...state, toast: "An error occurred. Please try again later." }));
      },
      onSuccess: () => {
        setNotification("Payment successful. Please check your email for details.");
      }
    });
  };

  return (
    <>
      <Snackbar
        size="lg"
        color="success"
        variant="outlined"
        open={!!notification}
        onClose={() => setNotification("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        endDecorator={
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setErrors((state) => ({ ...state, items: "" }))}
          />
        }
      >
        {notification}
      </Snackbar>
      <Snackbar
        size="lg"
        color="danger"
        open={!!errors.toast}
        onClose={() => setErrors((state) => ({ ...state, toast: "" }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        endDecorator={
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setErrors((state) => ({ ...state, toast: "" }))}
          />
        }
      >
        {errors.toast}
      </Snackbar>
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onInputCapture={(e) => {
        if ("name" in e.target) {
          const inputName = e.target.name as string;
          if (errors[inputName as keyof Invoice])
            setErrors((prev) => ({ ...prev, [inputName]: "" }));
        }
      }}
      className="mb-32 flex flex-col items-center gap-4"
    >
      <FormInput
        label="Full Name"
        name="name"
        placeholder="John Doe"
        error={errors.name}
        type="text"
        sx={{ width: 600 }}
      />
      <FormInput
        label="Email"
        name="email"
        placeholder="user@invoicestack.com"
        error={errors.email}
        type="email"
        sx={{ width: 600 }}
      />
      <input hidden name="invoiceId" value={props.invoiceId} readOnly />
      <Button
        type="submit"
        sx={{ width: 600 }}
        startDecorator={
          <Image src={paystackSvg as StaticImport} alt="Paystack Logo" width={20} height={20} />
        }
      >
        Pay with Paystack
      </Button>
    </form>
    </>
  );
}
