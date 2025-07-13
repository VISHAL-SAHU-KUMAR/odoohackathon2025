import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickAccessPanel = ({ 
  onQuickAccess, 
  onSmartFolderSelect, 
  className = '' 
}) => {
  const [recentFiles, setRecentFiles] = useState([]);
  const [favoriteFiles, setFavoriteFiles] = useState([]);
  const [smartFolders, setSmartFolders] = useState([]);

  useEffect(() => {
    // Mock recent files
    const mockRecentFiles = [
      {
        id: 'recent-1',
        name: 'Project Proposal.pdf',
        path: '/documents/work',
        accessedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        icon: 'FileText',
        size: 2456789
      },
      {
        id: 'recent-2',
        name: 'Team Photo.jpg',
        path: '/images/photos',
        accessedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        icon: 'Image',
        size: 5234567
      },
      {
        id: 'recent-3',
        name: 'Meeting Recording.mp4',
        path: '/videos',
        accessedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        icon: 'Video',
        size: 45678901
      }
    ];

    // Mock favorite files
    const mockFavoriteFiles = [
      {
        id: 'fav-1',
        name: 'Important Contract.pdf',
        path: '/documents/work',
        icon: 'FileText',
        size: 1234567
      },
      {
        id: 'fav-2',
        name: 'Family Vacation.zip',
        path: '/archives',
        icon: 'Archive',
        size: 123456789
      }
    ];

    // Mock smart folders
    const mockSmartFolders = [
      {
        id: 'smart-1',
        name: 'Recently Modified',
        description: 'Files modified in the last 7 days',
        icon: 'Clock',
        count: 23,
        color: 'text-blue-500'
      },
      {
        id: 'smart-2',
        name: 'Large Files',
        description: 'Files larger than 100MB',
        icon: 'HardDrive',
        count: 8,
        color: 'text-orange-500'
      },
      {
        id: 'smart-3',
        name: 'Shared Files',
        description: 'Files with active share links',
        icon: 'Share2',
        count: 15,
        color: 'text-green-500'
      },
      {
        id: 'smart-4',
        name: 'Unencrypted',
        description: 'Files without encryption',
        icon: 'ShieldOff',
        count: 5,
        color: 'text-red-500'
      },
      {
        id: 'smart-5',
        name: 'Duplicates',
        description: 'Potential duplicate files',
        icon: 'Copy',
        count: 12,
        color: 'text-purple-500'
      }
    ];

    setRecentFiles(mockRecentFiles);
    setFavoriteFiles(mockFavoriteFiles);
    setSmartFolders(mockSmartFolders);
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleQuickAccess = (type, item) => {
    if (onQuickAccess) {
      onQuickAccess(type, item);
    }
  };

  const handleSmartFolderClick = (smartFolder) => {
    if (onSmartFolderSelect) {
      onSmartFolderSelect(smartFolder);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Smart Folders */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Sparkles" size={18} className="text-primary" />
            <span>Smart Folders</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Automatically organized collections
          </p>
        </div>
        <div className="p-2">
          {smartFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => handleSmartFolderClick(folder)}
              className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-muted transition-smooth text-left"
            >
              <Icon 
                name={folder.icon} 
                size={18} 
                className={folder.color} 
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm">
                  {folder.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {folder.description}
                </div>
              </div>
              <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                {folder.count}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Clock" size={18} className="text-primary" />
              <span>Recent Files</span>
            </h3>
            <Button
              variant="ghost"
              size="xs"
              iconName="MoreHorizontal"
              onClick={() => handleQuickAccess('recent', 'view-all')}
            />
          </div>
        </div>
        <div className="p-2">
          {recentFiles.length > 0 ? (
            recentFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => handleQuickAccess('recent', file)}
                className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-muted transition-smooth text-left"
              >
                <Icon 
                  name={file.icon} 
                  size={18} 
                  className="text-muted-foreground" 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">
                    {file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimeAgo(file.accessedAt)} • {formatFileSize(file.size)}
                  </div>
                </div>
                <Icon 
                  name="ChevronRight" 
                  size={14} 
                  className="text-muted-foreground" 
                />
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Icon name="Clock" size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent files</p>
            </div>
          )}
        </div>
      </div>

      {/* Favorite Files */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Star" size={18} className="text-warning" />
              <span>Favorites</span>
            </h3>
            <Button
              variant="ghost"
              size="xs"
              iconName="MoreHorizontal"
              onClick={() => handleQuickAccess('favorites', 'view-all')}
            />
          </div>
        </div>
        <div className="p-2">
          {favoriteFiles.length > 0 ? (
            favoriteFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => handleQuickAccess('favorites', file)}
                className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-muted transition-smooth text-left"
              >
                <Icon 
                  name={file.icon} 
                  size={18} 
                  className="text-muted-foreground" 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">
                    {file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <Icon 
                  name="Star" 
                  size={14} 
                  className="text-warning" 
                />
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Icon name="Star" size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No favorite files</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Zap" size={18} className="text-primary" />
            <span>Quick Actions</span>
          </h3>
        </div>
        <div className="p-2 space-y-1">
          <Button
            variant="ghost"
            fullWidth
            iconName="Upload"
            iconPosition="left"
            onClick={() => handleQuickAccess('action', 'upload')}
            className="justify-start"
          >
            Upload Files
          </Button>
          <Button
            variant="ghost"
            fullWidth
            iconName="FolderPlus"
            iconPosition="left"
            onClick={() => handleQuickAccess('action', 'create-folder')}
            className="justify-start"
          >
            Create Folder
          </Button>
          <Button
            variant="ghost"
            fullWidth
            iconName="Search"
            iconPosition="left"
            onClick={() => handleQuickAccess('action', 'advanced-search')}
            className="justify-start"
          >
            Advanced Search
          </Button>
          <Button
            variant="ghost"
            fullWidth
            iconName="BarChart3"
            iconPosition="left"
            onClick={() => handleQuickAccess('action', 'storage-analytics')}
            className="justify-start"
          >
            Storage Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessPanel;