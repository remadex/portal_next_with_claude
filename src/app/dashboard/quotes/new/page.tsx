'use client';

import { useRouter } from 'next/navigation';
import QuoteForm from '../../../components/QuoteForm';
import { useQuotes } from '../../../contexts/QuoteContext';

export default function NewQuotePage() {
  const router = useRouter();
  const { addQuote } = useQuotes();

  const handleSubmit = (data: any) => {
    addQuote(data);
    router.push('/dashboard/quotes');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Quote</h1>
      <QuoteForm onSubmit={handleSubmit} />
    </div>
  );
} 