import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Quote } from "../contexts/QuoteContext";
import { Invoice } from "../types/invoice";
import { Contact } from "../types/contact";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const generatePDF = (
  document: Quote | Invoice,
  contact: Contact,
  type: "quote" | "invoice"
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header
  doc.setFontSize(20);
  doc.text(type.toUpperCase(), 20, 20);

  doc.setFontSize(10);
  doc.text(`${type.toUpperCase()} #: ${document.number}`, 20, 30);
  doc.text(`Date: ${formatDate(document.date)}`, 20, 35);
  doc.text(`Due Date: ${formatDate(document.dueDate)}`, 20, 40);

  // Company Details (Your company)
  doc.setFontSize(12);
  doc.text("From:", 20, 55);
  doc.setFontSize(10);
  doc.text("Your Company Name", 20, 62);
  doc.text("Your Address Line 1", 20, 67);
  doc.text("Your City, State ZIP", 20, 72);
  doc.text("VAT: Your-VAT-Number", 20, 77);

  // Client Details
  doc.setFontSize(12);
  doc.text("Bill To:", pageWidth / 2, 55);
  doc.setFontSize(10);
  doc.text(
    [
      contact.company,
      contact.name,
      contact.billingAddress.street,
      `${contact.billingAddress.city}, ${contact.billingAddress.state} ${contact.billingAddress.postalCode}`,
      contact.billingAddress.country,
      `VAT: ${contact.vatNumber}`,
    ],
    pageWidth / 2,
    62
  );

  // Items Table
  const tableData = document.items.map((item) => [
    item.productName,
    item.description || "",
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    `${item.vatRate}%`,
    formatCurrency(item.quantity * item.unitPrice),
    formatCurrency(item.quantity * item.unitPrice * (1 + item.vatRate / 100)),
  ]);

  const subtotal = document.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const vat = document.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    return sum + itemTotal * (item.vatRate / 100);
  }, 0);
  const total = subtotal + vat;

  doc.autoTable({
    startY: 100,
    head: [
      [
        "Product",
        "Description",
        "Qty",
        "Unit Price",
        "VAT",
        "Subtotal",
        "Total",
      ],
    ],
    body: tableData,
    foot: [
      ["", "", "", "", "Subtotal:", "", formatCurrency(subtotal)],
      ["", "", "", "", "VAT:", "", formatCurrency(vat)],
      ["", "", "", "", "Total:", "", formatCurrency(total)],
    ],
    theme: "grid",
    headStyles: { fillColor: [71, 85, 105] },
    footStyles: { fillColor: [241, 245, 249] },
  });

  // Notes & Terms
  let currentY = (doc as any).lastAutoTable.finalY + 20;

  if (document.notes) {
    doc.setFontSize(12);
    doc.text("Notes:", 20, currentY);
    doc.setFontSize(10);
    doc.text(document.notes, 20, currentY + 7);
    currentY += 20 + document.notes.split("\n").length * 5;
  }

  if (document.terms) {
    doc.setFontSize(12);
    doc.text("Terms & Conditions:", 20, currentY);
    doc.setFontSize(10);
    doc.text(document.terms, 20, currentY + 7);
  }

  // Save the PDF
  doc.save(`${type}-${document.number}.pdf`);
};
