import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletConnectionCard = ({ onConnectionSuccess, onConnectionError }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setConnectionStatus('connected');
          if (onConnectionSuccess) {
            onConnectionSuccess(accounts[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setConnectionStatus('connected');
        if (onConnectionSuccess) {
          onConnectionSuccess(accounts[0]);
        }
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to connect wallet. Please try again.';
      setError(errorMessage);
      setConnectionStatus('error');
      if (onConnectionError) {
        onConnectionError(errorMessage);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setConnectionStatus('disconnected');
    setError('');
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success bg-success/10 border-success/20';
      case 'error':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Wallet';
    }
  };

  if (connectionStatus === 'connected') {
    return (
      <div className="w-full max-w-md mx-auto bg-card border border-border rounded-lg p-6 shadow-moderate">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Wallet Connected</h3>
            <p className="text-sm text-muted-foreground">
              Your MetaMask wallet is successfully connected
            </p>
          </div>

          <div className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md border ${getStatusColor()}`}>
            <Icon name={getStatusIcon()} size={16} />
            <span className="text-sm font-mono">{truncateAddress(walletAddress)}</span>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={disconnectWallet}
              iconName="LogOut"
              iconPosition="left"
              className="flex-1"
            >
              Disconnect
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => window.location.href = '/file-storage-dashboard'}
              iconName="ArrowRight"
              iconPosition="right"
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border rounded-lg p-6 shadow-moderate">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="Wallet" size={32} className="text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Connect Your Wallet</h3>
          <p className="text-sm text-muted-foreground">
            Securely authenticate with your MetaMask wallet to access decentralized file storage
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <p className="text-sm text-error">{error}</p>
            </div>
          </div>
        )}

        <Button
          variant="default"
          fullWidth
          onClick={connectWallet}
          loading={isConnecting}
          iconName="Wallet"
          iconPosition="left"
          className="transition-smooth"
        >
          {isConnecting ? 'Connecting...' : 'Connect MetaMask Wallet'}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>
            Don't have MetaMask?{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Install it here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionCard;