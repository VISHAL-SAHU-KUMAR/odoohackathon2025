import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletManagement = ({ walletAddress, onWalletAction }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWalletAction = async (action) => {
    setIsConnecting(true);
    try {
      await onWalletAction(action);
    } catch (error) {
      console.error('Wallet action failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Wallet Connection</h3>
        <Icon name="Wallet" size={20} className="text-muted-foreground" />
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Connected Wallet</p>
            <p className="text-sm text-muted-foreground font-mono">{truncateAddress(walletAddress)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-success">Active</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleWalletAction('switch')}
            loading={isConnecting}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Switch Wallet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleWalletAction('copy')}
            iconName="Copy"
            iconPosition="left"
          >
            Copy Address
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleWalletAction('disconnect')}
            iconName="LogOut"
            iconPosition="left"
          >
            Disconnect
          </Button>
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning">Security Notice</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your wallet address serves as your unique identifier. Never share your private keys or seed phrase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletManagement;