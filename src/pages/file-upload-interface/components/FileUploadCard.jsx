import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadCard = ({ file, onRemove, onUpdateSettings, uploadProgress = 0, encryptionProgress = 0, status = 'pending' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    folder: '',
    description: '',
    enableSharing: false,
    password: '',
    expirationDays: 30
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    // Add null/undefined check and ensure fileName is a string
    if (!fileName || typeof fileName !== 'string') {
      return 'File';
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconMap = {
      pdf: 'FileText',
      doc: 'FileText',
      docx: 'FileText',
      txt: 'FileText',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image',
      gif: 'Image',
      mp4: 'Video',
      avi: 'Video',
      mov: 'Video',
      mp3: 'Music',
      wav: 'Music',
      zip: 'Archive',
      rar: 'Archive'
    };
    return iconMap[extension] || 'File';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'encrypting':
        return 'text-warning';
      case 'uploading':
        return 'text-primary';
      case 'completed':
        return 'text-success';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'encrypting':
        return 'Encrypting...';
      case 'uploading':
        return 'Uploading to IPFS...';
      case 'completed':
        return 'Upload complete';
      case 'error':
        return 'Upload failed';
      default:
        return 'Pending';
    }
  };

  const handleSettingsChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateSettings?.(file?.name || 'unknown', newSettings);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* File Header */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <Icon name={getFileIcon(file?.name)} size={20} className="text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">
                {file?.name || 'Unknown file'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file?.size || 0)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-2">
              <Button
                variant="ghost"
                size="xs"
                iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                onClick={() => setIsExpanded(!isExpanded)}
              />
              <Button
                variant="ghost"
                size="xs"
                iconName="X"
                onClick={() => onRemove?.(file?.name || 'unknown')}
                className="text-muted-foreground hover:text-error"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      {(status === 'encrypting' || status === 'uploading' || encryptionProgress > 0 || uploadProgress > 0) && (
        <div className="space-y-2">
          {/* Encryption Progress */}
          {(status === 'encrypting' || encryptionProgress > 0) && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Encryption</span>
                <span className="text-warning">{Math.round(encryptionProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-warning h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${encryptionProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {(status === 'uploading' || uploadProgress > 0) && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">IPFS Upload</span>
                <span className="text-primary">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status */}
      <div className="flex items-center space-x-2">
        <Icon 
          name={status === 'completed' ? 'CheckCircle' : status === 'error' ? 'AlertCircle' : 'Clock'} 
          size={14} 
          className={getStatusColor()}
        />
        <span className={`text-xs ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Expanded Settings */}
      {isExpanded && (
        <div className="border-t border-border pt-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Folder
              </label>
              <input
                type="text"
                placeholder="Optional folder name"
                value={settings.folder}
                onChange={(e) => handleSettingsChange('folder', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border rounded bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Optional description"
                value={settings.description}
                onChange={(e) => handleSettingsChange('description', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border rounded bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableSharing}
                onChange={(e) => handleSettingsChange('enableSharing', e.target.checked)}
                className="w-3 h-3 text-primary border-border rounded focus:ring-ring"
              />
              <span className="text-xs text-foreground">Enable sharing</span>
            </label>

            {settings.enableSharing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Password (optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Share password"
                    value={settings.password}
                    onChange={(e) => handleSettingsChange('password', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-border rounded bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Expires in (days)
                  </label>
                  <select
                    value={settings.expirationDays}
                    onChange={(e) => handleSettingsChange('expirationDays', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-border rounded bg-input text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value={1}>1 day</option>
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadCard;