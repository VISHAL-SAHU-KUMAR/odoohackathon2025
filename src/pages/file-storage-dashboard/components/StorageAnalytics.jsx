import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const StorageAnalytics = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const storageData = {
    totalUsed: 2.4,
    totalAvailable: 10.0,
    ipfsNodeStatus: 'connected',
    filesCount: 47,
    lastSync: new Date(Date.now() - 300000), // 5 minutes ago
    bandwidth: {
      upload: 1.2,
      download: 3.8
    },
    nodeHealth: 95
  };

  const usagePercentage = (storageData.totalUsed / storageData.totalAvailable) * 100;

  const formatFileSize = (sizeInGB) => {
    if (sizeInGB < 1) {
      return `${(sizeInGB * 1024).toFixed(0)} MB`;
    }
    return `${sizeInGB.toFixed(1)} GB`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success bg-success/10 border-success/20';
      case 'syncing':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'disconnected':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'syncing':
        return 'RefreshCw';
      case 'disconnected':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-subtle transition-smooth ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-smooth"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="HardDrive" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Storage Analytics</h3>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(storageData.totalUsed)} of {formatFileSize(storageData.totalAvailable)} used
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor(storageData.ipfsNodeStatus)}`}>
            <Icon name={getStatusIcon(storageData.ipfsNodeStatus)} size={12} />
            <span className="hidden sm:inline">IPFS</span>
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-muted-foreground transition-transform duration-200"
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border">
          {/* Storage Usage Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Storage Usage</span>
              <span className="font-medium text-foreground">{usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-foreground">{storageData.filesCount}</div>
              <div className="text-xs text-muted-foreground">Files</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-foreground">{storageData.nodeHealth}%</div>
              <div className="text-xs text-muted-foreground">Node Health</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-foreground">{storageData.bandwidth.upload} MB/s</div>
              <div className="text-xs text-muted-foreground">Upload</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-foreground">{storageData.bandwidth.download} MB/s</div>
              <div className="text-xs text-muted-foreground">Download</div>
            </div>
          </div>

          {/* Last Sync */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Sync</span>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} className="text-muted-foreground" />
              <span className="text-foreground">
                {storageData.lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageAnalytics;