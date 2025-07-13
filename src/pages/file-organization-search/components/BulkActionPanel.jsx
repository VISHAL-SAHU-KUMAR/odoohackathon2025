import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const BulkActionPanel = ({ 
  selectedFiles = [], 
  onBulkAction, 
  onClose, 
  className = '' 
}) => {
  const [activeAction, setActiveAction] = useState('');
  const [targetFolder, setTargetFolder] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const folderOptions = [
    { value: '', label: 'Select destination folder' },
    { value: '/documents', label: 'Documents' },
    { value: '/documents/work', label: 'Documents > Work' },
    { value: '/documents/personal', label: 'Documents > Personal' },
    { value: '/images', label: 'Images' },
    { value: '/images/photos', label: 'Images > Photos' },
    { value: '/images/screenshots', label: 'Images > Screenshots' },
    { value: '/videos', label: 'Videos' },
    { value: '/archives', label: 'Archives' }
  ];

  const bulkActions = [
    {
      id: 'move',
      label: 'Move to Folder',
      icon: 'FolderOpen',
      description: 'Move selected files to a different folder',
      requiresFolder: true
    },
    {
      id: 'copy',
      label: 'Copy to Folder',
      icon: 'Copy',
      description: 'Create copies in a different folder',
      requiresFolder: true
    },
    {
      id: 'tag',
      label: 'Add Tags',
      icon: 'Tag',
      description: 'Add tags to selected files',
      requiresTags: true
    },
    {
      id: 'encrypt',
      label: 'Encrypt Files',
      icon: 'Shield',
      description: 'Apply encryption to unencrypted files'
    },
    {
      id: 'share',
      label: 'Create Share Links',
      icon: 'Share2',
      description: 'Generate sharing links for selected files'
    },
    {
      id: 'download',
      label: 'Download as Archive',
      icon: 'Download',
      description: 'Download all selected files as a ZIP archive'
    },
    {
      id: 'delete',
      label: 'Delete Files',
      icon: 'Trash2',
      description: 'Permanently delete selected files',
      destructive: true
    }
  ];

  const handleActionSelect = (actionId) => {
    setActiveAction(actionId);
    setTargetFolder('');
    setNewTags('');
  };

  const handleExecuteAction = async () => {
    if (!activeAction) return;

    const action = bulkActions.find(a => a.id === activeAction);
    if (!action) return;

    // Validate required fields
    if (action.requiresFolder && !targetFolder) {
      alert('Please select a destination folder');
      return;
    }

    if (action.requiresTags && !newTags.trim()) {
      alert('Please enter tags to add');
      return;
    }

    setIsProcessing(true);

    try {
      const actionData = {
        action: activeAction,
        files: selectedFiles,
        targetFolder: targetFolder,
        tags: newTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (onBulkAction) {
        await onBulkAction(actionData);
      }

      // Reset form
      setActiveAction('');
      setTargetFolder('');
      setNewTags('');
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Action failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getSelectedFilesSummary = () => {
    const totalSize = selectedFiles.reduce((sum, file) => sum + (file.size || 0), 0);
    const formatSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return {
      count: selectedFiles.length,
      totalSize: formatSize(totalSize)
    };
  };

  const summary = getSelectedFilesSummary();

  if (selectedFiles.length === 0) {
    return null;
  }

  return (
    <div className={`bg-surface border border-border rounded-lg shadow-elevated ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="CheckSquare" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">Bulk Actions</h3>
            <p className="text-sm text-muted-foreground">
              {summary.count} files selected ({summary.totalSize})
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={onClose}
        />
      </div>

      {/* Action Selection */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {bulkActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionSelect(action.id)}
              className={`p-3 rounded-lg border text-left transition-smooth ${
                activeAction === action.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : action.destructive
                  ? 'border-error/20 hover:border-error/40 hover:bg-error/5' :'border-border hover:border-primary/40 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name={action.icon} 
                  size={20} 
                  className={
                    activeAction === action.id 
                      ? 'text-primary' 
                      : action.destructive 
                      ? 'text-error' :'text-muted-foreground'
                  } 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Action Configuration */}
        {activeAction && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-foreground">
              Configure {bulkActions.find(a => a.id === activeAction)?.label}
            </h4>

            {/* Folder Selection */}
            {bulkActions.find(a => a.id === activeAction)?.requiresFolder && (
              <Select
                label="Destination Folder"
                options={folderOptions}
                value={targetFolder}
                onChange={setTargetFolder}
                required
              />
            )}

            {/* Tags Input */}
            {bulkActions.find(a => a.id === activeAction)?.requiresTags && (
              <Input
                label="Tags"
                type="text"
                placeholder="Enter tags separated by commas"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                description="Example: work, important, project-alpha"
                required
              />
            )}

            {/* Confirmation for destructive actions */}
            {bulkActions.find(a => a.id === activeAction)?.destructive && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-md">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-error">Warning</div>
                    <div className="text-muted-foreground mt-1">
                      This action cannot be undone. {summary.count} files will be permanently deleted.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setActiveAction('')}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant={bulkActions.find(a => a.id === activeAction)?.destructive ? 'destructive' : 'default'}
                onClick={handleExecuteAction}
                loading={isProcessing}
                iconName={bulkActions.find(a => a.id === activeAction)?.icon}
                iconPosition="left"
              >
                {isProcessing ? 'Processing...' : `Execute Action`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActionPanel;