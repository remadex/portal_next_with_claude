'use client';

import { useState } from 'react';
import { useDocuments } from '@portal/app/contexts/DocumentsContext';
import DocumentUploader from '@portal/app/components/DocumentUploader';
import DocumentList from '@portal/app/components/DocumentList';

export default function DocumentsPage() {
  const { documents } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0);

  const formatTotalSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Documents</div>
            <div className="stat-value">{documents.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Total Size</div>
            <div className="stat-value text-primary">{formatTotalSize(totalSize)}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search documents..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <DocumentList />
        </div>

        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Upload Documents</h2>
              <DocumentUploader />
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Document Types</h2>
              <div className="space-y-2">
                {Array.from(new Set(documents.map(doc => doc.type))).map(type => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm">{type.split('/')[1].toUpperCase()}</span>
                    <span className="badge">
                      {documents.filter(doc => doc.type === type).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 