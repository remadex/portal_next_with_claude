'use client';

import { useState } from 'react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface ThemeSetting {
  id: string;
  name: string;
  value: string;
}

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'new-contact',
      label: 'New Contact Notifications',
      description: 'Receive notifications when a new contact is added',
      enabled: true,
    },
    {
      id: 'contact-updates',
      label: 'Contact Updates',
      description: 'Get notified when contacts are modified',
      enabled: false,
    },
    {
      id: 'weekly-summary',
      label: 'Weekly Summary',
      description: 'Receive a weekly summary of contact activities',
      enabled: true,
    },
  ]);

  const themes: ThemeSetting[] = [
    { id: 'light', name: 'Light', value: 'light' },
    { id: 'dark', name: 'Dark', value: 'dark' },
    { id: 'cupcake', name: 'Cupcake', value: 'cupcake' },
    { id: 'cyberpunk', name: 'Cyberpunk', value: 'cyberpunk' },
    { id: 'synthwave', name: 'Synthwave', value: 'synthwave' },
  ];

  const [selectedTheme, setSelectedTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );
  const [email, setEmail] = useState('user@example.com');
  const [language, setLanguage] = useState('en');

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile Settings */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Profile Settings</h2>
          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text">Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered"
            />
          </div>
          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text">Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select select-bordered"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Theme Settings</h2>
          <div className="form-control">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {themes.map((theme) => (
                <label
                  key={theme.id}
                  className={`cursor-pointer flex flex-col items-center gap-2 p-4 rounded-lg border-2 ${
                    selectedTheme === theme.value
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={selectedTheme === theme.value}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="hidden"
                  />
                  <div className="w-full h-20 rounded-lg bg-primary"></div>
                  <span>{theme.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Notification Settings</h2>
          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{setting.label}</h3>
                  <p className="text-sm opacity-70">{setting.description}</p>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={setting.enabled}
                  onChange={() => toggleNotification(setting.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  );
} 