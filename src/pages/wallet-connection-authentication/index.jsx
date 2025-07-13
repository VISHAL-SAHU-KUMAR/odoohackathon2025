import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import WalletConnectionCard from './components/WalletConnectionCard';
import SecurityBenefitsSection from './components/SecurityBenefitsSection';
import WalletRequirementsGuide from './components/WalletRequirementsGuide';
import TrustSignalsSection from './components/TrustSignalsSection';

const WalletConnectionAuthentication = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('connect');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  useEffect(() => {
    // Check if user is already connected and redirect
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsConnected(true);
            // Auto-redirect after 2 seconds if already connected
            setTimeout(() => {
              navigate('/file-storage-dashboard');
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, [navigate]);

  const handleConnectionSuccess = (walletAddress) => {
    setIsConnected(true);
    setConnectionError('');
    console.log('Wallet connected:', walletAddress);
    
    // Redirect to dashboard after successful connection
    setTimeout(() => {
      navigate('/file-storage-dashboard');
    }, 1500);
  };

  const handleConnectionError = (error) => {
    setConnectionError(error);
    setIsConnected(false);
  };

  const tabs = [
    { id: 'connect', label: 'Connect Wallet', icon: 'Wallet' },
    { id: 'benefits', label: 'Security Benefits', icon: 'Shield' },
    { id: 'requirements', label: 'Requirements', icon: 'CheckCircle' },
    { id: 'trust', label: 'Trust & Security', icon: 'Award' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="border-b border-border bg-surface">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Shield" size={20} color="white" />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-semibold text-foreground">SecureVault</h1>
                <p className="text-xs text-muted-foreground">Decentralized File Storage</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Welcome to Decentralized Storage
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect your MetaMask wallet to access secure, encrypted file storage powered by blockchain technology and IPFS.
            </p>
          </div>

          {/* Connection Status Alert */}
          {isConnected && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={20} />
                <span className="font-medium">Wallet Connected Successfully!</span>
              </div>
              <p className="text-sm text-success/80 mt-1">
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {connectionError && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-error">
                <Icon name="AlertCircle" size={20} />
                <span className="font-medium">Connection Failed</span>
              </div>
              <p className="text-sm text-error/80 mt-1">{connectionError}</p>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-muted rounded-lg p-1 inline-flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                    activeTab === tab.id
                      ? 'bg-surface text-foreground shadow-subtle'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'connect' && (
              <div className="space-y-8">
                <WalletConnectionCard
                  onConnectionSuccess={handleConnectionSuccess}
                  onConnectionError={handleConnectionError}
                />
                
                {/* Quick Benefits Preview */}
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-card border border-border rounded-lg">
                      <Icon name="Shield" size={24} className="text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-foreground">Secure</h4>
                      <p className="text-xs text-muted-foreground">End-to-end encryption</p>
                    </div>
                    <div className="text-center p-4 bg-card border border-border rounded-lg">
                      <Icon name="Globe" size={24} className="text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-foreground">Decentralized</h4>
                      <p className="text-xs text-muted-foreground">IPFS distributed storage</p>
                    </div>
                    <div className="text-center p-4 bg-card border border-border rounded-lg">
                      <Icon name="Key" size={24} className="text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-foreground">Private</h4>
                      <p className="text-xs text-muted-foreground">You own your keys</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'benefits' && <SecurityBenefitsSection />}
            {activeTab === 'requirements' && <WalletRequirementsGuide />}
            {activeTab === 'trust' && <TrustSignalsSection />}
          </div>

          {/* Footer Information */}
          <div className="mt-16 text-center space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={14} />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Code" size={14} />
                <span>Open Source</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Globe" size={14} />
                <span>Decentralized</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              By connecting your wallet, you agree to our terms of service and privacy policy. 
              Your data remains encrypted and private at all times.
            </p>
            
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} SecureVault. Built with ❤️ for Web3.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletConnectionAuthentication;