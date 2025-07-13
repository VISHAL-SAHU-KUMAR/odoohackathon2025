import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ContextualActionBar = ({ selectedFiles = [], onAction, className = '' }) => {
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const getContextualActions = () => {
    const currentPath = location.pathname;
    const hasSelection = selectedFiles.length > 0;
    const multipleSelected = selectedFiles.length > 1;

    switch (currentPath) {
      case '/file-storage-dashboard':
        return [
          {
            id: 'upload',
            label: 'Upload Files',
            icon: 'Upload',
            variant: 'default',
            show: true,
            primary: true
          },
          {
            id: 'create-folder',
            label: 'New Folder',
            icon: 'FolderPlus',
            variant: 'outline',
            show: true
          },
          {
            id: 'share',
            label: hasSelection ? `Share ${multipleSelected ? 'Files' : 'File'}` : 'Share',
            icon: 'Share2',
            variant: 'outline',
            show: hasSelection,
            disabled: !hasSelection
          },
          {
            id: 'download',
            label: hasSelection ? `Download ${multipleSelected ? 'Files' : 'File'}` : 'Download',
            icon: 'Download',
            variant: 'outline',
            show: hasSelection,
            disabled: !hasSelection
          },
          {
            id: 'delete',
            label: hasSelection ? `Delete ${multipleSelected ? 'Files' : 'File'}` : 'Delete',
            icon: 'Trash2',
            variant: 'destructive',
            show: hasSelection,
            disabled: !hasSelection
          }
        ];

      case '/file-upload-interface':
        return [
          {
            id: 'select-files',
            label: 'Select Files',
            icon: 'FileText',
            variant: 'default',
            show: true,
            primary: true
          },
          {
            id: 'select-folder',
            label: 'Select Folder',
            icon: 'Folder',
            variant: 'outline',
            show: true
          },
          {
            id: 'encryption-settings',
            label: 'Encryption',
            icon: 'Shield',
            variant: 'outline',
            show: true
          },
          {
            id: 'upload-settings',
            label: 'Settings',
            icon: 'Settings',
            variant: 'ghost',
            show: true
          }
        ];

      case '/file-sharing-link-management':
        return [
          {
            id: 'create-share-link',
            label: 'Create Link',
            icon: 'Link',
            variant: 'default',
            show: true,
            primary: true
          },
          {
            id: 'bulk-manage',
            label: 'Bulk Actions',
            icon: 'MoreHorizontal',
            variant: 'outline',
            show: hasSelection,
            disabled: !hasSelection
          },
          {
            id: 'export-links',
            label: 'Export',
            icon: 'Download',
            variant: 'outline',
            show: true
          },
          {
            id: 'revoke-selected',
            label: hasSelection ? `Revoke ${multipleSelected ? 'Links' : 'Link'}` : 'Revoke',
            icon: 'XCircle',
            variant: 'destructive',
            show: hasSelection,
            disabled: !hasSelection
          }
        ];

      case '/file-organization-search':
        return [
          {
            id: 'advanced-search',
            label: 'Advanced Search',
            icon: 'Search',
            variant: 'default',
            show: true,
            primary: true
          },
          {
            id: 'create-tag',
            label: 'New Tag',
            icon: 'Tag',
            variant: 'outline',
            show: true
          },
          {
            id: 'organize',
            label: hasSelection ? `Organize ${multipleSelected ? 'Files' : 'File'}` : 'Organize',
            icon: 'Archive',
            variant: 'outline',
            show: hasSelection,
            disabled: !hasSelection
          },
          {
            id: 'bulk-tag',
            label: 'Add Tags',
            icon: 'Tags',
            variant: 'outline',
            show: hasSelection,
            disabled: !hasSelection
          }
        ];

      case '/user-profile-security-settings':
        return [
          {
            id: 'backup-keys',
            label: 'Backup Keys',
            icon: 'Key',
            variant: 'default',
            show: true,
            primary: true
          },
          {
            id: 'export-data',
            label: 'Export Data',
            icon: 'Download',
            variant: 'outline',
            show: true
          },
          {
            id: 'security-audit',
            label: 'Security Audit',
            icon: 'Shield',
            variant: 'outline',
            show: true
          },
          {
            id: 'reset-settings',
            label: 'Reset Settings',
            icon: 'RotateCcw',
            variant: 'destructive',
            show: true
          }
        ];

      default:
        return [];
    }
  };

  const handleAction = async (actionId) => {
    setIsProcessing(true);
    try {
      if (onAction) {
        await onAction(actionId, selectedFiles);
      }
      
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const actions = getContextualActions().filter(action => action.show);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between bg-surface border-b border-border px-4 py-3 ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Primary Actions */}
        <div className="flex items-center space-x-2">
          {actions
            .filter(action => action.primary)
            .map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={() => handleAction(action.id)}
                disabled={action.disabled || isProcessing}
                loading={isProcessing && action.primary}
                iconName={action.icon}
                iconPosition="left"
                className="transition-smooth"
              >
                {action.label}
              </Button>
            ))}
        </div>

        {/* Secondary Actions */}
        <div className="hidden sm:flex items-center space-x-1">
          {actions
            .filter(action => !action.primary)
            .slice(0, 3)
            .map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                onClick={() => handleAction(action.id)}
                disabled={action.disabled || isProcessing}
                iconName={action.icon}
                iconPosition="left"
                className="transition-smooth"
              >
                <span className="hidden md:inline">{action.label}</span>
              </Button>
            ))}
        </div>

        {/* More Actions Menu for Mobile */}
        {actions.filter(action => !action.primary).length > 3 && (
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              onClick={() => {
                // Handle more actions menu
              }}
            />
          </div>
        )}
      </div>

      {/* Selection Info */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span>
            {selectedFiles.length} {selectedFiles.length === 1 ? 'item' : 'items'} selected
          </span>
        </div>
      )}
    </div>
  );
};

export default ContextualActionBar;