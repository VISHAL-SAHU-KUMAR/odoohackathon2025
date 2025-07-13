import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignalsSection = () => {
  const trustSignals = [
    {
      id: 'opensource',
      icon: 'Code',
      title: 'Open Source',
      description: 'Fully auditable code on GitHub',
      link: '#',
      badge: 'Verified'
    },
    {
      id: 'blockchain',
      icon: 'Shield',
      title: 'Blockchain Secured',
      description: 'Ethereum-based authentication',
      link: null,
      badge: 'Decentralized'
    },
    {
      id: 'encryption',
      icon: 'Lock',
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption standard',
      link: null,
      badge: 'Secure'
    },
    {
      id: 'ipfs',
      icon: 'Globe',
      title: 'IPFS Network',
      description: 'Distributed file storage protocol',
      link: 'https://ipfs.io',
      badge: 'Distributed'
    }
  ];

  const stats = [
    {
      label: 'Files Encrypted',
      value: '1M+',
      icon: 'FileText'
    },
    {
      label: 'Active Users',
      value: '50K+',
      icon: 'Users'
    },
    {
      label: 'Uptime',
      value: '99.9%',
      icon: 'Activity'
    },
    {
      label: 'Data Breaches',
      value: '0',
      icon: 'Shield'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Trust Signals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustSignals.map((signal) => (
          <div
            key={signal.id}
            className="bg-card border border-border rounded-lg p-4 text-center space-y-3 hover:shadow-moderate transition-smooth"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name={signal.icon} size={24} className="text-primary" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <h4 className="text-sm font-semibold text-foreground">{signal.title}</h4>
                {signal.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-success/10 text-success rounded border border-success/20">
                    {signal.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{signal.description}</p>
            </div>

            {signal.link && (
              <button
                onClick={() => window.open(signal.link, '_blank')}
                className="text-xs text-primary hover:underline flex items-center justify-center space-x-1"
              >
                <span>Learn more</span>
                <Icon name="ExternalLink" size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Security Stats */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Security by Numbers</h3>
          <p className="text-sm text-muted-foreground">
            Trusted by thousands of users worldwide for secure file storage
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name={stat.icon} size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Certifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="text-success" />
            <span>Zero-Knowledge Architecture</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border"></div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Lock" size={16} className="text-success" />
            <span>Client-Side Encryption</span>
          </div>
          <div className="hidden lg:block h-4 w-px bg-border"></div>
          <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Globe" size={16} className="text-success" />
            <span>Decentralized Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignalsSection;