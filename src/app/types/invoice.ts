export interface InvoiceItem {
  id: number;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export interface Invoice {
  id: number;
  number: string;
  date: string;
  dueDate: string;
  contact: number;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  quoteId?: number; // Reference to the original quote
  paymentDate?: string;
  paymentReference?: string;
}
