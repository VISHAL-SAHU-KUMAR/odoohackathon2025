import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationPreferences = ({ preferences, onPreferencesChange, Notification }) => {
  const frequencyOptions = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'hourly', label: 'Hourly digest' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly digest' },
  { value: 'never', label: 'Never' }];


  const handlePreferenceChange = (key, value) => {
    onPreferencesChange({ ...preferences, [key]: value });
  };

  const notificationCategories = [
  {
    id: 'uploads',
    title: 'File Uploads',
    description: 'Notifications when files are successfully uploaded or fail',
    icon: 'Upload',
    settings: [
    { key: 'uploadSuccess', label: 'Upload successful', checked: preferences.uploadSuccess || true },
    { key: 'uploadFailed', label: 'Upload failed', checked: preferences.uploadFailed || true },
    { key: 'uploadProgress', label: 'Upload progress updates', checked: preferences.uploadProgress || false }]

  },
  {
    id: 'shares',
    title: 'File Sharing',
    description: 'Notifications about shared files and link activity',
    icon: 'Share2',
    settings: [
    { key: 'shareCreated', label: 'Share link created', checked: preferences.shareCreated || true },
    { key: 'shareAccessed', label: 'File accessed via share link', checked: preferences.shareAccessed || true },
    { key: 'shareExpired', label: 'Share link expired', checked: preferences.shareExpired || true },
    { key: 'shareDownloaded', label: 'File downloaded via share', checked: preferences.shareDownloaded || false }]

  },
  {
    id: 'security',
    title: 'Security Events',
    description: 'Important security-related notifications',
    icon: 'Shield',
    settings: [
    { key: 'loginSuccess', label: 'Successful login', checked: preferences.loginSuccess || false },
    { key: 'loginFailed', label: 'Failed login attempt', checked: preferences.loginFailed || true },
    { key: 'walletChanged', label: 'Wallet address changed', checked: preferences.walletChanged || true },
    { key: 'keyBackup', label: 'Encryption key backup reminders', checked: preferences.keyBackup || true }]

  },
  {
    id: 'storage',
    title: 'Storage Management',
    description: 'Notifications about storage usage and maintenance',
    icon: 'Database',
    settings: [
    { key: 'storageQuota', label: 'Storage quota warnings', checked: preferences.storageQuota || true },
    { key: 'fileExpiry', label: 'File expiration reminders', checked: preferences.fileExpiry || true },
    { key: 'ipfsStatus', label: 'IPFS network status updates', checked: preferences.ipfsStatus || false },
    { key: 'maintenanceAlerts', label: 'Maintenance notifications', checked: preferences.maintenanceAlerts || true }]

  }];


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Notification Preferences</h3>
        <Icon name="Bell" size={20} className="text-muted-foreground" />
      </div>

      {/* Global Settings */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-foreground">Global Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Default Frequency"
            description="How often to receive notifications"
            options={frequencyOptions}
            value={preferences.defaultFrequency || 'immediate'}
            onChange={(value) => handlePreferenceChange('defaultFrequency', value)} />

          
          <div className="space-y-3">
            <Checkbox
              label="Enable browser notifications"
              description="Show notifications in your browser"
              checked={preferences.browserNotifications || true}
              onChange={(e) => handlePreferenceChange('browserNotifications', e.target.checked)} />

            
            <Checkbox
              label="Enable email notifications"
              description="Send notifications to your email (requires setup)"
              checked={preferences.emailNotifications || false}
              onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)} />

          </div>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="space-y-4">
        {notificationCategories.map((category) =>
        <div key={category.id} className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <Icon name={category.icon} size={20} className="text-primary" />
              <div>
                <h4 className="text-md font-medium text-foreground">{category.title}</h4>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.settings.map((setting) =>
            <Checkbox
              key={setting.key}
              label={setting.label}
              checked={setting.checked}
              onChange={(e) => handlePreferenceChange(setting.key, e.target.checked)} />

            )}
            </div>
          </div>
        )}
      </div>

      {/* Quiet Hours */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <Icon name="Moon" size={20} className="text-primary" />
          <div>
            <h4 className="text-md font-medium text-foreground">Quiet Hours</h4>
            <p className="text-sm text-muted-foreground">Disable non-critical notifications during specified hours</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Checkbox
            label="Enable quiet hours"
            description="Suppress non-urgent notifications during quiet periods"
            checked={preferences.enableQuietHours || false}
            onChange={(e) => handlePreferenceChange('enableQuietHours', e.target.checked)} />

          
          {preferences.enableQuietHours &&
          <div className="grid grid-cols-2 gap-4 ml-6">
              <div>
                <label className="text-sm font-medium text-foreground">Start Time</label>
                <input
                type="time"
                value={preferences.quietHoursStart || '22:00'}
                onChange={(e) => handlePreferenceChange('quietHoursStart', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />

              </div>
              <div>
                <label className="text-sm font-medium text-foreground">End Time</label>
                <input
                type="time"
                value={preferences.quietHoursEnd || '08:00'}
                onChange={(e) => handlePreferenceChange('quietHoursEnd', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-border rounded-md bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />

              </div>
            </div>
          }
        </div>
      </div>

      {/* Test Notifications */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-md font-medium text-foreground">Test Notifications</h4>
            <p className="text-sm text-muted-foreground">Send a test notification to verify your settings</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (Notification.permission === 'granted') {
                  new Notification('SecureVault Test', {
                    body: 'Your notification settings are working correctly!',
                    icon: '/favicon.ico'
                  });
                } else {
                  alert('Browser notifications are not enabled');
                }
              }}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth">

              Test Browser
            </button>
            <button
              onClick={() => alert('Email test notification sent (demo)')}
              className="px-3 py-1.5 text-sm bg-outline border border-border text-foreground rounded-md hover:bg-muted transition-smooth">

              Test Email
            </button>
          </div>
        </div>
      </div>
    </div>);

};

export default NotificationPreferences;