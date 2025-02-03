'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuotes } from '@portal/app/contexts/QuoteContext';
import { useContacts } from '@portal/app/contexts/ContactsContext';
import { Quote } from '@portal/app/contexts/QuoteContext';
import { useInvoices } from '@portal/app/contexts/InvoiceContext';

export default function QuoteViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { quotes, updateQuote } = useQuotes();
  const { contacts } = useContacts();
  const { convertQuoteToInvoice } = useInvoices();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const foundQuote = quotes.find(q => q.id === parseInt(resolvedParams.id));
    if (!foundQuote) {
      router.push('/dashboard/quotes');
      return;
    }
    setQuote(foundQuote);
  }, [resolvedParams.id, quotes, router]);

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
      case 'accepted': return 'badge-success';
      case 'rejected': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const handleStatusChange = (newStatus: Quote['status']) => {
    if (!quote) return;
    updateQuote(quote.id, { status: newStatus });
  };

  const handleConvertToInvoice = () => {
    if (!quote) return;
    convertQuoteToInvoice(quote);
    updateQuote(quote.id, { status: 'accepted' });
    router.push('/dashboard/invoices');
  };

  if (!quote) return null;

  const contactInfo = getContactInfo(quote.contact);
  const subtotal = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const vat = quote.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    return sum + (itemTotal * (item.vatRate / 100));
  }, 0);
  const total = subtotal + vat;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quote {quote.number}</h1>
          <div className="mt-1 space-x-2">
            <span className={`badge ${getStatusBadgeClass(quote.status)}`}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </span>
            <span className="text-sm opacity-70">
              Created: {formatDate(quote.date)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="select select-bordered select-sm"
            value={quote.status}
            onChange={(e) => handleStatusChange(e.target.value as Quote['status'])}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          
          {quote.status === 'accepted' && (
            <button
              onClick={handleConvertToInvoice}
              className="btn btn-sm btn-primary"
            >
              Convert to Invoice
            </button>
          )}
          
          <Link
            href={`/dashboard/quotes/${quote.id}/edit`}
            className="btn btn-sm btn-ghost"
          >
            Edit
          </Link>
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
                {quote.items.map((item, index) => {
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

      {(quote.notes || quote.terms) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quote.notes && (
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title text-sm opacity-70">Notes</h2>
                <p className="whitespace-pre-line">{quote.notes}</p>
              </div>
            </div>
          )}
          {quote.terms && (
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title text-sm opacity-70">Terms & Conditions</h2>
                <p className="whitespace-pre-line">{quote.terms}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 