'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Contact } from '../types/contact';

interface ContactsContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: number, contact: Partial<Contact>) => void;
  deleteContact: (id: number) => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'ACME Inc',
      position: 'CEO',
      vatNumber: 'VAT123456',
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      },
      tags: []
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@techcorp.com',
      phone: '+1987654321',
      company: 'Tech Corp',
      position: 'CTO',
      vatNumber: 'VAT789012',
      billingAddress: {
        street: '456 Tech Ave',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'USA'
      },
      tags: []
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice@globalinc.com',
      phone: '+1122334455',
      company: 'Global Inc',
      position: 'CFO',
      vatNumber: 'VAT345678',
      billingAddress: {
        street: '789 Global Blvd',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'USA'
      },
      tags: []
    }
  ]);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    setContacts(prev => [...prev, { ...contact, id: Math.max(...prev.map(c => c.id ?? 0), 0) + 1 }]);
  };

  const updateContact = (id: number, contact: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...contact } : c));
  };

  const deleteContact = (id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ContactsContext.Provider value={{ contacts, addContact, updateContact, deleteContact }}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
} 