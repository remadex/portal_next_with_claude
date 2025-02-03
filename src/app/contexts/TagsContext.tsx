'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Tag {
  id: number;
  name: string;
  color: string;
}

interface TagsContextType {
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: number) => void;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export function TagsProvider({ children }: { children: ReactNode }) {
  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: 'Client', color: '#FF5733' },
    { id: 2, name: 'Supplier', color: '#33FF57' },
    { id: 3, name: 'Partner', color: '#3357FF' },
  ]);

  const addTag = (newTag: Omit<Tag, 'id'>) => {
    setTags(prev => [...prev, { ...newTag, id: Math.max(...prev.map(t => t.id), 0) + 1 }]);
  };

  const updateTag = (updatedTag: Tag) => {
    setTags(prev => prev.map(tag => tag.id === updatedTag.id ? updatedTag : tag));
  };

  const deleteTag = (id: number) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  };

  return (
    <TagsContext.Provider value={{ tags, addTag, updateTag, deleteTag }}>
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
} 