import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FloatingActionButton = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'upload-files',
      label: 'Upload Files',
      icon: 'Upload',
      action: () => navigate('/file-upload-interface'),
      color: 'bg-primary hover:bg-primary/90'
    },
    {
      id: 'create-folder',
      label: 'New Folder',
      icon: 'FolderPlus',
      action: () => {
        // Handle folder creation
        console.log('Create folder');
      },
      color: 'bg-secondary hover:bg-secondary/90'
    },
    {
      id: 'scan-qr',
      label: 'Scan QR',
      icon: 'QrCode',
      action: () => {
        // Handle QR code scanning
        console.log('Scan QR code');
      },
      color: 'bg-accent hover:bg-accent/90'
    }
  ];

  const handleMainAction = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      navigate('/file-upload-interface');
    }
  };

  const handleQuickAction = (action) => {
    action();
    setIsExpanded(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Quick Actions */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-2">
          {quickActions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="bg-surface border border-border text-foreground px-3 py-1.5 rounded-lg text-sm font-medium shadow-moderate whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={() => handleQuickAction(action.action)}
                className={`w-12 h-12 rounded-full ${action.color} text-white shadow-elevated hover:shadow-lg transition-all duration-200 flex items-center justify-center`}
              >
                <Icon name={action.icon} size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <div className="relative">
        <button
          onClick={handleMainAction}
          className={`w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-elevated hover:shadow-lg transition-all duration-200 flex items-center justify-center ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <Icon name={isExpanded ? "X" : "Plus"} size={24} />
        </button>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-moderate transition-all duration-200 flex items-center justify-center"
        >
          <Icon name={isExpanded ? "ChevronDown" : "ChevronUp"} size={12} />
        </button>
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;