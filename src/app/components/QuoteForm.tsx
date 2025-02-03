'use client';

import { useState, useEffect } from 'react';
import { useContacts } from '../contexts/ContactsContext';
import { Quote, QuoteItem } from '../contexts/QuoteContext';

interface QuoteFormProps {
  initialData?: Partial<Quote>;
  onSubmit: (data: Omit<Quote, 'id'>) => void;
}

export default function QuoteForm({ initialData, onSubmit }: QuoteFormProps) {
  const { contacts } = useContacts();
  const [items, setItems] = useState<Omit<QuoteItem, 'id'>[]>(
    initialData?.items || [{
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
    }]
  );
  const [selectedContact, setSelectedContact] = useState<number | undefined>(initialData?.contact);
  
  // Format the date in YYYY-MM-DD format for input[type="date"]
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const [quoteDate, setQuoteDate] = useState(
    initialData?.date || formatDateForInput(new Date())
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate || formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // Default to 30 days from now
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [terms, setTerms] = useState(initialData?.terms || '');

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const addItem = () => {
    setItems([...items, {
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
    }]);
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateVAT = () => {
    return items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (itemTotal * (item.vatRate / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    onSubmit({
      number: `QT-${Date.now()}`,
      date: quoteDate,
      dueDate,
      contact: selectedContact,
      items,
      notes,
      terms,
      status: 'draft'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">Contact</label>
          <select
            className="select select-bordered"
            value={selectedContact}
            onChange={(e) => setSelectedContact(Number(e.target.value))}
            required
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} - {contact.company}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">Quote Date</label>
          <input
            type="date"
            className="input input-bordered"
            value={quoteDate}
            onChange={(e) => setQuoteDate(e.target.value)}
            required
          />
          <span className="label-text-alt mt-1">
            {formatDisplayDate(quoteDate)}
          </span>
        </div>

        <div className="form-control">
          <label className="label">Due Date</label>
          <input
            type="date"
            className="input input-bordered"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <span className="label-text-alt mt-1">
            {formatDisplayDate(dueDate)}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="btn btn-sm btn-primary"
          >
            Add Item
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="card bg-base-200 shadow-sm">
              <div className="card-body p-4">
                <div className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-12 sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Product/Service"
                      className="input input-sm input-bordered w-full"
                      value={item.productName}
                      onChange={(e) => updateItem(index, 'productName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      className="input input-sm input-bordered w-full"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      min="1"
                      required
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Price"
                      className="input input-sm input-bordered w-full"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <input
                      type="number"
                      placeholder="VAT %"
                      className="input input-sm input-bordered w-full"
                      value={item.vatRate}
                      onChange={(e) => updateItem(index, 'vatRate', Number(e.target.value))}
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="btn btn-ghost btn-sm text-error"
                      disabled={items.length === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="col-span-12">
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      className="input input-sm input-bordered w-full"
                      value={item.description || ''}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />
                  </div>

                  <div className="col-span-12 text-right text-sm opacity-70">
                    Subtotal: {formatCurrency(item.quantity * item.unitPrice)}
                    <br />
                    VAT: {formatCurrency(item.quantity * item.unitPrice * (item.vatRate / 100))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="card bg-base-200">
        <div className="card-body p-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Subtotal</div>
              <div className="stat-value text-lg">{formatCurrency(calculateSubtotal())}</div>
            </div>
            <div className="stat">
              <div className="stat-title">VAT</div>
              <div className="stat-value text-lg">{formatCurrency(calculateVAT())}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total</div>
              <div className="stat-value text-lg">{formatCurrency(calculateTotal())}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">Notes</label>
          <textarea
            className="textarea textarea-bordered h-32"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">Terms & Conditions</label>
          <textarea
            className="textarea textarea-bordered h-32"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button type="submit" className="btn btn-primary">
          Save Quote
        </button>
      </div>
    </form>
  );
}

// Helper function for currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}; 