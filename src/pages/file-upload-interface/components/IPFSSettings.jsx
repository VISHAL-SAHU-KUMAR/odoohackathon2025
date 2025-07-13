import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IPFSSettings = ({ onSettingsChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    pinningService: 'default',
    enablePinning: true,
    replicationFactor: 3,
    customGateway: '',
    useCustomGateway: false,
    enableRedundancy: true,
    chunkSize: '1MB',
    enableCompression: false
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const pinningServices = [
    { value: 'default', label: 'SecureVault Pinning', description: 'Our managed IPFS nodes' },
    { value: 'pinata', label: 'Pinata', description: 'Third-party pinning service' },
    { value: 'web3storage', label: 'Web3.Storage', description: 'Filecoin-backed storage' },
    { value: 'custom', label: 'Custom Node', description: 'Your own IPFS node' }
  ];

  const chunkSizes = [
    { value: '256KB', label: '256 KB', description: 'Better for slow connections' },
    { value: '1MB', label: '1 MB', description: 'Balanced (recommended)' },
    { value: '4MB', label: '4 MB', description: 'Faster for large files' },
    { value: '16MB', label: '16 MB', description: 'Maximum chunk size' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Globe" size={20} className="text-accent" />
            <h3 className="text-sm font-semibold text-foreground">
              IPFS Storage Settings
            </h3>
            <div className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
              Decentralized
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
          Configure how your encrypted files are stored on the IPFS network.
        </p>
      </div>

      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Pinning Service */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Pinning Service
            </label>
            <div className="space-y-2">
              {pinningServices.map((service) => (
                <label key={service.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pinningService"
                    value={service.value}
                    checked={settings.pinningService === service.value}
                    onChange={(e) => handleSettingChange('pinningService', e.target.value)}
                    className="mt-0.5 w-4 h-4 text-primary border-border focus:ring-ring"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-foreground">{service.label}</div>
                    <div className="text-xs text-muted-foreground">{service.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Gateway */}
          {settings.pinningService === 'custom' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Custom IPFS Node URL
              </label>
              <input
                type="url"
                placeholder="https://your-ipfs-node.com:5001"
                value={settings.customGateway}
                onChange={(e) => handleSettingChange('customGateway', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Enter the API endpoint of your IPFS node
              </p>
            </div>
          )}

          {/* Pinning Options */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enablePinning}
                onChange={(e) => handleSettingChange('enablePinning', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
              />
              <span className="text-sm font-medium text-foreground">
                Enable automatic pinning
              </span>
            </label>
            <p className="text-xs text-muted-foreground pl-6">
              Keeps your files available on the IPFS network even when you're offline
            </p>
          </div>

          {/* Replication Factor */}
          {settings.enablePinning && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Replication Factor: {settings.replicationFactor} nodes
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.replicationFactor}
                  onChange={(e) => handleSettingChange('replicationFactor', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-foreground w-8 text-right">
                  {settings.replicationFactor}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Higher values increase availability but cost more
              </p>
            </div>
          )}

          {/* Chunk Size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Chunk Size
            </label>
            <select
              value={settings.chunkSize}
              onChange={(e) => handleSettingChange('chunkSize', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {chunkSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label} - {size.description}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Options */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableRedundancy}
                onChange={(e) => handleSettingChange('enableRedundancy', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
              />
              <span className="text-sm font-medium text-foreground">
                Enable redundant storage
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableCompression}
                onChange={(e) => handleSettingChange('enableCompression', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
              />
              <span className="text-sm font-medium text-foreground">
                Compress files before encryption
              </span>
            </label>
          </div>

          {/* Storage Cost Estimate */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Estimated Storage Cost
                </span>
              </div>
              <span className="text-sm text-foreground">
                ~$0.02/GB/month
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on current settings and network rates
            </p>
          </div>

          {/* IPFS Status */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
              <div className="text-xs text-success">
                <p className="font-medium">IPFS Network Status: Online</p>
                <p className="mt-1">
                  Connected to 247 peers • Average upload speed: 2.3 MB/s
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPFSSettings;