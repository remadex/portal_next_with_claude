'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInvoices } from '@portal/app/contexts/InvoiceContext';
import { useContacts } from '@portal/app/contexts/ContactsContext';
import { Invoice } from '@portal/app/types/invoice';
import { generatePDF } from '@portal/app/utils/pdfGenerator';

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { invoices, updateInvoice } = useInvoices();
  const { contacts } = useContacts();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const foundInvoice = invoices.find(i => i.id === parseInt(resolvedParams.id));
    if (!foundInvoice) {
      router.push('/dashboard/invoices');
      return;
    }
    setInvoice(foundInvoice);
  }, [resolvedParams.id, invoices, router]);

  const getContactInfo = (contactId: number) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? {
      name: contact.name,
      company: contact.company,
      address: contact.billingAddress,
      vatNumber: contact.vatNumber
    } : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft': return 'badge-warning';
      case 'sent': return 'badge-info';
      case 'paid': return 'badge-success';
      case 'overdue': return 'badge-error';
      case 'cancelled': return 'badge-ghost';
      default: return 'badge-ghost';
    }
  };

  const handleStatusChange = (newStatus: Invoice['status']) => {
    if (!invoice) return;
    updateInvoice(invoice.id, { status: newStatus });
  };

  const handleGeneratePDF = () => {
    if (!invoice) return;
    const contact = contacts.find(c => c.id === invoice.contact);
    if (!contact) return;
    generatePDF(invoice, contact, 'invoice');
  };

  if (!invoice) return null;

  const contactInfo = getContactInfo(invoice.contact);
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const vat = invoice.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    return sum + (itemTotal * (item.vatRate / 100));
  }, 0);
  const total = subtotal + vat;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Invoice {invoice.number}</h1>
          <div className="mt-1 space-x-2">
            <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
            <span className="text-sm opacity-70">
              Created: {formatDate(invoice.date)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="select select-bordered select-sm"
            value={invoice.status}
            onChange={(e) => handleStatusChange(e.target.value as Invoice['status'])}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button
            onClick={handleGeneratePDF}
            className="btn btn-sm btn-primary"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title text-sm opacity-70">From</h2>
            <div>
              <p className="font-semibold">Your Company Name</p>
              <p>123 Business Street</p>
              <p>Business City, 12345</p>
              <p>VAT: 123456789</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title text-sm opacity-70">Bill To</h2>
            {contactInfo && (
              <div>
                <p className="font-semibold">{contactInfo.name}</p>
                <p>{contactInfo.company}</p>
                {contactInfo.address && (
                  <>
                    <p>{contactInfo.address.street}</p>
                    <p>
                      {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.postalCode}
                    </p>
                    <p>{contactInfo.address.country}</p>
                  </>
                )}
                {contactInfo.vatNumber && <p>VAT: {contactInfo.vatNumber}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-sm opacity-70 mb-4">Items</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">VAT</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => {
                  const itemSubtotal = item.quantity * item.unitPrice;
                  const itemVat = itemSubtotal * (item.vatRate / 100);
                  return (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{item.description}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-right">{item.vatRate}%</td>
                      <td className="text-right">{formatCurrency(itemSubtotal + itemVat)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}></td>
                  <td className="text-right font-semibold">Subtotal:</td>
                  <td className="text-right">{formatCurrency(subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                  <td className="text-right font-semibold">VAT:</td>
                  <td className="text-right">{formatCurrency(vat)}</td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                  <td className="text-right font-semibold">Total:</td>
                  <td className="text-right font-bold">{formatCurrency(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {invoice.paymentDate && (
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title text-sm opacity-70">Payment Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-70">Payment Date</p>
                <p>{formatDate(invoice.paymentDate)}</p>
              </div>
              {invoice.paymentReference && (
                <div>
                  <p className="text-sm opacity-70">Reference</p>
                  <p>{invoice.paymentReference}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {(invoice.notes || invoice.terms) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {invoice.notes && (
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title text-sm opacity-70">Notes</h2>
                <p className="whitespace-pre-line">{invoice.notes}</p>
              </div>
            </div>
          )}
          {invoice.terms && (
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title text-sm opacity-70">Terms & Conditions</h2>
                <p className="whitespace-pre-line">{invoice.terms}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 