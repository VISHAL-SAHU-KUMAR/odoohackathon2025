import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const FileGridDisplay = ({ 
  files = [], 
  selectedFiles = [], 
  onFileSelect, 
  onFileAction, 
  viewMode = 'grid',
  className = '' 
}) => {
  const [draggedFile, setDraggedFile] = useState(null);
  const [dragOverFile, setDragOverFile] = useState(null);

  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'Image';
    } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) {
      return 'Video';
    } else if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) {
      return 'Music';
    } else if (['pdf'].includes(extension)) {
      return 'FileText';
    } else if (['doc', 'docx', 'txt'].includes(extension)) {
      return 'FileText';
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return 'FileSpreadsheet';
    } else if (['zip', 'rar', '7z', 'tar'].includes(extension)) {
      return 'Archive';
    }
    return 'File';
  };

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

  const isSelected = (fileId) => {
    return selectedFiles.includes(fileId);
  };

  const handleFileClick = (file, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      if (onFileSelect) {
        onFileSelect(file, 'toggle');
      }
    } else if (event.shiftKey && selectedFiles.length > 0) {
      // Range select
      if (onFileSelect) {
        onFileSelect(file, 'range');
      }
    } else {
      // Single select
      if (onFileSelect) {
        onFileSelect(file, 'single');
      }
    }
  };

  const handleDragStart = (e, file) => {
    setDraggedFile(file);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', file.id);
  };

  const handleDragOver = (e, file) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFile(file);
  };

  const handleDragLeave = () => {
    setDragOverFile(null);
  };

  const handleDrop = (e, targetFile) => {
    e.preventDefault();
    setDragOverFile(null);
    
    if (draggedFile && targetFile && draggedFile.id !== targetFile.id) {
      if (onFileAction) {
        onFileAction('move', draggedFile, targetFile);
      }
    }
    setDraggedFile(null);
  };

  const handleFileAction = (action, file) => {
    if (onFileAction) {
      onFileAction(action, file);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className={`bg-surface border border-border rounded-lg ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="p-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="p-3 text-sm font-medium text-muted-foreground">Size</th>
                <th className="p-3 text-sm font-medium text-muted-foreground">Modified</th>
                <th className="p-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className={`border-b border-border hover:bg-muted/50 cursor-pointer transition-smooth ${
                    isSelected(file.id) ? 'bg-primary/10' : ''
                  }`}
                  onClick={(e) => handleFileClick(file, e)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, file)}
                  onDragOver={(e) => handleDragOver(e, file)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, file)}
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 border rounded ${
                        isSelected(file.id) 
                          ? 'bg-primary border-primary' :'border-border'
                      }`}>
                        {isSelected(file.id) && (
                          <Icon name="Check" size={12} className="text-primary-foreground" />
                        )}
                      </div>
                      <Icon 
                        name={getFileIcon(file)} 
                        size={20} 
                        className="text-muted-foreground" 
                      />
                      <div>
                        <div className="font-medium text-foreground">{file.name}</div>
                        {file.tags && file.tags.length > 0 && (
                          <div className="flex space-x-1 mt-1">
                            {file.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {formatDate(file.modifiedAt)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      {file.encrypted && (
                        <Icon name="Shield" size={14} className="text-success" title="Encrypted" />
                      )}
                      {file.shared && (
                        <Icon name="Share2" size={14} className="text-primary" title="Shared" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction('download', file);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Share2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction('share', file);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="MoreHorizontal"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction('menu', file);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className={`relative group cursor-pointer transition-smooth ${
              isSelected(file.id) 
                ? 'ring-2 ring-primary bg-primary/5' :'hover:bg-muted/50'
            } ${
              dragOverFile?.id === file.id ? 'ring-2 ring-accent' : ''
            } rounded-lg p-3 border border-border`}
            onClick={(e) => handleFileClick(file, e)}
            draggable
            onDragStart={(e) => handleDragStart(e, file)}
            onDragOver={(e) => handleDragOver(e, file)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, file)}
          >
            {/* Selection Checkbox */}
            <div className={`absolute top-2 left-2 w-4 h-4 border rounded transition-smooth ${
              isSelected(file.id) 
                ? 'bg-primary border-primary opacity-100' :'border-border opacity-0 group-hover:opacity-100'
            }`}>
              {isSelected(file.id) && (
                <Icon name="Check" size={12} className="text-primary-foreground" />
              )}
            </div>

            {/* File Preview/Icon */}
            <div className="flex flex-col items-center space-y-2">
              {getFileIcon(file) === 'Image' && file.thumbnail ? (
                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md">
                  <Icon 
                    name={getFileIcon(file)} 
                    size={32} 
                    className="text-muted-foreground" 
                  />
                </div>
              )}

              {/* File Info */}
              <div className="text-center w-full">
                <div className="text-sm font-medium text-foreground truncate" title={file.name}>
                  {file.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center space-x-1">
                {file.encrypted && (
                  <Icon name="Shield" size={12} className="text-success" />
                )}
                {file.shared && (
                  <Icon name="Share2" size={12} className="text-primary" />
                )}
                {file.favorite && (
                  <Icon name="Star" size={12} className="text-warning" />
                )}
              </div>

              {/* Tags */}
              {file.tags && file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {file.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Download"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileAction('download', file);
                  }}
                  className="bg-surface/80 backdrop-blur-sm"
                />
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="MoreHorizontal"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileAction('menu', file);
                  }}
                  className="bg-surface/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No files found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default FileGridDisplay;