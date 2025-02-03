'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useTags } from '@portal/app/contexts/TagsContext';
import DocumentUploader from '@portal/app/components/DocumentUploader';
import DocumentList from '@portal/app/components/DocumentList';
import { Contact } from '@portal/app/types/contact';

interface ContactFormProps {
  initialData?: Partial<Contact>;
  onSubmit: (data: Omit<Contact, 'id'>) => void;
}

export default function ContactForm({ initialData, onSubmit }: ContactFormProps) {
  const { tags: availableTags } = useTags();
  const [selectedTags, setSelectedTags] = useState<number[]>(initialData?.tags || []);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [vatNumber, setVatNumber] = useState(initialData?.vatNumber || '');
  const [billingAddress, setBillingAddress] = useState(initialData?.billingAddress || {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      phone,
      company,
      position,
      vatNumber,
      billingAddress,
      tags: selectedTags
    });
  };

  const removeTag = (tagId: number) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const addTag = (tagId: number) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags(prev => [...prev, tagId]);
    }
    setIsTagMenuOpen(false);
    tagInputRef.current?.focus();
  };

  const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag.id));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-sm opacity-70">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">Phone</label>
              <input
                type="tel"
                className="input input-bordered"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">Position</label>
              <input
                type="text"
                className="input input-bordered"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-sm opacity-70">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Company Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">VAT Number</label>
              <input
                type="text"
                className="input input-bordered"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-sm opacity-70">Billing Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control md:col-span-2">
              <label className="label">Street Address</label>
              <input
                type="text"
                className="input input-bordered"
                value={billingAddress.street}
                onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">City</label>
              <input
                type="text"
                className="input input-bordered"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">State/Province</label>
              <input
                type="text"
                className="input input-bordered"
                value={billingAddress.state}
                onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">Postal Code</label>
              <input
                type="text"
                className="input input-bordered"
                value={billingAddress.postalCode}
                onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">Country</label>
              <input
                type="text"
                className="input input-bordered"
                value={billingAddress.country}
                onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-control">
        <label className="label">Tags</label>
        <div className="relative">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map(tagId => {
              const tag = availableTags.find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <div
                  key={tag.id}
                  className="badge badge-lg gap-2"
                  style={{
                    backgroundColor: tag.color + '20',
                    color: tag.color,
                    border: `1px solid ${tag.color}`
                  }}
                >
                  {tag.name}
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-circle"
                    onClick={() => removeTag(tag.id)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="relative">
            <input
              ref={tagInputRef}
              type="text"
              className="input input-bordered w-full"
              placeholder="Add tags..."
              onFocus={() => setIsTagMenuOpen(true)}
            />
            
            {isTagMenuOpen && unselectedTags.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-base-100 rounded-lg shadow-lg border border-base-300">
                <ul className="menu p-2">
                  {unselectedTags.map(tag => (
                    <li key={tag.id}>
                      <button
                        type="button"
                        className="flex items-center gap-2"
                        onClick={() => addTag(tag.id)}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-control">
        <label className="label">Documents</label>
        <DocumentUploader contactId={initialData?.id} />
        <div className="mt-4">
          <DocumentList contactId={initialData?.id} />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          Save Contact
        </button>
      </div>
    </form>
  );
} 