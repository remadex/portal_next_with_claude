'use client';

import ContactForm from '../ContactForm';
import { useRouter } from 'next/navigation';

export default function NewContactPage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    // Here you would typically make an API call to save the contact
    console.log('New contact:', Object.fromEntries(formData));
    router.push('/dashboard/contacts');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Contact</h1>
      <ContactForm onSubmit={handleSubmit} />
    </div>
  );
} 