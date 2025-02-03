'use client';

import { useState } from 'react';
import { useAuth } from '@portal/app/contexts/AuthContext';
import ProfileForm from './ProfileForm';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="card bg-base-200 lg:col-span-1">
          <div className="card-body">
            <div className="flex flex-col items-center text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-neutral text-neutral-content rounded-full w-24">
                  <span className="text-2xl">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
              </div>
              <h2 className="card-title">{user?.name}</h2>
              <p className="text-sm opacity-70">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <ProfileForm 
            isEditing={isEditing} 
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    </div>
  );
} 