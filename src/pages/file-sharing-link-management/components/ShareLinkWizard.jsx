import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ShareLinkWizard = ({ selectedFile, onLinkGenerated, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [linkSettings, setLinkSettings] = useState({
    passwordProtected: false,
    password: '',
    otpRequired: false,
    otpMethod: 'email',
    expirationEnabled: false,
    expirationDate: '',
    downloadLimit: false,
    maxDownloads: 10,
    allowPreview: true,
    trackAccess: true
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { id: 1, title: 'Access Controls', icon: 'Shield' },
    { id: 2, title: 'Link Settings', icon: 'Settings' },
    { id: 3, title: 'Generate & Share', icon: 'Share2' }
  ];

  const handleSettingChange = (key, value) => {
    setLinkSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateShareLink = async () => {
    setIsGenerating(true);
    try {
      // Simulate link generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockLink = `https://securevault.app/share/${Math.random().toString(36).substring(2, 15)}`;
      setGeneratedLink(mockLink);
      setCurrentStep(3);
      if (onLinkGenerated) {
        onLinkGenerated({
          link: mockLink,
          settings: linkSettings,
          file: selectedFile
        });
      }
    } catch (error) {
      console.error('Failed to generate link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      // Show success feedback
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Checkbox
                label="Password Protection"
                description="Require a password to access the file"
                checked={linkSettings.passwordProtected}
                onChange={(e) => handleSettingChange('passwordProtected', e.target.checked)}
              />
              
              {linkSettings.passwordProtected && (
                <Input
                  type="password"
                  label="Access Password"
                  placeholder="Enter secure password"
                  value={linkSettings.password}
                  onChange={(e) => handleSettingChange('password', e.target.value)}
                  description="Minimum 8 characters with mixed case and numbers"
                  className="ml-6"
                />
              )}
            </div>

            <div className="space-y-4">
              <Checkbox
                label="OTP Verification"
                description="Send one-time password for additional security"
                checked={linkSettings.otpRequired}
                onChange={(e) => handleSettingChange('otpRequired', e.target.checked)}
              />
              
              {linkSettings.otpRequired && (
                <div className="ml-6 space-y-2">
                  <label className="text-sm font-medium text-foreground">Delivery Method</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="otpMethod"
                        value="email"
                        checked={linkSettings.otpMethod === 'email'}
                        onChange={(e) => handleSettingChange('otpMethod', e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-sm">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="otpMethod"
                        value="sms"
                        checked={linkSettings.otpMethod === 'sms'}
                        onChange={(e) => handleSettingChange('otpMethod', e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-sm">SMS</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Checkbox
                label="Link Expiration"
                description="Automatically disable link after specified date"
                checked={linkSettings.expirationEnabled}
                onChange={(e) => handleSettingChange('expirationEnabled', e.target.checked)}
              />
              
              {linkSettings.expirationEnabled && (
                <Input
                  type="datetime-local"
                  label="Expiration Date & Time"
                  value={linkSettings.expirationDate}
                  onChange={(e) => handleSettingChange('expirationDate', e.target.value)}
                  className="ml-6"
                />
              )}
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Download Limit"
                description="Limit the number of times file can be downloaded"
                checked={linkSettings.downloadLimit}
                onChange={(e) => handleSettingChange('downloadLimit', e.target.checked)}
              />
              
              {linkSettings.downloadLimit && (
                <Input
                  type="number"
                  label="Maximum Downloads"
                  value={linkSettings.maxDownloads}
                  onChange={(e) => handleSettingChange('maxDownloads', parseInt(e.target.value))}
                  min="1"
                  max="1000"
                  className="ml-6"
                />
              )}
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Allow Preview"
                description="Enable file preview without downloading"
                checked={linkSettings.allowPreview}
                onChange={(e) => handleSettingChange('allowPreview', e.target.checked)}
              />
              
              <Checkbox
                label="Track Access"
                description="Monitor access attempts and download analytics"
                checked={linkSettings.trackAccess}
                onChange={(e) => handleSettingChange('trackAccess', e.target.checked)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Share Link Generated!</h3>
              <p className="text-sm text-muted-foreground">
                Your secure sharing link is ready. Copy and share it with intended recipients.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Shareable Link"
                  value={generatedLink}
                  readOnly
                  className="pr-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="absolute right-2 top-8"
                  iconName="Copy"
                />
              </div>

              <div className="flex justify-center">
                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name="QrCode" size={48} className="text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-foreground">Link Settings Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {linkSettings.passwordProtected && <p>• Password protected</p>}
                {linkSettings.otpRequired && <p>• OTP verification via {linkSettings.otpMethod}</p>}
                {linkSettings.expirationEnabled && <p>• Expires on {new Date(linkSettings.expirationDate).toLocaleDateString()}</p>}
                {linkSettings.downloadLimit && <p>• Limited to {linkSettings.maxDownloads} downloads</p>}
                {linkSettings.allowPreview && <p>• Preview enabled</p>}
                {linkSettings.trackAccess && <p>• Access tracking enabled</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-elevated w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Create Share Link</h2>
            <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Steps Indicator */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-smooth ${
                  currentStep >= step.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step.icon} size={16} />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 transition-smooth ${
                    currentStep > step.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-medium text-foreground">
              {steps.find(s => s.id === currentStep)?.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            iconName={currentStep > 1 ? "ChevronLeft" : "X"}
            iconPosition="left"
          >
            {currentStep > 1 ? 'Back' : 'Cancel'}
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={() => currentStep === 2 ? generateShareLink() : setCurrentStep(currentStep + 1)}
              loading={isGenerating}
              iconName="ChevronRight"
              iconPosition="right"
            >
              {currentStep === 2 ? 'Generate Link' : 'Next'}
            </Button>
          ) : (
            <Button
              onClick={onClose}
              iconName="Check"
              iconPosition="left"
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareLinkWizard;