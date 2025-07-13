import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UploadDropzone from './components/UploadDropzone';
import FileUploadCard from './components/FileUploadCard';
import UploadProgress from './components/UploadProgress';
import EncryptionSettings from './components/EncryptionSettings';
import IPFSSettings from './components/IPFSSettings';

const FileUploadInterface = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [encryptionProgress, setEncryptionProgress] = useState({});
  const [completedFiles, setCompletedFiles] = useState(0);
  const [failedFiles, setFailedFiles] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [overallProgress, setOverallProgress] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);
  const [encryptionSettings, setEncryptionSettings] = useState({});
  const [ipfsSettings, setIPFSSettings] = useState({});
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Mock wallet connection check
  const [isWalletConnected, setIsWalletConnected] = useState(true);

  useEffect(() => {
    // Calculate overall progress
    if (selectedFiles.length > 0) {
      const totalProgress = selectedFiles.reduce((sum, file) => {
        const fileUploadProgress = uploadProgress[file.name] || 0;
        const fileEncryptionProgress = encryptionProgress[file.name] || 0;
        return sum + Math.max(fileUploadProgress, fileEncryptionProgress);
      }, 0);
      setOverallProgress(totalProgress / selectedFiles.length);
    }
  }, [selectedFiles, uploadProgress, encryptionProgress]);

  const handleFilesSelected = (files) => {
    const newFiles = files.map(file => ({
      ...file,
      id: `${file.name}-${Date.now()}`,
      status: 'pending',
      settings: {
        folder: '',
        description: '',
        enableSharing: false,
        password: '',
        expirationDays: 30
      }
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileName) => {
    setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
    // Clean up progress tracking
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    setEncryptionProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const handleUpdateFileSettings = (fileName, settings) => {
    setSelectedFiles(prev => 
      prev.map(file => 
        file.name === fileName 
          ? { ...file, settings }
          : file
      )
    );
  };

  const simulateEncryption = async (file) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setEncryptionProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
      }, 200);
    });
  };

  const simulateUpload = async (file) => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        if (isPaused) return;
        
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // Simulate occasional failures
          if (Math.random() < 0.1) {
            reject(new Error('Upload failed'));
          } else {
            resolve();
          }
        }
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
      }, 300);
    });
  };

  const handleStartUpload = async () => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setCompletedFiles(0);
    setFailedFiles(0);

    for (const file of selectedFiles) {
      if (isPaused) break;
      
      setCurrentFile(file.name);
      
      try {
        // Update file status to encrypting
        setSelectedFiles(prev => 
          prev.map(f => f.name === file.name ? { ...f, status: 'encrypting' } : f)
        );
        
        // Simulate encryption
        await simulateEncryption(file);
        
        // Update file status to uploading
        setSelectedFiles(prev => 
          prev.map(f => f.name === file.name ? { ...f, status: 'uploading' } : f)
        );
        
        // Simulate upload
        await simulateUpload(file);
        
        // Mark as completed
        setSelectedFiles(prev => 
          prev.map(f => f.name === file.name ? { ...f, status: 'completed' } : f)
        );
        setCompletedFiles(prev => prev + 1);
        
      } catch (error) {
        console.error('Upload failed for', file.name, error);
        setSelectedFiles(prev => 
          prev.map(f => f.name === file.name ? { ...f, status: 'error' } : f)
        );
        setFailedFiles(prev => prev + 1);
      }
    }

    setIsUploading(false);
    setCurrentFile('');
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setIsPaused(false);
    setCurrentFile('');
    setUploadProgress({});
    setEncryptionProgress({});
    setCompletedFiles(0);
    setFailedFiles(0);
    setOverallProgress(0);
    // Reset file statuses
    setSelectedFiles(prev => 
      prev.map(file => ({ ...file, status: 'pending' }))
    );
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setUploadProgress({});
    setEncryptionProgress({});
    setCompletedFiles(0);
    setFailedFiles(0);
    setOverallProgress(0);
  };

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <Icon name="Wallet" size={48} className="text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">Wallet Connection Required</h2>
            <p className="text-muted-foreground max-w-md">
              Please connect your MetaMask wallet to upload and encrypt files securely.
            </p>
            <Button
              variant="default"
              iconName="Wallet"
              iconPosition="left"
              onClick={() => navigate('/wallet-connection-authentication')}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="ArrowLeft"
              onClick={() => navigate('/file-storage-dashboard')}
            />
            <h1 className="text-2xl font-bold text-foreground">Upload Files</h1>
          </div>
          <p className="text-muted-foreground">
            Securely encrypt and upload your files to the decentralized IPFS network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Dropzone */}
            {selectedFiles.length === 0 && (
              <UploadDropzone
                onFilesSelected={handleFilesSelected}
                isUploading={isUploading}
              />
            )}

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.onchange = (e) => handleFilesSelected(Array.from(e.target.files));
                        input.click();
                      }}
                      disabled={isUploading}
                    >
                      Add More
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={handleClearAll}
                      disabled={isUploading}
                      className="text-muted-foreground hover:text-error"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedFiles.map((file) => (
                    <FileUploadCard
                      key={file.id}
                      file={file}
                      onRemove={handleRemoveFile}
                      onUpdateSettings={handleUpdateFileSettings}
                      uploadProgress={uploadProgress[file.name] || 0}
                      encryptionProgress={encryptionProgress[file.name] || 0}
                      status={file.status}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <UploadProgress
                totalFiles={selectedFiles.length}
                completedFiles={completedFiles}
                failedFiles={failedFiles}
                currentFile={currentFile}
                overallProgress={overallProgress}
                estimatedTimeRemaining={estimatedTimeRemaining}
                onPauseResume={handlePauseResume}
                onCancel={handleCancelUpload}
                isPaused={isPaused}
              />
            )}

            {/* Upload Actions */}
            {selectedFiles.length > 0 && !isUploading && (
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span className="text-sm text-foreground">
                    {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} ready for encrypted upload
                  </span>
                </div>
                <Button
                  variant="default"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={handleStartUpload}
                  className="min-w-32"
                >
                  Start Upload
                </Button>
              </div>
            )}
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="FolderOpen"
                  iconPosition="left"
                  onClick={() => navigate('/file-storage-dashboard')}
                >
                  View My Files
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Share2"
                  iconPosition="left"
                  onClick={() => navigate('/file-sharing-link-management')}
                >
                  Manage Shares
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                >
                  {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
                </Button>
              </div>
            </div>

            {/* Encryption Settings */}
            <EncryptionSettings
              onSettingsChange={setEncryptionSettings}
            />

            {/* IPFS Settings */}
            {showAdvancedSettings && (
              <IPFSSettings
                onSettingsChange={setIPFSSettings}
              />
            )}

            {/* Storage Info */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Storage Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available Space</span>
                  <span className="text-foreground">Unlimited</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Files Uploaded</span>
                  <span className="text-foreground">247</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Size</span>
                  <span className="text-foreground">2.4 GB</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Icon name="Globe" size={14} className="text-success" />
                    <span className="text-xs text-success">IPFS Network: Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help & Tips */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Tips</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Files are encrypted in your browser before upload</p>
                <p>• Larger files may take longer to encrypt</p>
                <p>• Keep your browser open during upload</p>
                <p>• Enable sharing to generate secure links</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadInterface;