"use client";
import FormInput from "@/app/_components/Input";
import FormTextArea from "@/app/_components/Textarea";
import { Button, Snackbar, Typography } from "@mui/joy";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "@/trpc/react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Logo from "@/app/_components/Logo";

interface InvoiceItem {
  name: string;
  quantity: number;
  rate: number;
}

interface Invoice {
  id: string;
  from: string;
  billTo: string;
  shipTo: string;
  date: Date;
  dueDate: Date | null;
  items: Array<InvoiceItem>;
  notes: string;
}

const DefaultInvoice: Invoice = {
  id: "1",
  from: "",
  billTo: "",
  shipTo: "",
  date: new Date(),
  dueDate: null,
  items: [],
  notes: "",
};

const invoiceSchema = z.strictObject({
  id: z.string().min(1, "Invoice ID is required").max(32, "Invoice ID is too long"),
  from: z.string().min(1, "Bill From is required").max(200, "Bill From is too long"),
  billTo: z.string().min(1).min(1, "Bill To is required").max(200, "Bill To is too long"),
  shipTo: z.string().optional(),
  date: z.date(),
  dueDate: z.date().nullable(),
  items: z
    .array(
      z.strictObject({
        name: z.string(),
        quantity: z.number(),
        rate: z.number(),
      })
    )
    .min(1, "At least one item is required")
    .max(100, "Too many items"),
  notes: z.string().optional(),
});

export default function NewInvoicePage() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice>(DefaultInvoice);
  const [errors, setErrors] = useState<Partial<Record<keyof Invoice | "toast", string>>>({});

  const handleInputChange = <const T extends keyof Invoice>(key: T, value: Invoice[T]) => {
    if (errors[key]) setErrors((state) => ({ ...state, [key]: "" }));
    setInvoice((state) => ({ ...state, [key]: value }));
  };

  const handleEditItem = (idx: number, data: InvoiceItem) => {
    setInvoice((state) => {
      state.items[idx] = data;
      return { ...state, items: state.items };
    });
  };

  const createInvoiceMut = api.invoice.create.useMutation({
    onSuccess: (invoiceId) => {
      router.push(`/invoices/view/${invoiceId}`);
    },
    onError: (e) => {
      console.error(e);
      setErrors((state) => ({ ...state, toast: e.message }));
    },
  });

  const handleSubmit = async () => {
    const validation = invoiceSchema.safeParse(invoice);
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
    createInvoiceMut.mutate({
      name: `Invoice ${invoice.id}`,
      data: JSON.stringify(invoice),
    });
  };

  return (
    <main className="min-h-screen pt-8">
      <Snackbar
        size="lg"
        color="danger"
        open={!!errors.items}
        onClose={() => setErrors((state) => ({ ...state, items: "" }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        endDecorator={
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setErrors((state) => ({ ...state, items: "" }))}
          />
        }
      >
        {errors.items}
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
      <section className="mx-auto max-w-screen-xl">
        <Logo />
        <Typography level="title-lg">
          Create a new invoice with InvoiceStack and easily get paid for your work
        </Typography>
      </section>
      <section className="my-10 w-full bg-gray-100 py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
          className="elevated mx-auto flex min-h-[500px] max-w-screen-xl flex-col gap-4 rounded-sm bg-white px-4 py-4"
        >
          <div className="flex flex-col items-end gap-4">
            <h1 className="text-5xl font-extralight">INVOICE</h1>
            <FormInput
              endDecorator="#"
              name="id"
              sx={{ direction: "rtl", width: 200 }}
              value={invoice.id}
              onChange={(e) => handleInputChange("id", e.target.value)}
              error={errors.id}
            />
          </div>
          <div className="flex flex-row items-end justify-between">
            <div>
              <FormTextArea
                minRows={2}
                sx={{ width: 500 }}
                placeholder="Who is this from?"
                value={invoice.from}
                onChange={(e) => handleInputChange("from", e.target.value)}
                error={errors.from}
              />
              <div className="mt-8 flex flex-row gap-4">
                <FormTextArea
                  label="Bill To"
                  minRows={2}
                  sx={{ minWidth: 300 }}
                  placeholder="Who is this to?"
                  value={invoice.billTo}
                  onChange={(e) => handleInputChange("billTo", e.target.value)}
                  error={errors.billTo}
                />
                <FormTextArea
                  label="Ship To"
                  minRows={2}
                  sx={{ minWidth: 300 }}
                  placeholder="(optional)"
                  value={invoice.shipTo}
                  onChange={(e) => handleInputChange("shipTo", e.target.value)}
                  error={errors.shipTo}
                />
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <FormInput
                label="Date"
                horizontal
                sx={{ width: 200 }}
                value={invoice.date.toISOString().split("T")[0]}
                onChange={(e) => handleInputChange("date", new Date(e.target.value))}
                type="date"
                error={errors.date}
              />
              <FormInput
                label="Due Date"
                horizontal
                sx={{ width: 200 }}
                value={invoice.dueDate?.toISOString().split("T")[0]}
                onChange={(e) => handleInputChange("dueDate", new Date(e.target.value))}
                type="date"
                error={errors.dueDate}
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
              <div key={idx} className="my-1 flex flex-row items-center justify-start gap-2">
                <FormInput
                  controlSx={{ width: "60%" }}
                  placeholder="Description of item/service..."
                  value={item.name}
                  onChange={(e) => handleEditItem(idx, { ...item, name: e.target.value })}
                />
                <FormInput
                  controlSx={{ width: "13%" }}
                  type="number"
                  value={item.quantity || ""}
                  onChange={(e) =>
                    handleEditItem(idx, { ...item, quantity: Number(e.target.value) })
                  }
                />
                <FormInput
                  controlSx={{ width: "15%" }}
                  type="number"
                  startDecorator="N"
                  value={item.rate || ""}
                  onChange={(e) => handleEditItem(idx, { ...item, rate: Number(e.target.value) })}
                />
                <span className="w-[10%] text-center">
                  N {(item.rate * item.quantity).toLocaleString("en-GB").split(".")[0]}.
                  {(item.rate * item.quantity).toFixed(2).split(".")[1]}
                </span>
              </div>
            ))}
            <Button
              variant="outlined"
              sx={{ gap: 1, my: 2 }}
              onClick={() =>
                setInvoice((state) => ({
                  ...state,
                  items: [...state.items, { name: "", quantity: 0, rate: 0 }],
                }))
              }
            >
              <AddIcon />
              New Item
            </Button>
          </div>
          <div className="flex flex-row items-start justify-between">
            <FormTextArea
              label="Notes"
              minRows={2}
              placeholder="Notes - any relevant information not already covered"
              sx={{ width: 600 }}
              value={invoice.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              error={errors.notes}
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
          <Button type="submit">Create Invoice</Button>
        </form>
      </section>
    </main>
  );
}
