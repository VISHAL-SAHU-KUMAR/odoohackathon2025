import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const WalletConnectionIndicator = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('disconnected');

  useEffect(() => {
    checkWalletConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('connect', handleConnect);
      window.ethereum.on('disconnect', handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          setNetworkStatus('connected');
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          setNetworkStatus('connected');
        }
      } else {
        alert('Please install MetaMask to connect your wallet');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setNetworkStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setNetworkStatus('disconnected');
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      setNetworkStatus('connected');
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const handleConnect = () => {
    setNetworkStatus('connected');
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = () => {
    switch (networkStatus) {
      case 'connected':
        return 'text-success bg-success/10 border-success/20';
      case 'error':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = () => {
    switch (networkStatus) {
      case 'connected':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  if (!isConnected) {
    return (
      <div className={`flex items-center ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={connectWallet}
          loading={isConnecting}
          iconName="Wallet"
          iconPosition="left"
          className="transition-smooth"
        >
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {/* Desktop View */}
      <div className="hidden sm:flex items-center space-x-2">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border transition-smooth ${getStatusColor()}`}>
          <div className="flex items-center space-x-1">
            <Icon name={getStatusIcon()} size={12} />
            <span className="text-xs font-medium">
              {networkStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="h-3 w-px bg-current opacity-30"></div>
          <span className="text-sm font-mono">{truncateAddress(walletAddress)}</span>
          <Button
            variant="ghost"
            size="xs"
            onClick={disconnectWallet}
            iconName="X"
            className="hover:bg-current hover:bg-opacity-10"
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden flex items-center space-x-2">
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md border transition-smooth ${getStatusColor()}`}>
          <Icon name={getStatusIcon()} size={12} />
          <Icon name="Wallet" size={14} />
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={disconnectWallet}
          iconName="LogOut"
        />
      </div>
    </div>
  );
};

export default WalletConnectionIndicator;