'use client';

import { useState } from 'react';
import { useDocuments } from '../contexts/DocumentsContext';

interface DocumentUploaderProps {
  contactId?: number;
  onUploadComplete?: () => void;
}

export default function DocumentUploader({ contactId, onUploadComplete }: DocumentUploaderProps) {
  const { addDocument } = useDocuments();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      // In a real app, you'd upload the file to your server here
      // For now, we'll create a fake URL
      const fakeUrl = URL.createObjectURL(file);
      
      addDocument({
        name: file.name,
        type: file.type,
        size: file.size,
        url: fakeUrl,
        contactId
      });
    });

    onUploadComplete?.();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? 'border-primary bg-primary/5' : 'border-base-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="text-sm">
            <span className="text-primary">Click to upload</span> or drag and drop
          </div>
          <div className="text-xs opacity-50">
            PDF, DOC, DOCX, XLS, XLSX up to 10MB
          </div>
        </div>
      </label>
    </div>
  );
} 