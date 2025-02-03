'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Document {
  id: number;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
  contactId?: number;
}

interface DocumentsContextType {
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'createdAt'>) => void;
  deleteDocument: (id: number) => void;
  getContactDocuments: (contactId: number) => Document[];
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'Contract.pdf',
      type: 'application/pdf',
      size: 1024576, // 1MB
      url: '/documents/contract.pdf',
      createdAt: '2024-03-20T10:00:00Z',
      contactId: 1
    },
    // Add more sample documents as needed
  ]);

  const addDocument = (doc: Omit<Document, 'id' | 'createdAt'>) => {
    setDocuments(prev => [
      ...prev,
      {
        ...doc,
        id: Math.max(...prev.map(d => d.id), 0) + 1,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const deleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getContactDocuments = (contactId: number) => {
    return documents.filter(doc => doc.contactId === contactId);
  };

  return (
    <DocumentsContext.Provider value={{ documents, addDocument, deleteDocument, getContactDocuments }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
} 