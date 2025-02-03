'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTags, Tag } from '@portal/app/contexts/TagsContext';

export default function TagsPage() {
  const { tags, addTag, updateTag, deleteTag } = useTags();
  const [newTag, setNewTag] = useState({ name: '', color: '#000000' });
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.name.trim()) {
      addTag(newTag);
      setNewTag({ name: '', color: '#000000' });
    }
  };

  const handleUpdateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTag) {
      updateTag(editingTag);
      setEditingTag(null);
    }
  };

  const handleDeleteTag = (id: number) => {
    deleteTag(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tags</h1>
      </div>

      {/* Add new tag form */}
      <form onSubmit={handleAddTag} className="card bg-base-200 p-4 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add New Tag</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newTag.name}
            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
            placeholder="Tag name"
            className="input input-bordered flex-1"
            required
          />
          <input
            type="color"
            value={newTag.color}
            onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
            className="w-14 h-12 rounded cursor-pointer"
          />
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </form>

      {/* Tags list */}
      <div className="grid gap-4 max-w-md">
        {tags.map((tag) => (
          <div key={tag.id} className="card bg-base-200 p-4">
            {editingTag?.id === tag.id ? (
              <form onSubmit={handleUpdateTag} className="flex gap-4">
                <input
                  type="text"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  className="input input-bordered flex-1"
                  required
                />
                <input
                  type="color"
                  value={editingTag.color}
                  onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                  className="w-14 h-12 rounded cursor-pointer"
                />
                <button type="submit" className="btn btn-primary">Save</button>
                <button 
                  type="button" 
                  className="btn btn-ghost"
                  onClick={() => setEditingTag(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: tag.color }}
                  />
                  <span>{tag.name}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditingTag(tag)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 