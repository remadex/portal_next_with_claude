'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuotes } from '@portal/app/contexts/QuoteContext';
import QuoteForm from '@portal/app/components/QuoteForm';
import { Quote } from '@portal/app/contexts/QuoteContext';

export default function QuoteEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { quotes, updateQuote } = useQuotes();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const foundQuote = quotes.find(q => q.id === parseInt(resolvedParams.id));
    if (!foundQuote) {
      router.push('/dashboard/quotes');
      return;
    }
    setQuote(foundQuote);
  }, [resolvedParams.id, quotes, router]);

  const handleSubmit = (data: Omit<Quote, 'id'>) => {
    if (!quote) return;
    updateQuote(quote.id, data);
    router.push(`/dashboard/quotes/${quote.id}`);
  };

  if (!quote) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Quote {quote.number}</h1>
      <QuoteForm initialData={quote} onSubmit={handleSubmit} />
    </div>
  );
} 