"use client";
import FormInput from "@/app/_components/Input";
import FormTextArea from "@/app/_components/Textarea";
import { Button, Input, Textarea, Typography } from "@mui/joy";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";

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

export default function NewInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice>(DefaultInvoice);

  const handleInputChange = <const T extends keyof Invoice>(key: T, value: Invoice[T]) => {
    setInvoice((state) => ({ ...state, [key]: value }));
  };

  const handleEditItem = (idx: number, data: InvoiceItem) => {
    setInvoice((state) => {
      state.items[idx] = data;
      return { ...state, items: state.items };
    });
  };

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-screen-xl">
        <Typography level="h1" sx={{ color: "primary.500" }}>
          InvoiceStack
        </Typography>
        <Typography level="title-lg">
          Create a new invoice with InvoiceStack and easily get paid for your work
        </Typography>
      </section>
      <section className="my-10 w-full bg-gray-100">
        <form className="mx-auto flex min-h-[500px] max-w-screen-xl flex-col gap-4 py-4">
          <div className="flex flex-col items-end gap-4">
            <h1 className="text-5xl">INVOICE</h1>
            <Input
              endDecorator="#"
              name="id"
              sx={{ direction: "rtl" }}
              value={invoice.id}
              onChange={(e) => handleInputChange("id", e.target.value)}
            />
          </div>
          <div className="flex flex-row items-end justify-between">
            <div>
              <Textarea
                minRows={2}
                sx={{ width: 500 }}
                placeholder="Who is this from?"
                value={invoice.from}
                onChange={(e) => handleInputChange("from", e.target.value)}
              />
              <div className="mt-8 flex flex-row gap-4">
                <FormTextArea
                  label="Bill To"
                  minRows={2}
                  sx={{ minWidth: 300 }}
                  placeholder="Who is this to?"
                  value={invoice.billTo}
                  onChange={(e) => handleInputChange("billTo", e.target.value)}
                />
                <FormTextArea
                  label="Ship To"
                  minRows={2}
                  sx={{ minWidth: 300 }}
                  placeholder="(optional)"
                  value={invoice.shipTo}
                  onChange={(e) => handleInputChange("shipTo", e.target.value)}
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
              />
              <FormInput
                label="Due Date"
                horizontal
                sx={{ width: 200 }}
                value={invoice.dueDate?.toISOString().split("T")[0]}
                onChange={(e) => handleInputChange("dueDate", new Date(e.target.value))}
                type="date"
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
        </form>
      </section>
    </main>
  );
}
