import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadProgress = ({ 
  totalFiles, 
  completedFiles, 
  failedFiles, 
  currentFile, 
  overallProgress, 
  estimatedTimeRemaining,
  onPauseResume,
  onCancel,
  isPaused = false,
  className = ''
}) => {
  const formatTime = (seconds) => {
    if (!seconds || seconds === Infinity) return 'Calculating...';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getProgressColor = () => {
    if (failedFiles > 0) return 'bg-error';
    if (isPaused) return 'bg-warning';
    return 'bg-primary';
  };

  const getStatusText = () => {
    if (isPaused) return 'Upload paused';
    if (completedFiles === totalFiles) return 'Upload complete';
    if (failedFiles > 0) return `${failedFiles} files failed`;
    return 'Uploading files...';
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon 
              name={isPaused ? "Pause" : completedFiles === totalFiles ? "CheckCircle" : "Upload"} 
              size={20} 
              className={`${
                isPaused ? 'text-warning' : 
                completedFiles === totalFiles ? 'text-success': 'text-primary'
              }`}
            />
            <h3 className="text-sm font-semibold text-foreground">
              Upload Progress
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {completedFiles < totalFiles && (
              <>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName={isPaused ? "Play" : "Pause"}
                  onClick={onPauseResume}
                />
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="X"
                  onClick={onCancel}
                  className="text-muted-foreground hover:text-error"
                />
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">{getStatusText()}</span>
            <span className="text-muted-foreground">
              {Math.round(overallProgress)}%
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* File Counts */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-foreground">{totalFiles}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-lg font-semibold text-success">{completedFiles}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          
          {failedFiles > 0 && (
            <div className="space-y-1">
              <div className="text-lg font-semibold text-error">{failedFiles}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
          )}
        </div>

        {/* Current File & Time Remaining */}
        {currentFile && completedFiles < totalFiles && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Icon name="File" size={14} className="text-muted-foreground" />
              <span className="text-xs text-foreground truncate">
                Currently uploading: {currentFile}
              </span>
            </div>
            
            {estimatedTimeRemaining && !isPaused && (
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Estimated time remaining: {formatTime(estimatedTimeRemaining)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Completion Message */}
        {completedFiles === totalFiles && (
          <div className="flex items-center justify-center space-x-2 pt-2 border-t border-border">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-success font-medium">
              All files uploaded successfully!
            </span>
          </div>
        )}

        {/* Error Summary */}
        {failedFiles > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error">
                {failedFiles} file{failedFiles > 1 ? 's' : ''} failed to upload
              </span>
            </div>
            <Button
              variant="outline"
              size="xs"
              iconName="RotateCcw"
              iconPosition="left"
            >
              Retry Failed
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProgress;