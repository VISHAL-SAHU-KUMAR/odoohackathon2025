import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EncryptionSettings = ({ onSettingsChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    encryptionMethod: 'AES-256',
    keyDerivation: 'PBKDF2',
    iterations: 100000,
    enableBackup: true,
    backupMethod: 'wallet',
    customPassword: '',
    useCustomPassword: false
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const encryptionMethods = [
    { value: 'AES-256', label: 'AES-256-GCM (Recommended)', description: 'Industry standard encryption' },
    { value: 'AES-192', label: 'AES-192-GCM', description: 'Balanced security and performance' },
    { value: 'AES-128', label: 'AES-128-GCM', description: 'Faster encryption for large files' }
  ];

  const keyDerivationMethods = [
    { value: 'PBKDF2', label: 'PBKDF2', description: 'Standard key derivation' },
    { value: 'Argon2', label: 'Argon2id', description: 'Modern, memory-hard function' },
    { value: 'scrypt', label: 'scrypt', description: 'Memory-intensive derivation' }
  ];

  const backupMethods = [
    { value: 'wallet', label: 'Wallet Signature', description: 'Use wallet to recover keys' },
    { value: 'mnemonic', label: 'Mnemonic Phrase', description: 'Generate recovery phrase' },
    { value: 'none', label: 'No Backup', description: 'Keys cannot be recovered' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Encryption Settings
            </h3>
            <div className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
              Client-side
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="xs"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Files are encrypted in your browser before upload. Your keys never leave your device.
        </p>
      </div>

      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Encryption Method */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Encryption Algorithm
            </label>
            <div className="space-y-2">
              {encryptionMethods.map((method) => (
                <label key={method.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="encryptionMethod"
                    value={method.value}
                    checked={settings.encryptionMethod === method.value}
                    onChange={(e) => handleSettingChange('encryptionMethod', e.target.value)}
                    className="mt-0.5 w-4 h-4 text-primary border-border focus:ring-ring"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-foreground">{method.label}</div>
                    <div className="text-xs text-muted-foreground">{method.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Key Derivation */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Key Derivation Function
            </label>
            <select
              value={settings.keyDerivation}
              onChange={(e) => handleSettingChange('keyDerivation', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {keyDerivationMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label} - {method.description}
                </option>
              ))}
            </select>
          </div>

          {/* Iterations */}
          {settings.keyDerivation === 'PBKDF2' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                PBKDF2 Iterations
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={settings.iterations}
                  onChange={(e) => handleSettingChange('iterations', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-foreground w-20 text-right">
                  {settings.iterations.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Higher values increase security but slow down encryption
              </p>
            </div>
          )}

          {/* Custom Password */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.useCustomPassword}
                onChange={(e) => handleSettingChange('useCustomPassword', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
              />
              <span className="text-sm font-medium text-foreground">
                Use custom encryption password
              </span>
            </label>
            
            {settings.useCustomPassword && (
              <div className="pl-6">
                <input
                  type="password"
                  placeholder="Enter encryption password"
                  value={settings.customPassword}
                  onChange={(e) => handleSettingChange('customPassword', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  If not set, your wallet will be used for key derivation
                </p>
              </div>
            )}
          </div>

          {/* Backup Settings */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableBackup}
                onChange={(e) => handleSettingChange('enableBackup', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
              />
              <span className="text-sm font-medium text-foreground">
                Enable key backup
              </span>
            </label>

            {settings.enableBackup && (
              <div className="pl-6 space-y-2">
                {backupMethods.map((method) => (
                  <label key={method.value} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="backupMethod"
                      value={method.value}
                      checked={settings.backupMethod === method.value}
                      onChange={(e) => handleSettingChange('backupMethod', e.target.value)}
                      className="mt-0.5 w-4 h-4 text-primary border-border focus:ring-ring"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{method.label}</div>
                      <div className="text-xs text-muted-foreground">{method.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-xs text-warning">
                <p className="font-medium">Important Security Notice</p>
                <p className="mt-1">
                  Your encryption keys are generated locally and never transmitted to our servers. 
                  Without proper backup, lost keys cannot be recovered and your files will be permanently inaccessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptionSettings;