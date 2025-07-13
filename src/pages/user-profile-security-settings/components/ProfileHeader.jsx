import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfileHeader = ({ walletAddress, connectionStatus, lastActivity }) => {
  const truncateAddress = (address) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success bg-success/10 border-success/20';
      case 'disconnected':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-warning bg-warning/10 border-warning/20';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'CheckCircle';
      case 'disconnected':
        return 'XCircle';
      default:
        return 'AlertCircle';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account and security preferences</p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border ${getStatusColor()}`}>
            <Icon name={getStatusIcon()} size={16} />
            <span className="text-sm font-medium capitalize">{connectionStatus}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Wallet" size={14} />
              <span className="font-mono">{truncateAddress(walletAddress)}</span>
            </div>
            {lastActivity && (
              <div className="flex items-center space-x-1 mt-1">
                <Icon name="Clock" size={14} />
                <span>Last active: {lastActivity}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;