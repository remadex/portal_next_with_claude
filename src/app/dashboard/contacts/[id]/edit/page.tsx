'use client';

import ContactForm from '../../ContactForm';
import { useRouter } from 'next/navigation';

export default function EditContactPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // This would typically come from an API call
  const mockContact = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    company: 'ABC Corp',
  };

  const handleSubmit = async (formData: FormData) => {
    // Here you would typically make an API call to update the contact
    console.log('Updated contact:', Object.fromEntries(formData));
    router.push('/dashboard/contacts');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Contact</h1>
      <ContactForm initialData={mockContact} onSubmit={handleSubmit} />
    </div>
  );
} 