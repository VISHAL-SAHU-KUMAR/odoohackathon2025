import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FileCard = ({ file, onAction, isSelected, onSelect, viewMode = 'grid' }) => {
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = (type) => {
    const iconMap = {
      'image': 'Image',
      'video': 'Video',
      'audio': 'Music',
      'document': 'FileText',
      'pdf': 'FileText',
      'archive': 'Archive',
      'code': 'Code',
      'spreadsheet': 'Table',
      'presentation': 'Presentation'
    };
    return iconMap[type] || 'File';
  };

  const getFileTypeColor = (type) => {
    const colorMap = {
      'image': 'text-blue-600 bg-blue-50',
      'video': 'text-purple-600 bg-purple-50',
      'audio': 'text-green-600 bg-green-50',
      'document': 'text-orange-600 bg-orange-50',
      'pdf': 'text-red-600 bg-red-50',
      'archive': 'text-yellow-600 bg-yellow-50',
      'code': 'text-gray-600 bg-gray-50',
      'spreadsheet': 'text-emerald-600 bg-emerald-50',
      'presentation': 'text-pink-600 bg-pink-50'
    };
    return colorMap[type] || 'text-gray-600 bg-gray-50';
  };

  const handleAction = async (actionType) => {
    setIsLoading(true);
    try {
      if (onAction) {
        await onAction(actionType, file);
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
      setShowActions(false);
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(file.id, !isSelected);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className={`flex items-center space-x-4 p-3 bg-card border border-border rounded-lg hover:shadow-moderate transition-smooth ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        {/* Selection Checkbox */}
        <div className="flex-shrink-0">
          <button
            onClick={handleSelect}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth ${
              isSelected 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-border hover:border-primary'
            }`}
          >
            {isSelected && <Icon name="Check" size={12} />}
          </button>
        </div>

        {/* File Icon/Thumbnail */}
        <div className="flex-shrink-0">
          {file.thumbnail ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image 
                src={file.thumbnail} 
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(file.type)}`}>
              <Icon name={getFileIcon(file.type)} size={20} />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-foreground truncate">{file.name}</h4>
            {file.isEncrypted && (
              <Icon name="Shield" size={14} className="text-success flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <span>{formatDate(file.uploadDate)}</span>
            <span className="capitalize">{file.type}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowActions(!showActions)}
            iconName="MoreVertical"
            className="h-8 w-8"
          />
          
          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-elevated z-10">
              <div className="py-1">
                <button
                  onClick={() => handleAction('download')}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                >
                  <Icon name="Download" size={16} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleAction('share')}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                >
                  <Icon name="Share2" size={16} />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => handleAction('organize')}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                >
                  <Icon name="FolderOpen" size={16} />
                  <span>Organize</span>
                </button>
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={() => handleAction('delete')}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error hover:bg-error/10 transition-smooth"
                >
                  <Icon name="Trash2" size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-moderate transition-smooth ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <button
          onClick={handleSelect}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth ${
            isSelected 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'bg-surface/80 border-border hover:border-primary backdrop-blur-sm'
          }`}
        >
          {isSelected && <Icon name="Check" size={12} />}
        </button>
      </div>

      {/* File Preview */}
      <div className="relative aspect-square bg-muted">
        {file.thumbnail ? (
          <Image 
            src={file.thumbnail} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${getFileTypeColor(file.type)}`}>
            <Icon name={getFileIcon(file.type)} size={48} />
          </div>
        )}
        
        {/* Encryption Badge */}
        {file.isEncrypted && (
          <div className="absolute top-2 right-2 bg-success/90 text-success-foreground rounded-full p-1">
            <Icon name="Shield" size={12} />
          </div>
        )}

        {/* Actions Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowActions(!showActions)}
            iconName="MoreHorizontal"
            className="bg-surface/90 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* File Info */}
      <div className="p-3">
        <h4 className="font-medium text-foreground truncate mb-1">{file.name}</h4>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <span>{formatDate(file.uploadDate)}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground capitalize">{file.type}</span>
          <div className="flex items-center space-x-1">
            {file.isShared && (
              <Icon name="Share2" size={12} className="text-primary" />
            )}
            {file.isFavorite && (
              <Icon name="Star" size={12} className="text-warning" />
            )}
          </div>
        </div>
      </div>

      {/* Actions Menu */}
      {showActions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevated z-20 mx-2">
          <div className="py-1">
            <button
              onClick={() => handleAction('download')}
              disabled={isLoading}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth disabled:opacity-50"
            >
              <Icon name="Download" size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={() => handleAction('share')}
              disabled={isLoading}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth disabled:opacity-50"
            >
              <Icon name="Share2" size={16} />
              <span>Share</span>
            </button>
            <button
              onClick={() => handleAction('organize')}
              disabled={isLoading}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-smooth disabled:opacity-50"
            >
              <Icon name="FolderOpen" size={16} />
              <span>Organize</span>
            </button>
            <div className="border-t border-border my-1"></div>
            <button
              onClick={() => handleAction('delete')}
              disabled={isLoading}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error hover:bg-error/10 transition-smooth disabled:opacity-50"
            >
              <Icon name="Trash2" size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileCard;