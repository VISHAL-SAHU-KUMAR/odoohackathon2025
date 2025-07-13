import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShareLinkCard = ({ shareLink, onAction }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10 border-success/20';
      case 'expired':
        return 'text-error bg-error/10 border-error/20';
      case 'revoked':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-warning bg-warning/10 border-warning/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'expired':
        return 'Clock';
      case 'revoked':
        return 'XCircle';
      default:
        return 'AlertCircle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink.url);
      if (onAction) onAction('copy', shareLink);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4 hover:shadow-moderate transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={16} className="text-muted-foreground flex-shrink-0" />
            <h3 className="font-medium text-foreground truncate">{shareLink.fileName}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Created {formatDate(shareLink.createdAt)}
          </p>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor(shareLink.status)}`}>
          <Icon name={getStatusIcon(shareLink.status)} size={12} />
          <span className="capitalize">{shareLink.status}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">{shareLink.accessCount}</div>
          <div className="text-xs text-muted-foreground">Access</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">{shareLink.downloadCount}</div>
          <div className="text-xs text-muted-foreground">Downloads</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {shareLink.expiresAt ? Math.max(0, Math.ceil((new Date(shareLink.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))) : '∞'}
          </div>
          <div className="text-xs text-muted-foreground">Days Left</div>
        </div>
      </div>

      {/* Security Features */}
      <div className="flex flex-wrap gap-2">
        {shareLink.passwordProtected && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
            <Icon name="Lock" size={12} />
            <span>Password</span>
          </div>
        )}
        {shareLink.otpRequired && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
            <Icon name="Shield" size={12} />
            <span>OTP</span>
          </div>
        )}
        {shareLink.downloadLimit && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-warning/10 text-warning rounded-md text-xs">
            <Icon name="Download" size={12} />
            <span>Limited</span>
          </div>
        )}
        {shareLink.trackAccess && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs">
            <Icon name="Eye" size={12} />
            <span>Tracked</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyLink}
            iconName="Copy"
            iconPosition="left"
          >
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            iconName={showDetails ? "ChevronUp" : "ChevronDown"}
            iconPosition="left"
          >
            Details
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAction && onAction('edit', shareLink)}
            iconName="Edit"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAction && onAction('analytics', shareLink)}
            iconName="BarChart3"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onAction && onAction('revoke', shareLink)}
            iconName="Trash2"
          />
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="pt-4 border-t border-border space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">File Size:</span>
              <span className="ml-2 text-foreground">{shareLink.fileSize}</span>
            </div>
            <div>
              <span className="text-muted-foreground">File Type:</span>
              <span className="ml-2 text-foreground">{shareLink.fileType}</span>
            </div>
            {shareLink.expiresAt && (
              <div>
                <span className="text-muted-foreground">Expires:</span>
                <span className="ml-2 text-foreground">{formatDate(shareLink.expiresAt)}</span>
              </div>
            )}
            {shareLink.downloadLimit && (
              <div>
                <span className="text-muted-foreground">Download Limit:</span>
                <span className="ml-2 text-foreground">{shareLink.maxDownloads}</span>
              </div>
            )}
          </div>
          
          <div className="bg-muted/50 rounded-md p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Share URL:</span>
              <Button
                variant="ghost"
                size="xs"
                onClick={copyLink}
                iconName="Copy"
              />
            </div>
            <div className="text-xs font-mono text-foreground mt-1 break-all">
              {shareLink.url}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareLinkCard;