import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumbs = ({ 
  customPath = null, 
  onNavigate, 
  className = '',
  showHome = true 
}) => {
  const location = useLocation();

  const getRouteLabel = (path) => {
    const routeLabels = {
      '/wallet-connection-authentication': 'Wallet Connection',
      '/file-storage-dashboard': 'Files',
      '/file-upload-interface': 'Upload',
      '/file-sharing-link-management': 'Shares',
      '/file-organization-search': 'Search & Organize',
      '/user-profile-security-settings': 'Profile Settings'
    };
    return routeLabels[path] || path.split('/').pop().replace(/-/g, ' ');
  };

  const generateBreadcrumbs = () => {
    if (customPath) {
      // Handle custom folder path for file organization
      const pathSegments = customPath.split('/').filter(segment => segment);
      return pathSegments.map((segment, index) => ({
        label: segment,
        path: '/' + pathSegments.slice(0, index + 1).join('/'),
        isFolder: true
      }));
    }

    // Handle route-based breadcrumbs
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];

    if (showHome) {
      breadcrumbs.push({
        label: 'Dashboard',
        path: '/file-storage-dashboard',
        icon: 'Home'
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      if (currentPath !== '/file-storage-dashboard' || !showHome) {
        breadcrumbs.push({
          label: getRouteLabel(currentPath),
          path: currentPath,
          isLast: index === pathSegments.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const handleBreadcrumbClick = (breadcrumb) => {
    if (onNavigate) {
      onNavigate(breadcrumb);
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1 && !customPath) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground mx-1" 
              />
            )}
            
            {breadcrumb.isLast ? (
              <span className="text-foreground font-medium flex items-center space-x-1">
                {breadcrumb.icon && (
                  <Icon name={breadcrumb.icon} size={14} />
                )}
                <span className="truncate max-w-32 sm:max-w-none">
                  {breadcrumb.label}
                </span>
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                onClick={() => handleBreadcrumbClick(breadcrumb)}
                className="text-muted-foreground hover:text-foreground transition-smooth flex items-center space-x-1 hover:underline"
              >
                {breadcrumb.icon && (
                  <Icon name={breadcrumb.icon} size={14} />
                )}
                <span className="truncate max-w-24 sm:max-w-none">
                  {breadcrumb.label}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ol>

      {/* Quick Actions for File Organization */}
      {location.pathname === '/file-organization-search' && customPath && (
        <div className="flex items-center space-x-2 ml-4">
          <div className="h-4 w-px bg-border"></div>
          <button
            onClick={() => onNavigate && onNavigate({ action: 'create-folder', path: customPath })}
            className="text-muted-foreground hover:text-foreground transition-smooth p-1 rounded hover:bg-muted"
            title="Create folder here"
          >
            <Icon name="FolderPlus" size={14} />
          </button>
          <button
            onClick={() => onNavigate && onNavigate({ action: 'upload-here', path: customPath })}
            className="text-muted-foreground hover:text-foreground transition-smooth p-1 rounded hover:bg-muted"
            title="Upload files here"
          >
            <Icon name="Upload" size={14} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavigationBreadcrumbs;