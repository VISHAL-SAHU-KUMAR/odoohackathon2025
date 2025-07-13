import React, { useState, useEffect } from 'react';
import FileCard from './FileCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileGrid = ({ 
  files = [], 
  viewMode = 'grid', 
  onFileAction, 
  selectedFiles = [], 
  onFileSelect,
  onRefresh,
  isLoading = false,
  className = '' 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [pullDistance, setPullDistance] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const currentTouch = e.touches[0].clientY;
    const distance = currentTouch - touchStart;
    
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60) {
      setIsRefreshing(true);
      try {
        if (onRefresh) {
          await onRefresh();
        }
        // Simulate refresh delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    setTouchStart(null);
    setPullDistance(0);
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      // Deselect all
      files.forEach(file => onFileSelect && onFileSelect(file.id, false));
    } else {
      // Select all
      files.forEach(file => onFileSelect && onFileSelect(file.id, true));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
          <Icon name="FolderOpen" size={32} className="text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">No files found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start by uploading your first file to SecureVault. Your files will be encrypted and stored securely on IPFS.
          </p>
        </div>
        <Button
          variant="default"
          iconName="Upload"
          iconPosition="left"
          onClick={() => window.location.href = '/file-upload-interface'}
        >
          Upload Files
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 bg-primary/10 text-primary text-center py-2 z-50 transition-all duration-200"
          style={{ transform: `translateY(${Math.min(pullDistance - 60, 0)}px)` }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon 
              name="RefreshCw" 
              size={16} 
              className={pullDistance > 60 ? 'animate-spin' : ''} 
            />
            <span className="text-sm font-medium">
              {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}

      {/* Selection Header */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {selectedFiles.length} of {files.length} files selected
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            iconName={selectedFiles.length === files.length ? "X" : "CheckSquare"}
            iconPosition="left"
          >
            {selectedFiles.length === files.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      )}

      {/* Files Container */}
      <div
        className={`${
          viewMode === 'grid' ?'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' :'space-y-2'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {files.map((file) => (
          <div key={file.id} className="relative">
            <FileCard
              file={file}
              viewMode={viewMode}
              onAction={onFileAction}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={onFileSelect}
            />
          </div>
        ))}
      </div>

      {/* Refresh Indicator */}
      {isRefreshing && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-elevated z-50">
          <div className="flex items-center space-x-2">
            <Icon name="RefreshCw" size={16} className="animate-spin" />
            <span className="text-sm font-medium">Refreshing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileGrid;