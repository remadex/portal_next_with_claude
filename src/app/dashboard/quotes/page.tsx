'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuotes } from '@portal/app/contexts/QuoteContext';
import { useContacts } from '@portal/app/contexts/ContactsContext';

export default function QuotesPage() {
  const { quotes } = useQuotes();
  const { contacts } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');

  const getContactName = (contactId: number) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.name} - ${contact.company}` : 'Unknown Contact';
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

  const filteredQuotes = quotes.filter(quote => 
    quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getContactName(quote.contact).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="join flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search quotes..."
              className="input input-bordered join-item flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary join-item">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <Link href="/dashboard/quotes/new" className="btn btn-primary">
            New Quote
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Quote Number</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map(quote => (
              <tr key={quote.id}>
                <td>{quote.number}</td>
                <td>{getContactName(quote.contact)}</td>
                <td>{formatDate(quote.date)}</td>
                <td>{formatDate(quote.dueDate)}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td>
                  {formatCurrency(
                    quote.items.reduce((sum, item) => {
                      const itemTotal = item.quantity * item.unitPrice;
                      const vatAmount = itemTotal * (item.vatRate / 100);
                      return sum + itemTotal + vatAmount;
                    }, 0)
                  )}
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/quotes/${quote.id}`}
                      className="btn btn-sm btn-ghost"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/quotes/${quote.id}/edit`}
                      className="btn btn-sm btn-ghost"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 