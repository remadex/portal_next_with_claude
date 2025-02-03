'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface QuoteItem {
  id: number;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount?: number;
}

export interface Quote {
  id: number;
  number: string;
  date: string;
  dueDate: string;
  contact: number; // Contact ID
  items: QuoteItem[];
  notes?: string;
  terms?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

interface QuoteContextType {
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, 'id'>) => void;
  updateQuote: (id: number, quote: Partial<Quote>) => void;
  deleteQuote: (id: number) => void;
  addQuoteItem: (quoteId: number, item: Omit<QuoteItem, 'id'>) => void;
  updateQuoteItem: (quoteId: number, itemId: number, item: Partial<QuoteItem>) => void;
  deleteQuoteItem: (quoteId: number, itemId: number) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 1,
      number: 'QT-2024001',
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
      status: 'draft'
    },
    {
      id: 2,
      number: 'QT-2024002',
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
      status: 'sent'
    },
    {
      id: 3,
      number: 'QT-2024003',
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
      status: 'accepted'
    }
  ]);

  const addQuote = (quote: Omit<Quote, 'id'>) => {
    setQuotes(prev => [...prev, { ...quote, id: Math.max(...prev.map(q => q.id), 0) + 1 }]);
  };

  const updateQuote = (id: number, quote: Partial<Quote>) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...quote } : q));
  };

  const deleteQuote = (id: number) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const addQuoteItem = (quoteId: number, item: Omit<QuoteItem, 'id'>) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        const newItem = {
          ...item,
          id: Math.max(...q.items.map(i => i.id), 0) + 1
        };
        return { ...q, items: [...q.items, newItem] };
      }
      return q;
    }));
  };

  const updateQuoteItem = (quoteId: number, itemId: number, item: Partial<QuoteItem>) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          items: q.items.map(i => i.id === itemId ? { ...i, ...item } : i)
        };
      }
      return q;
    }));
  };

  const deleteQuoteItem = (quoteId: number, itemId: number) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          items: q.items.filter(i => i.id !== itemId)
        };
      }
      return q;
    }));
  };

  return (
    <QuoteContext.Provider value={{
      quotes,
      addQuote,
      updateQuote,
      deleteQuote,
      addQuoteItem,
      updateQuoteItem,
      deleteQuoteItem
    }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuotes() {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuoteProvider');
  }
  return context;
} 