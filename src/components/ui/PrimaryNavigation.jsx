import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const PrimaryNavigation = ({ className = '', isMobile = false, onNavigate }) => {
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Files',
      path: '/file-storage-dashboard',
      icon: 'FolderOpen',
      description: 'Manage your encrypted files',
      requiresAuth: true
    },
    {
      label: 'Upload',
      path: '/file-upload-interface',
      icon: 'Upload',
      description: 'Add new files to storage',
      requiresAuth: true
    },
    {
      label: 'Shares',
      path: '/file-sharing-link-management',
      icon: 'Share2',
      description: 'Manage sharing links',
      requiresAuth: true
    },
    {
      label: 'Profile',
      path: '/user-profile-security-settings',
      icon: 'User',
      description: 'Account and security settings',
      requiresAuth: true
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (item) => {
    if (onNavigate) {
      onNavigate(item);
    }
  };

  if (isMobile) {
    return (
      <nav className={`flex flex-col space-y-1 ${className}`}>
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => handleNavigation(item)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-smooth ${
              isActiveRoute(item.path)
                ? 'bg-primary text-primary-foreground shadow-subtle'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon 
              name={item.icon} 
              size={20} 
              className={isActiveRoute(item.path) ? 'text-primary-foreground' : 'text-current'}
            />
            <div className="flex flex-col">
              <span>{item.label}</span>
              {item.description && (
                <span className={`text-xs ${
                  isActiveRoute(item.path) 
                    ? 'text-primary-foreground/80' 
                    : 'text-muted-foreground'
                }`}>
                  {item.description}
                </span>
              )}
            </div>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={`flex items-center space-x-1 ${className}`}>
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => handleNavigation(item)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
            isActiveRoute(item.path)
              ? 'bg-primary text-primary-foreground shadow-subtle'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Icon 
            name={item.icon} 
            size={16} 
            className={isActiveRoute(item.path) ? 'text-primary-foreground' : 'text-current'}
          />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default PrimaryNavigation;