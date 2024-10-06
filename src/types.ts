export interface InvoiceItem {
  name: string;
  quantity: number;
  rate: number;
}

export interface Invoice {
  id: string;
  from: string;
  billTo: string;
  shipTo: string;
  date: Date;
  dueDate: Date | null;
  items: Array<InvoiceItem>;
  notes: string;
}

