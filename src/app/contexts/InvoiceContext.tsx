'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Invoice } from '../types/invoice';
import { Quote } from './QuoteContext';

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: number, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: number) => void;
  convertQuoteToInvoice: (quote: Quote) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      number: 'INV-2024001',
      date: '2024-03-20',
      dueDate: '2024-04-19',
      contact: 1,
      items: [
        {
          id: 1,
          productName: 'Web Development',
          description: 'Full website development',
          quantity: 1,
          unitPrice: 5000,
          vatRate: 20
        }
      ],
      notes: 'Website development project',
      terms: 'Net 30',
      status: 'sent',
      quoteId: 1
    },
    {
      id: 2,
      number: 'INV-2024002',
      date: '2024-03-21',
      dueDate: '2024-04-20',
      contact: 2,
      items: [
        {
          id: 1,
          productName: 'Cloud Consulting',
          description: 'AWS architecture review',
          quantity: 40,
          unitPrice: 150,
          vatRate: 20
        }
      ],
      notes: 'Cloud infrastructure optimization',
      terms: 'Net 30',
      status: 'paid',
      quoteId: 2,
      paymentDate: '2024-04-01',
      paymentReference: 'BANK-001'
    },
    {
      id: 3,
      number: 'INV-2024003',
      date: '2024-03-22',
      dueDate: '2024-04-21',
      contact: 3,
      items: [
        {
          id: 1,
          productName: 'Mobile App Development',
          description: 'iOS and Android app',
          quantity: 1,
          unitPrice: 15000,
          vatRate: 20
        }
      ],
      notes: 'Mobile application development',
      terms: 'Net 30',
      status: 'overdue',
      quoteId: 3
    }
  ]);

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    setInvoices(prev => [
      ...prev,
      {
        ...invoice,
        id: Math.max(...prev.map(i => i.id), 0) + 1
      }
    ]);
  };

  const updateInvoice = (id: number, invoice: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => 
      i.id === id ? { ...i, ...invoice } : i
    ));
  };

  const deleteInvoice = (id: number) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  const convertQuoteToInvoice = (quote: Quote) => {
    const invoiceNumber = `INV-${new Date().getFullYear()}${String(invoices.length + 1).padStart(3, '0')}`;
    
    const newInvoice: Omit<Invoice, 'id'> = {
      number: invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contact: quote.contact,
      items: quote.items,
      notes: quote.notes,
      terms: quote.terms,
      status: 'draft',
      quoteId: quote.id
    };

    addInvoice(newInvoice);
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      convertQuoteToInvoice
    }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
} 