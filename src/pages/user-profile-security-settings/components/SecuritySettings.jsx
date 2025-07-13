import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const SecuritySettings = ({ settings, onSettingsChange }) => {
  const [showAuditLog, setShowAuditLog] = useState(false);

  const sessionTimeoutOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '240', label: '4 hours' },
    { value: '480', label: '8 hours' },
    { value: 'never', label: 'Never (Not recommended)' }
  ];

  const auditLogData = [
    {
      id: 1,
      action: "File uploaded",
      details: "document.pdf (2.3 MB)",
      timestamp: "2025-01-13 10:45:23",
      ipAddress: "192.168.1.100",
      status: "success"
    },
    {
      id: 2,
      action: "Wallet connected",
      details: "MetaMask wallet authentication",
      timestamp: "2025-01-13 09:30:15",
      ipAddress: "192.168.1.100",
      status: "success"
    },
    {
      id: 3,
      action: "Share link created",
      details: "presentation.pptx - 7 days expiry",
      timestamp: "2025-01-12 16:22:41",
      ipAddress: "192.168.1.100",
      status: "success"
    },
    {
      id: 4,
      action: "Failed login attempt",
      details: "Invalid wallet signature",
      timestamp: "2025-01-12 14:15:33",
      ipAddress: "203.0.113.45",
      status: "failed"
    },
    {
      id: 5,
      action: "File downloaded",
      details: "report.xlsx via share link",
      timestamp: "2025-01-12 11:08:17",
      ipAddress: "198.51.100.23",
      status: "success"
    }
  ];

  const handleSettingChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Security Settings</h3>
        <Icon name="Shield" size={20} className="text-muted-foreground" />
      </div>

      {/* Session Management */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-foreground">Session Management</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Session Timeout"
            description="Automatically log out after inactivity"
            options={sessionTimeoutOptions}
            value={settings.sessionTimeout || '60'}
            onChange={(value) => handleSettingChange('sessionTimeout', value)}
          />
          
          <div className="space-y-3">
            <Checkbox
              label="Remember this device"
              description="Skip wallet connection on trusted devices"
              checked={settings.rememberDevice || false}
              onChange={(e) => handleSettingChange('rememberDevice', e.target.checked)}
            />
            
            <Checkbox
              label="Require confirmation for sensitive actions"
              description="Additional verification for file deletion and key changes"
              checked={settings.requireConfirmation || true}
              onChange={(e) => handleSettingChange('requireConfirmation', e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-foreground">Two-Factor Authentication</h4>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-sm text-warning">Not Configured</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Add an extra layer of security for sensitive operations like key management and file sharing.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Smartphone"
            iconPosition="left"
          >
            Setup Authenticator App
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Mail"
            iconPosition="left"
          >
            Setup Email 2FA
          </Button>
        </div>
      </div>

      {/* Activity Monitoring */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-foreground">Activity Monitoring</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAuditLog(!showAuditLog)}
            iconName={showAuditLog ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAuditLog ? 'Hide' : 'View'} Audit Log
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-surface border border-border rounded-lg p-3">
            <div className="text-2xl font-bold text-success">24</div>
            <div className="text-sm text-muted-foreground">Successful Logins</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3">
            <div className="text-2xl font-bold text-warning">2</div>
            <div className="text-sm text-muted-foreground">Failed Attempts</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Total Actions</div>
          </div>
        </div>

        {showAuditLog && (
          <div className="mt-4 space-y-2">
            <h5 className="text-sm font-medium text-foreground">Recent Activity</h5>
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {auditLogData.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border-b border-border last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={entry.status === 'success' ? 'CheckCircle' : 'XCircle'} 
                        size={16} 
                        className={entry.status === 'success' ? 'text-success' : 'text-error'} 
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{entry.action}</p>
                        <p className="text-xs text-muted-foreground">{entry.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                      <p className="text-xs text-muted-foreground font-mono">{entry.ipAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Access */}
      <div className="bg-error/10 border border-error/20 rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Icon name="AlertTriangle" size={20} className="text-error" />
          <h4 className="text-md font-medium text-error">Emergency Access</h4>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Configure emergency access procedures in case you lose access to your wallet or encryption keys.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Key"
            iconPosition="left"
          >
            Setup Recovery Keys
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Users"
            iconPosition="left"
          >
            Trusted Contacts
          </Button>
          <Button
            variant="destructive"
            size="sm"
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;