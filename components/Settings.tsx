'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMoodStore } from '../store/moodStore';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Eye, 
  Palette,
  ArrowLeft,
  Save,
  Download,
  Trash2,
  User,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, setCurrentView } = useMoodStore();
  const [settings, setSettings] = useState({
    theme: user?.preferences.theme || 'light',
    notifications: {
      dailyReminder: user?.preferences.notifications.dailyReminder || true,
      weeklyInsights: user?.preferences.notifications.weeklyInsights || true,
      achievementAlerts: user?.preferences.notifications.achievementAlerts || true,
      moodCheckIn: user?.preferences.notifications.moodCheckIn || true,
    },
    privacy: {
      shareData: user?.preferences.privacy.shareData || false,
      anonymousMode: user?.preferences.privacy.anonymousMode || false,
    },
    accessibility: {
      highContrast: user?.preferences.accessibility.highContrast || false,
      largeText: user?.preferences.accessibility.largeText || false,
      reducedMotion: user?.preferences.accessibility.reducedMotion || false,
    },
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast.success('Settings saved successfully!');
  };

  const handleExportData = () => {
    // In a real app, this would export user data
    toast.success('Data export started! Check your email.');
  };

  const handleDeleteData = () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      // In a real app, this would delete user data
      toast.success('Data deletion request submitted.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mood-button bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-gray-600">Customize your mood companion experience</p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="mood-button bg-primary-500 text-white hover:bg-primary-600 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="mood-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="mood-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-purple-500" />
              Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'auto', icon: Monitor, label: 'Auto' },
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => handleSettingChange('theme', 'theme', value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.theme === value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-300'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="mood-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-green-500" />
              Accessibility
            </h3>
            <div className="space-y-4">
              {[
                { key: 'highContrast', label: 'High Contrast Mode' },
                { key: 'largeText', label: 'Large Text' },
                { key: 'reducedMotion', label: 'Reduced Motion' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <button
                    onClick={() => handleSettingChange('accessibility', key, !settings.accessibility[key as keyof typeof settings.accessibility])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.accessibility[key as keyof typeof settings.accessibility]
                        ? 'bg-primary-500'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.accessibility[key as keyof typeof settings.accessibility]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Notification Settings */}
          <div className="mood-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-yellow-500" />
              Notifications
            </h3>
            <div className="space-y-4">
              {[
                { key: 'dailyReminder', label: 'Daily Mood Reminders' },
                { key: 'weeklyInsights', label: 'Weekly Insights' },
                { key: 'achievementAlerts', label: 'Achievement Alerts' },
                { key: 'moodCheckIn', label: 'Mood Check-in Prompts' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <button
                    onClick={() => handleSettingChange('notifications', key, !settings.notifications[key as keyof typeof settings.notifications])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications[key as keyof typeof settings.notifications]
                        ? 'bg-primary-500'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications[key as keyof typeof settings.notifications]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="mood-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Privacy & Data
            </h3>
            <div className="space-y-4">
              {[
                { key: 'shareData', label: 'Share Anonymous Data for Research' },
                { key: 'anonymousMode', label: 'Anonymous Mode' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <button
                    onClick={() => handleSettingChange('privacy', key, !settings.privacy[key as keyof typeof settings.privacy])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.privacy[key as keyof typeof settings.privacy]
                        ? 'bg-primary-500'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy[key as keyof typeof settings.privacy]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="mood-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2 text-gray-500" />
              Data Management
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export My Data</span>
              </button>
              <button
                onClick={handleDeleteData}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete All Data</span>
              </button>
            </div>
          </div>

          {/* App Information */}
          <div className="mood-card">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Build:</strong> 2024.1.0</p>
              <p><strong>Last Updated:</strong> January 2024</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                AI Mood Companion is designed to help you track and understand your emotional well-being through intelligent analysis and gamification.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
