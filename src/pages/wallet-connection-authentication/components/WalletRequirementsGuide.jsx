import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletRequirementsGuide = () => {
  const requirements = [
    {
      id: 'metamask',
      title: 'MetaMask Browser Extension',
      description: 'Install the official MetaMask extension for Chrome, Firefox, or Edge',
      status: 'required',
      action: {
        label: 'Install MetaMask',
        url: 'https://metamask.io/download/'
      }
    },
    {
      id: 'ethereum',
      title: 'Ethereum Network',
      description: 'Connect to Ethereum mainnet or supported testnets',
      status: 'automatic',
      action: null
    },
    {
      id: 'backup',
      title: 'Seed Phrase Backup',
      description: 'Ensure your wallet seed phrase is safely backed up',
      status: 'recommended',
      action: null
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'required':
        return { icon: 'AlertCircle', color: 'text-warning' };
      case 'automatic':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'recommended':
        return { icon: 'Info', color: 'text-primary' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'required':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'automatic':
        return 'bg-success/10 text-success border-success/20';
      case 'recommended':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Wallet Requirements</h3>
        <p className="text-sm text-muted-foreground">
          Ensure you have everything needed for secure wallet connection
        </p>
      </div>

      <div className="space-y-4">
        {requirements.map((requirement) => {
          const statusInfo = getStatusIcon(requirement.status);
          return (
            <div
              key={requirement.id}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon
                    name={statusInfo.icon}
                    size={20}
                    className={`${statusInfo.color} mt-0.5`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {requirement.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded border ${getStatusBadge(
                          requirement.status
                        )}`}
                      >
                        {requirement.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {requirement.description}
                    </p>
                  </div>
                </div>
              </div>

              {requirement.action && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(requirement.action.url, '_blank')}
                    iconName="ExternalLink"
                    iconPosition="right"
                  >
                    {requirement.action.label}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
          <div className="text-sm">
            <p className="text-foreground font-medium mb-2">First Time Setup Tips</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="text-accent">•</span>
                <span>Create a new wallet if you don't have one</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-accent">•</span>
                <span>Write down your seed phrase and store it safely</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-accent">•</span>
                <span>You don't need ETH to use the file storage features</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-accent">•</span>
                <span>Your wallet address serves as your unique identifier</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletRequirementsGuide;