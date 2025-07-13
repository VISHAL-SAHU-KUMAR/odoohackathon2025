import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedLinks, onBulkAction, onClearSelection }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (selectedLinks.length === 0) {
    return null;
  }

  const handleBulkAction = async (action) => {
    setIsProcessing(true);
    try {
      if (onBulkAction) {
        await onBulkAction(action, selectedLinks);
      }
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const bulkActions = [
    {
      id: 'extend',
      label: 'Extend Expiry',
      icon: 'Calendar',
      variant: 'outline',
      description: 'Extend expiration date for selected links'
    },
    {
      id: 'password',
      label: 'Add Password',
      icon: 'Lock',
      variant: 'outline',
      description: 'Add password protection to selected links'
    },
    {
      id: 'export',
      label: 'Export',
      icon: 'Download',
      variant: 'outline',
      description: 'Export selected links data'
    },
    {
      id: 'revoke',
      label: 'Revoke All',
      icon: 'XCircle',
      variant: 'destructive',
      description: 'Revoke all selected links'
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-surface border border-border rounded-lg shadow-elevated p-4 min-w-80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">
              {selectedLinks.length} link{selectedLinks.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClearSelection}
            iconName="X"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {bulkActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              size="sm"
              onClick={() => handleBulkAction(action.id)}
              disabled={isProcessing}
              loading={isProcessing && action.id === 'revoke'}
              iconName={action.icon}
              iconPosition="left"
              className="justify-start"
              title={action.description}
            >
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm font-medium text-foreground">
                {selectedLinks.filter(link => link.status === 'active').length}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                {selectedLinks.reduce((sum, link) => sum + link.accessCount, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Access</div>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                {selectedLinks.reduce((sum, link) => sum + link.downloadCount, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Downloads</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;