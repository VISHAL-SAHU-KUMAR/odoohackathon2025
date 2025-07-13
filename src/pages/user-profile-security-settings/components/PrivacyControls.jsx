import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const PrivacyControls = ({ settings, onSettingsChange }) => {
  const dataRetentionOptions = [
    { value: 'minimal', label: 'Minimal (Required data only)' },
    { value: 'standard', label: 'Standard (Recommended)' },
    { value: 'extended', label: 'Extended (Full analytics)' }
  ];

  const analyticsLevelOptions = [
    { value: 'none', label: 'No analytics' },
    { value: 'basic', label: 'Basic usage only' },
    { value: 'standard', label: 'Standard analytics' },
    { value: 'detailed', label: 'Detailed insights' }
  ];

  const handleSettingChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleExportData = () => {
    // Mock data export
    const exportData = {
      profile: {
        walletAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        createdAt: "2024-12-15T10:30:00Z",
        lastLogin: "2025-01-13T11:23:34Z"
      },
      files: {
        totalFiles: 1247,
        totalSize: "15.8 GB",
        uploadHistory: "Available in detailed export"
      },
      sharing: {
        totalShares: 89,
        activeLinks: 23,
        shareHistory: "Available in detailed export"
      },
      settings: settings
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securevault-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Privacy Controls</h3>
        <Icon name="Eye" size={20} className="text-muted-foreground" />
      </div>

      {/* Data Collection */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-foreground">Data Collection</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Data Retention Level"
            description="How much data we store about your usage"
            options={dataRetentionOptions}
            value={settings.dataRetention || 'standard'}
            onChange={(value) => handleSettingChange('dataRetention', value)}
          />
          
          <Select
            label="Analytics Level"
            description="Level of usage analytics collected"
            options={analyticsLevelOptions}
            value={settings.analyticsLevel || 'basic'}
            onChange={(value) => handleSettingChange('analyticsLevel', value)}
          />
        </div>

        <div className="space-y-3">
          <Checkbox
            label="Collect usage statistics"
            description="Help improve the service by sharing anonymous usage data"
            checked={settings.collectUsageStats || true}
            onChange={(e) => handleSettingChange('collectUsageStats', e.target.checked)}
          />
          
          <Checkbox
            label="Performance monitoring"
            description="Allow collection of performance metrics for optimization"
            checked={settings.performanceMonitoring || true}
            onChange={(e) => handleSettingChange('performanceMonitoring', e.target.checked)}
          />
          
          <Checkbox
            label="Error reporting"
            description="Automatically send error reports to help fix issues"
            checked={settings.errorReporting || true}
            onChange={(e) => handleSettingChange('errorReporting', e.target.checked)}
          />
        </div>
      </div>

      {/* Data Sharing */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-foreground">Data Sharing</h4>
        
        <div className="space-y-3">
          <Checkbox
            label="Share aggregated statistics"
            description="Allow sharing of anonymized, aggregated usage statistics"
            checked={settings.shareAggregatedStats || false}
            onChange={(e) => handleSettingChange('shareAggregatedStats', e.target.checked)}
          />
          
          <Checkbox
            label="Participate in research"
            description="Allow use of anonymized data for research purposes"
            checked={settings.participateInResearch || false}
            onChange={(e) => handleSettingChange('participateInResearch', e.target.checked)}
          />
          
          <Checkbox
            label="Third-party integrations"
            description="Allow data sharing with approved third-party services"
            checked={settings.thirdPartyIntegrations || false}
            onChange={(e) => handleSettingChange('thirdPartyIntegrations', e.target.checked)}
          />
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Privacy Notice</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your files are always encrypted client-side. We never have access to your file contents or encryption keys.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Rights */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-foreground">Your Data Rights</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Download" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Data Export</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Download all your data in a portable format
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              iconName="Download"
              iconPosition="left"
              fullWidth
            >
              Export My Data
            </Button>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Trash2" size={16} className="text-error" />
              <span className="text-sm font-medium text-foreground">Data Deletion</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Request deletion of all your personal data
            </p>
            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              fullWidth
            >
              Delete My Data
            </Button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="FileText" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Data Processing Record</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            View detailed information about how your data is processed
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account created:</span>
              <span>December 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last data export:</span>
              <span>Never</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data retention period:</span>
              <span>Until account deletion</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing legal basis:</span>
              <span>Legitimate interest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Preferences */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-foreground">Cookie Preferences</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Essential cookies</p>
              <p className="text-xs text-muted-foreground">Required for basic functionality</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Always enabled</span>
              <Icon name="Check" size={16} className="text-success" />
            </div>
          </div>
          
          <Checkbox
            label="Analytics cookies"
            description="Help us understand how you use the service"
            checked={settings.analyticsCookies || true}
            onChange={(e) => handleSettingChange('analyticsCookies', e.target.checked)}
          />
          
          <Checkbox
            label="Performance cookies"
            description="Improve loading times and user experience"
            checked={settings.performanceCookies || true}
            onChange={(e) => handleSettingChange('performanceCookies', e.target.checked)}
          />
          
          <Checkbox
            label="Functional cookies"
            description="Remember your preferences and settings"
            checked={settings.functionalCookies || true}
            onChange={(e) => handleSettingChange('functionalCookies', e.target.checked)}
          />
        </div>
      </div>

      {/* Contact & Support */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="HelpCircle" size={20} className="text-primary" />
          <h4 className="text-md font-medium text-foreground">Privacy Questions?</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Have questions about your privacy or data handling? We're here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="FileText"
            iconPosition="left"
          >
            Privacy Policy
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Mail"
            iconPosition="left"
          >
            Contact Privacy Team
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="ExternalLink"
            iconPosition="left"
          >
            Data Protection FAQ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyControls;