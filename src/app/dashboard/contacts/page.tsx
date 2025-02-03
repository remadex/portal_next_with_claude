'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTags } from '@portal/app/contexts/TagsContext';

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: number[];
}

export default function ContactsPage() {
  const { tags } = useTags();
  const [contacts, setContacts] = useState<Contact[]>([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '123-456-7890', 
      company: 'ABC Corp',
      tags: [1, 2]
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '098-765-4321', 
      company: 'XYZ Inc',
      tags: [3]
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/tags" className="btn btn-ghost">
            Manage Tags
          </Link>
          <Link href="/dashboard/contacts/new" className="btn btn-primary">
            Add Contact
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.company}</td>
                <td>
                  <div className="flex gap-1 flex-wrap">
                    {contact.tags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: tag.color + '20',
                            color: tag.color,
                            border: `1px solid ${tag.color}`
                          }}
                        >
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </td>
                <td>
                  <Link
                    href={`/dashboard/contacts/${contact.id}/edit`}
                    className="btn btn-sm btn-ghost"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 