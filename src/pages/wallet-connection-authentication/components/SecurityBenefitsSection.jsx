import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBenefitsSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const benefits = [
    {
      id: 'decentralized',
      title: 'Decentralized Security',
      icon: 'Shield',
      summary: 'Your files are stored on IPFS with no central point of failure',
      details: `Files are distributed across multiple IPFS nodes worldwide, ensuring high availability and resistance to censorship. No single entity controls your data, giving you complete ownership and sovereignty over your files.`
    },
    {
      id: 'encryption',
      title: 'End-to-End Encryption',
      icon: 'Lock',
      summary: 'AES encryption performed in your browser before upload',
      details: `All files are encrypted using AES-256 encryption directly in your browser before being uploaded to IPFS. Your encryption keys never leave your device, ensuring only you can access your files.`
    },
    {
      id: 'blockchain',
      title: 'Blockchain Authentication',
      icon: 'Key',
      summary: 'Secure wallet-based identity without passwords',
      details: `Authentication is handled through your MetaMask wallet using cryptographic signatures. No passwords to remember or accounts to manage - your wallet is your identity.`
    },
    {
      id: 'privacy',
      title: 'Complete Privacy',
      icon: 'Eye',
      summary: 'Zero-knowledge architecture protects your data',
      details: `We cannot see your files, access your data, or track your activity. The application runs entirely in your browser with no server-side data collection or storage.`
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Why Choose Decentralized Storage?</h3>
        <p className="text-sm text-muted-foreground">
          Learn about the security and privacy benefits of blockchain-based file storage
        </p>
      </div>

      <div className="space-y-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="bg-card border border-border rounded-lg overflow-hidden transition-smooth"
          >
            <button
              onClick={() => toggleSection(benefit.id)}
              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                    <Icon name={benefit.icon} size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground">{benefit.summary}</p>
                  </div>
                </div>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-muted-foreground transition-transform ${
                    expandedSection === benefit.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            
            {expandedSection === benefit.id && (
              <div className="px-4 pb-4 border-t border-border bg-muted/20">
                <p className="text-sm text-muted-foreground pt-3 leading-relaxed">
                  {benefit.details}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm">
            <p className="text-foreground font-medium mb-1">Open Source & Transparent</p>
            <p className="text-muted-foreground">
              Our code is open source and auditable. You can verify our security claims and contribute to the project on GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityBenefitsSection;