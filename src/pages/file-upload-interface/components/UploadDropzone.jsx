import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadDropzone = ({ onFilesSelected, isUploading, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary/5 scale-105' :'border-border hover:border-primary/50 hover:bg-muted/50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-colors
            ${isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            <Icon 
              name={isDragOver ? "Upload" : "CloudUpload"} 
              size={32} 
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isDragOver ? 'Drop files here' : 'Upload your files'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Drag and drop files here, or click to select files from your device. 
              All files will be encrypted before upload.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="default"
              iconName="FileText"
              iconPosition="left"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              Select Files
            </Button>
            
            <Button
              variant="outline"
              iconName="Folder"
              iconPosition="left"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                // Handle folder selection
                const input = document.createElement('input');
                input.type = 'file';
                input.webkitdirectory = true;
                input.multiple = true;
                input.onchange = (event) => {
                  const files = Array.from(event.target.files);
                  onFilesSelected(files);
                };
                input.click();
              }}
            >
              Select Folder
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Supported formats: All file types • Max size: 100MB per file</p>
            <p className="flex items-center justify-center space-x-1 mt-1">
              <Icon name="Shield" size={12} className="text-success" />
              <span>Files are encrypted client-side before upload</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDropzone;