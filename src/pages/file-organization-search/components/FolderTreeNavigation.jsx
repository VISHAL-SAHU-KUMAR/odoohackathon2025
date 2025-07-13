import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FolderTreeNavigation = ({ 
  onFolderSelect, 
  selectedFolder, 
  onCreateFolder, 
  className = '' 
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [folderTree, setFolderTree] = useState([]);

  // Mock folder tree data
  useEffect(() => {
    const mockFolderTree = [
      {
        id: 'root',
        name: 'My Files',
        path: '/',
        children: [
          {
            id: 'documents',
            name: 'Documents',
            path: '/documents',
            fileCount: 24,
            children: [
              {
                id: 'work',
                name: 'Work',
                path: '/documents/work',
                fileCount: 12,
                children: []
              },
              {
                id: 'personal',
                name: 'Personal',
                path: '/documents/personal',
                fileCount: 8,
                children: []
              }
            ]
          },
          {
            id: 'images',
            name: 'Images',
            path: '/images',
            fileCount: 156,
            children: [
              {
                id: 'photos',
                name: 'Photos',
                path: '/images/photos',
                fileCount: 89,
                children: []
              },
              {
                id: 'screenshots',
                name: 'Screenshots',
                path: '/images/screenshots',
                fileCount: 67,
                children: []
              }
            ]
          },
          {
            id: 'videos',
            name: 'Videos',
            path: '/videos',
            fileCount: 23,
            children: []
          },
          {
            id: 'archives',
            name: 'Archives',
            path: '/archives',
            fileCount: 7,
            children: []
          }
        ]
      }
    ];
    setFolderTree(mockFolderTree);
  }, []);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFolderSelect = (folder) => {
    if (onFolderSelect) {
      onFolderSelect(folder);
    }
  };

  const handleCreateFolder = (parentPath) => {
    if (onCreateFolder) {
      onCreateFolder(parentPath);
    }
  };

  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolder?.id === folder.id;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder.id} className="select-none">
        <div
          className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-smooth group ${
            isSelected 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted text-foreground'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => handleFolderSelect(folder)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className={`p-0.5 rounded hover:bg-current hover:bg-opacity-10 ${
                isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={14} 
              />
            </button>
          )}
          
          {!hasChildren && (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-1 h-1 bg-current opacity-30 rounded-full"></div>
            </div>
          )}

          <Icon 
            name={isExpanded ? "FolderOpen" : "Folder"} 
            size={16}
            className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}
          />
          
          <span className="flex-1 text-sm font-medium truncate">
            {folder.name}
          </span>
          
          {folder.fileCount !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              isSelected 
                ? 'bg-primary-foreground/20 text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {folder.fileCount}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCreateFolder(folder.path);
            }}
            className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-current hover:bg-opacity-10 transition-smooth ${
              isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}
            title="Create subfolder"
          >
            <Icon name="Plus" size={12} />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {folder.children.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Folders</h3>
          <Button
            variant="ghost"
            size="xs"
            iconName="FolderPlus"
            onClick={() => handleCreateFolder('/')}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>
      
      <div className="p-2 max-h-96 overflow-y-auto">
        {folderTree.map(folder => renderFolder(folder))}
      </div>
    </div>
  );
};

export default FolderTreeNavigation;