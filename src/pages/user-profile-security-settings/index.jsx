import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProfileHeader from './components/ProfileHeader';
import WalletManagement from './components/WalletManagement';
import EncryptionKeyManagement from './components/EncryptionKeyManagement';
import SecuritySettings from './components/SecuritySettings';
import StoragePreferences from './components/StoragePreferences';
import NotificationPreferences from './components/NotificationPreferences';
import PrivacyControls from './components/PrivacyControls';

const UserProfileSecuritySettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user data
  const [userProfile] = useState({
    walletAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    connectionStatus: "connected",
    lastActivity: "2 minutes ago",
    accountCreated: "December 15, 2024",
    totalFiles: 1247,
    storageUsed: "15.8 GB"
  });

  // Settings state
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '60',
    rememberDevice: false,
    requireConfirmation: true,
    twoFactorEnabled: false
  });

  const [storagePreferences, setStoragePreferences] = useState({
    ipfsNode: 'auto',
    pinningStrategy: 'balanced',
    retentionPolicy: 'permanent',
    autoPinImportant: true,
    enableClustering: false,
    warnBeforeDeletion: true,
    archiveOldFiles: false,
    enableCostAlerts: true,
    optimizeForCost: false
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    defaultFrequency: 'immediate',
    browserNotifications: true,
    emailNotifications: false,
    uploadSuccess: true,
    uploadFailed: true,
    uploadProgress: false,
    shareCreated: true,
    shareAccessed: true,
    shareExpired: true,
    shareDownloaded: false,
    loginSuccess: false,
    loginFailed: true,
    walletChanged: true,
    keyBackup: true,
    storageQuota: true,
    fileExpiry: true,
    ipfsStatus: false,
    maintenanceAlerts: true,
    enableQuietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataRetention: 'standard',
    analyticsLevel: 'basic',
    collectUsageStats: true,
    performanceMonitoring: true,
    errorReporting: true,
    shareAggregatedStats: false,
    participateInResearch: false,
    thirdPartyIntegrations: false,
    analyticsCookies: true,
    performanceCookies: true,
    functionalCookies: true
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: 'User', description: 'Wallet and profile settings' },
    { id: 'security', label: 'Security', icon: 'Shield', description: 'Authentication and access control' },
    { id: 'storage', label: 'Storage', icon: 'Database', description: 'IPFS and storage preferences' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell', description: 'Alert and notification settings' },
    { id: 'privacy', label: 'Privacy', icon: 'Eye', description: 'Data and privacy controls' }
  ];

  useEffect(() => {
    // Request notification permission if browser notifications are enabled
    if (notificationPreferences.browserNotifications && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notificationPreferences.browserNotifications]);

  const handleWalletAction = async (action) => {
    switch (action) {
      case 'switch':
        try {
          if (window.ethereum) {
            await window.ethereum.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }]
            });
          }
        } catch (error) {
          console.error('Failed to switch wallet:', error);
        }
        break;
      case 'copy':
        navigator.clipboard.writeText(userProfile.walletAddress);
        // Show success notification
        if (notificationPreferences.browserNotifications && Notification.permission === 'granted') {
          new Notification('Address Copied', {
            body: 'Wallet address copied to clipboard',
            icon: '/favicon.ico'
          });
        }
        break;
      case 'disconnect':
        // Handle wallet disconnection
        navigate('/wallet-connection-authentication');
        break;
      default:
        break;
    }
  };

  const handleKeyAction = async (action, data) => {
    switch (action) {
      case 'backup':
        // Mock key backup process
        const keyData = {
          encryptedKeys: "mock_encrypted_key_data_" + Date.now(),
          timestamp: new Date().toISOString(),
          walletAddress: userProfile.walletAddress
        };
        
        const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `securevault-keys-backup-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        break;
      case 'import':
        // Mock key import process
        console.log('Importing keys:', data);
        break;
      case 'generate':
        // Mock key generation
        console.log('Generating new encryption keys');
        break;
      default:
        break;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <WalletManagement 
              walletAddress={userProfile.walletAddress}
              onWalletAction={handleWalletAction}
            />
            <EncryptionKeyManagement onKeyAction={handleKeyAction} />
          </div>
        );
      case 'security':
        return (
          <SecuritySettings 
            settings={securitySettings}
            onSettingsChange={setSecuritySettings}
          />
        );
      case 'storage':
        return (
          <StoragePreferences 
            preferences={storagePreferences}
            onPreferencesChange={setStoragePreferences}
          />
        );
      case 'notifications':
        return (
          <NotificationPreferences 
            preferences={notificationPreferences}
            onPreferencesChange={setNotificationPreferences}
          />
        );
      case 'privacy':
        return (
          <PrivacyControls 
            settings={privacySettings}
            onSettingsChange={setPrivacySettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileHeader 
          walletAddress={userProfile.walletAddress}
          connectionStatus={userProfile.connectionStatus}
          lastActivity={userProfile.lastActivity}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-surface border border-border rounded-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-left transition-smooth ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-subtle'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon 
                      name={tab.icon} 
                      size={20} 
                      className={activeTab === tab.id ? 'text-primary-foreground' : 'text-current'}
                    />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className={`text-xs ${
                        activeTab === tab.id 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Tab Selector */}
          <div className="lg:hidden">
            <div className="bg-surface border border-border rounded-lg p-4 mb-6">
              <Button
                variant="outline"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                iconName={isMobileMenuOpen ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
                fullWidth
                className="justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Icon name={tabs.find(tab => tab.id === activeTab)?.icon} size={16} />
                  <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
                </div>
              </Button>
              
              {isMobileMenuOpen && (
                <div className="mt-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-left transition-smooth ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className={`text-xs ${
                          activeTab === tab.id 
                            ? 'text-primary-foreground/80' 
                            : 'text-muted-foreground'
                        }`}>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-surface border border-border rounded-lg p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="mt-8 bg-error/10 border border-error/20 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name="AlertTriangle" size={24} className="text-error" />
            <div>
              <h3 className="text-lg font-medium text-error">Emergency Actions</h3>
              <p className="text-sm text-muted-foreground">
                Critical actions that will affect your account permanently
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="destructive"
              iconName="LogOut"
              iconPosition="left"
              onClick={() => navigate('/wallet-connection-authentication')}
            >
              Secure Logout
            </Button>
            <Button
              variant="outline"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => {
                setSecuritySettings({
                  sessionTimeout: '60',
                  rememberDevice: false,
                  requireConfirmation: true,
                  twoFactorEnabled: false
                });
                setStoragePreferences({
                  ipfsNode: 'auto',
                  pinningStrategy: 'balanced',
                  retentionPolicy: 'permanent',
                  autoPinImportant: true,
                  enableClustering: false,
                  warnBeforeDeletion: true,
                  archiveOldFiles: false,
                  enableCostAlerts: true,
                  optimizeForCost: false
                });
              }}
            >
              Reset All Settings
            </Button>
            <Button
              variant="destructive"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  console.log('Account deletion requested');
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSecuritySettings;