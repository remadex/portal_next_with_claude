'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@portal/app/contexts/AuthContext';

interface ProfileFormProps {
  isEditing: boolean;
  onCancel: () => void;
}

export default function ProfileForm({ isEditing, onCancel }: ProfileFormProps) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        position: user.position || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      // Show error message
      return;
    }

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.position,
        ...(formData.newPassword ? {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        } : {})
      });
      onCancel();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title text-sm opacity-70">Profile Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">Phone</label>
              <input
                type="tel"
                className="input input-bordered"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="form-control">
              <label className="label">Position</label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">Company</label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Password Change Section */}
          {isEditing && (
            <div className="divider">Change Password</div>
          )}

          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control md:col-span-2">
                <label className="label">Current Password</label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={formData.oldPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, oldPassword: e.target.value }))}
                />
              </div>

              <div className="form-control">
                <label className="label">New Password</label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>

              <div className="form-control">
                <label className="label">Confirm New Password</label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 