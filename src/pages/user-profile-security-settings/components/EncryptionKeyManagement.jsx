import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EncryptionKeyManagement = ({ onKeyAction }) => {
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [backupPassword, setBackupPassword] = useState('');
  const [importKey, setImportKey] = useState('');
  const [importPassword, setImportPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBackupKeys = async () => {
    if (!backupPassword) return;
    
    setIsProcessing(true);
    try {
      await onKeyAction('backup', { password: backupPassword });
      setShowBackupModal(false);
      setBackupPassword('');
    } catch (error) {
      console.error('Backup failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportKeys = async () => {
    if (!importKey || !importPassword) return;
    
    setIsProcessing(true);
    try {
      await onKeyAction('import', { key: importKey, password: importPassword });
      setShowImportModal(false);
      setImportKey('');
      setImportPassword('');
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateNewKeys = async () => {
    setIsProcessing(true);
    try {
      await onKeyAction('generate');
    } catch (error) {
      console.error('Key generation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Encryption Keys</h3>
        <Icon name="Key" size={20} className="text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Current Keys</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your encryption keys are securely stored in your browser and linked to your wallet.
          </p>
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBackupModal(true)}
              iconName="Download"
              iconPosition="left"
            >
              Backup Keys
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportModal(true)}
              iconName="Upload"
              iconPosition="left"
            >
              Import Keys
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="RefreshCw" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Key Management</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Generate new encryption keys. This will require re-encrypting all existing files.
          </p>
          <Button
            variant="warning"
            size="sm"
            onClick={handleGenerateNewKeys}
            loading={isProcessing}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Generate New Keys
          </Button>
        </div>
      </div>

      {/* Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-foreground">Backup Encryption Keys</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBackupModal(false)}
                iconName="X"
              />
            </div>
            
            <div className="space-y-4">
              <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-error">Critical Security Warning</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Store your backup securely. Anyone with access can decrypt your files.
                    </p>
                  </div>
                </div>
              </div>

              <Input
                type="password"
                label="Backup Password"
                placeholder="Enter a strong password"
                value={backupPassword}
                onChange={(e) => setBackupPassword(e.target.value)}
                required
              />

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBackupModal(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleBackupKeys}
                  loading={isProcessing}
                  disabled={!backupPassword}
                  fullWidth
                >
                  Create Backup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-foreground">Import Encryption Keys</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowImportModal(false)}
                iconName="X"
              />
            </div>
            
            <div className="space-y-4">
              <Input
                type="file"
                label="Key File"
                description="Select your encrypted key backup file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => setImportKey(event.target.result);
                    reader.readAsText(file);
                  }
                }}
                required
              />

              <Input
                type="password"
                label="Backup Password"
                placeholder="Enter backup password"
                value={importPassword}
                onChange={(e) => setImportPassword(e.target.value)}
                required
              />

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowImportModal(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleImportKeys}
                  loading={isProcessing}
                  disabled={!importKey || !importPassword}
                  fullWidth
                >
                  Import Keys
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptionKeyManagement;