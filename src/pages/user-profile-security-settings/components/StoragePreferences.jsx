import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const StoragePreferences = ({ preferences, onPreferencesChange }) => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  const ipfsNodeOptions = [
    { value: 'auto', label: 'Auto-select (Recommended)' },
    { value: 'infura', label: 'Infura IPFS Gateway' },
    { value: 'pinata', label: 'Pinata IPFS Service' },
    { value: 'local', label: 'Local IPFS Node' },
    { value: 'custom', label: 'Custom Gateway' }
  ];

  const pinningStrategyOptions = [
    { value: 'aggressive', label: 'Aggressive (High redundancy)' },
    { value: 'balanced', label: 'Balanced (Recommended)' },
    { value: 'minimal', label: 'Minimal (Cost-effective)' },
    { value: 'custom', label: 'Custom Configuration' }
  ];

  const retentionPolicyOptions = [
    { value: 'permanent', label: 'Permanent (Until manually deleted)' },
    { value: '1year', label: '1 Year' },
    { value: '6months', label: '6 Months' },
    { value: '3months', label: '3 Months' },
    { value: '1month', label: '1 Month' }
  ];

  const storageAnalytics = {
    totalFiles: 1247,
    totalSize: "15.8 GB",
    encryptedFiles: 1247,
    sharedFiles: 89,
    monthlyUploads: 156,
    monthlyDownloads: 423,
    ipfsNodes: 12,
    averageUploadTime: "2.3s",
    redundancyLevel: "98.7%"
  };

  const handlePreferenceChange = (key, value) => {
    onPreferencesChange({ ...preferences, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Storage Preferences</h3>
        <Icon name="Database" size={20} className="text-muted-foreground" />
      </div>

      {/* IPFS Configuration */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-foreground">IPFS Configuration</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="IPFS Node Selection"
            description="Choose your preferred IPFS gateway"
            options={ipfsNodeOptions}
            value={preferences.ipfsNode || 'auto'}
            onChange={(value) => handlePreferenceChange('ipfsNode', value)}
          />
          
          <Select
            label="Pinning Strategy"
            description="File redundancy and availability settings"
            options={pinningStrategyOptions}
            value={preferences.pinningStrategy || 'balanced'}
            onChange={(value) => handlePreferenceChange('pinningStrategy', value)}
          />
        </div>

        <div className="space-y-3">
          <Checkbox
            label="Auto-pin important files"
            description="Automatically ensure high availability for frequently accessed files"
            checked={preferences.autoPinImportant || true}
            onChange={(e) => handlePreferenceChange('autoPinImportant', e.target.checked)}
          />
          
          <Checkbox
            label="Enable IPFS clustering"
            description="Distribute files across multiple IPFS nodes for better performance"
            checked={preferences.enableClustering || false}
            onChange={(e) => handlePreferenceChange('enableClustering', e.target.checked)}
          />
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-foreground">Data Retention Policy</h4>
        
        <Select
          label="Default Retention Period"
          description="How long files are kept before automatic deletion"
          options={retentionPolicyOptions}
          value={preferences.retentionPolicy || 'permanent'}
          onChange={(value) => handlePreferenceChange('retentionPolicy', value)}
        />

        <div className="space-y-3">
          <Checkbox
            label="Warn before auto-deletion"
            description="Send notifications before files are automatically removed"
            checked={preferences.warnBeforeDeletion || true}
            onChange={(e) => handlePreferenceChange('warnBeforeDeletion', e.target.checked)}
          />
          
          <Checkbox
            label="Archive old files"
            description="Move old files to archive instead of deleting"
            checked={preferences.archiveOldFiles || false}
            onChange={(e) => handlePreferenceChange('archiveOldFiles', e.target.checked)}
          />
        </div>
      </div>

      {/* Storage Analytics */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-foreground">Storage Analytics</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
            iconName={showAnalytics ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAnalytics ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-primary">{storageAnalytics.totalFiles}</div>
            <div className="text-sm text-muted-foreground">Total Files</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-success">{storageAnalytics.totalSize}</div>
            <div className="text-sm text-muted-foreground">Storage Used</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-warning">{storageAnalytics.sharedFiles}</div>
            <div className="text-sm text-muted-foreground">Shared Files</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-accent">{storageAnalytics.redundancyLevel}</div>
            <div className="text-sm text-muted-foreground">Redundancy</div>
          </div>
        </div>

        {showAnalytics && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-lg p-4">
                <h5 className="text-sm font-medium text-foreground mb-3">Monthly Activity</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Uploads</span>
                    <span className="text-sm font-medium">{storageAnalytics.monthlyUploads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Downloads</span>
                    <span className="text-sm font-medium">{storageAnalytics.monthlyDownloads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Upload Time</span>
                    <span className="text-sm font-medium">{storageAnalytics.averageUploadTime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-lg p-4">
                <h5 className="text-sm font-medium text-foreground mb-3">Network Status</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Connected Nodes</span>
                    <span className="text-sm font-medium">{storageAnalytics.ipfsNodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Network Health</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm font-medium text-success">Excellent</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Encryption Status</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Shield" size={12} className="text-success" />
                      <span className="text-sm font-medium text-success">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cost Management */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-foreground">Cost Management</h4>
        
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Estimated Monthly Cost</span>
            <span className="text-lg font-bold text-primary">$12.50</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Storage (15.8 GB)</span>
              <span>$8.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bandwidth (2.1 GB)</span>
              <span>$2.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pinning Services</span>
              <span>$2.00</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Checkbox
            label="Enable cost alerts"
            description="Notify when monthly costs exceed threshold"
            checked={preferences.enableCostAlerts || true}
            onChange={(e) => handlePreferenceChange('enableCostAlerts', e.target.checked)}
          />
          
          <Checkbox
            label="Optimize for cost"
            description="Automatically adjust settings to minimize costs"
            checked={preferences.optimizeForCost || false}
            onChange={(e) => handlePreferenceChange('optimizeForCost', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default StoragePreferences;