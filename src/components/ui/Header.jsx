import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const location = useLocation();

  const navigationItems = [
    { label: 'Files', path: '/file-storage-dashboard', icon: 'FolderOpen' },
    { label: 'Upload', path: '/file-upload-interface', icon: 'Upload' },
    { label: 'Shares', path: '/file-sharing-link-management', icon: 'Share2' },
    { label: 'Profile', path: '/user-profile-security-settings', icon: 'User' },
  ];

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
        }
      } else {
        alert('Please install MetaMask to connect your wallet');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsWalletConnected(false);
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-100 bg-surface border-b border-border shadow-subtle">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/file-storage-dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Shield" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">SecureVault</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActiveRoute(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Wallet Connection & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Wallet Connection Indicator */}
            <div className="hidden sm:flex items-center">
              {isWalletConnected ? (
                <div className="flex items-center space-x-2 bg-success/10 text-success px-3 py-1.5 rounded-md border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono">{truncateAddress(walletAddress)}</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={disconnectWallet}
                    iconName="X"
                    className="text-success hover:text-success/80"
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={connectWallet}
                  iconName="Wallet"
                  iconPosition="left"
                >
                  Connect Wallet
                </Button>
              )}
            </div>

            {/* Mobile Wallet Status */}
            <div className="sm:hidden">
              {isWalletConnected ? (
                <div className="flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded-md">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <Icon name="Wallet" size={16} />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={connectWallet}
                  iconName="Wallet"
                />
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                iconName={isMobileMenuOpen ? "X" : "Menu"}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                    isActiveRoute(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Wallet Connection */}
              {!isWalletConnected && (
                <div className="pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={connectWallet}
                    iconName="Wallet"
                    iconPosition="left"
                    className="justify-center"
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
              
              {isWalletConnected && (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-sm font-mono text-success">{truncateAddress(walletAddress)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={disconnectWallet}
                      iconName="LogOut"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;