import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import StorageAnalytics from './components/StorageAnalytics';
import SearchAndFilters from './components/SearchAndFilters';
import FileGrid from './components/FileGrid';
import FloatingActionButton from './components/FloatingActionButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import fileService from '../../utils/fileService';

const FileStorageDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [error, setError] = useState('');

  // Load user files
  useEffect(() => {
    let isMounted = true;

    const loadUserFiles = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError('');

        const result = await fileService.getUserFiles(user.id, {
          sortBy: 'created_at',
          sortOrder: 'desc'
        });

        if (result?.success && isMounted) {
          setFiles(result.data || []);
          setFilteredFiles(result.data || []);
        } else if (isMounted) {
          setError(result?.error || 'Failed to load files');
        }
      } catch (error) {
        if (isMounted) {
          setError('Something went wrong loading files');
          console.log('Load files error:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!authLoading) {
      loadUserFiles();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id, authLoading]);

  // Apply search and filters
  useEffect(() => {
    let filtered = [...files];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.original_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.file_type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    activeFilters.forEach(filter => {
      switch (filter) {
        case 'recent':
          filtered = filtered.filter(file => {
            const daysDiff = (new Date() - new Date(file.created_at)) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7;
          });
          break;
        case 'images':
          filtered = filtered.filter(file => file.file_type === 'image');
          break;
        case 'documents':
          filtered = filtered.filter(file => ['document', 'pdf'].includes(file.file_type));
          break;
        case 'videos':
          filtered = filtered.filter(file => file.file_type === 'video');
          break;
        case 'audio':
          filtered = filtered.filter(file => file.file_type === 'audio');
          break;
        case 'encrypted':
          filtered = filtered.filter(file => file.encrypted_key);
          break;
        case 'favorites':
          filtered = filtered.filter(file => file.is_favorite);
          break;
        default:
          if (filter.startsWith('sort:')) {
            const sortType = filter.replace('sort:', '');
            switch (sortType) {
              case 'name-asc':
                filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
              case 'name-desc':
                filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                break;
              case 'date-desc':
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
              case 'date-asc':
                filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
              case 'size-desc':
                filtered.sort((a, b) => (b.file_size || 0) - (a.file_size || 0));
                break;
              case 'size-asc':
                filtered.sort((a, b) => (a.file_size || 0) - (b.file_size || 0));
                break;
            }
          }
      }
    });

    setFilteredFiles(filtered);
  }, [files, searchQuery, activeFilters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (filters) => {
    setActiveFilters(filters);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleFileAction = async (action, file) => {
    console.log(`Action: ${action}`, file);
    
    switch (action) {
      case 'download':
        // TODO: Implement IPFS download and decryption
        console.log('Downloading file:', file.name);
        break;
      case 'share': navigate('/file-sharing-link-management', { state: { fileId: file.id } });
        break;
      case 'organize': navigate('/file-organization-search', { state: { fileId: file.id } });
        break;
      case 'favorite':
        try {
          const result = await fileService.toggleFavorite(file.id, !file.is_favorite);
          if (result?.success) {
            setFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, is_favorite: !f.is_favorite } : f
            ));
          }
        } catch (error) {
          console.log('Toggle favorite error:', error);
        }
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete "${file.name || file.original_name}"?`)) {
          try {
            const result = await fileService.deleteFile(file.id);
            if (result?.success) {
              setFiles(prev => prev.filter(f => f.id !== file.id));
              setSelectedFiles(prev => prev.filter(id => id !== file.id));
            } else {
              setError(result?.error || 'Failed to delete file');
            }
          } catch (error) {
            setError('Something went wrong deleting file');
            console.log('Delete file error:', error);
          }
        }
        break;
    }
  };

  const handleFileSelect = (fileId, isSelected) => {
    setSelectedFiles(prev => {
      if (isSelected) {
        return [...prev, fileId];
      } else {
        return prev.filter(id => id !== fileId);
      }
    });
  };

  const handleRefresh = async () => {
    if (!user?.id) return;

    try {
      const result = await fileService.getUserFiles(user.id);
      if (result?.success) {
        setFiles(result.data || []);
        setError('');
      } else {
        setError(result?.error || 'Failed to refresh files');
      }
    } catch (error) {
      setError('Something went wrong refreshing files');
      console.log('Refresh files error:', error);
    }
  };

  // Show auth-required preview for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Shield" size={40} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Preview Mode</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Sign in to access your secure file vault and manage your encrypted files.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={() => navigate('/authentication/login')}
                iconName="LogIn"
                iconPosition="left"
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/authentication/signup')}
                iconName="UserPlus"
                iconPosition="left"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertCircle" size={20} />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-error/80 mt-1">{error}</p>
          </div>
        )}

        {/* Storage Analytics */}
        <StorageAnalytics />

        {/* Search and Filters */}
        <SearchAndFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
          onViewModeChange={handleViewModeChange}
          viewMode={viewMode}
        />

        {/* File Grid */}
        <FileGrid
          files={filteredFiles}
          viewMode={viewMode}
          onFileAction={handleFileAction}
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {/* Empty State */}
        {!isLoading && filteredFiles.length === 0 && files.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Icon name="FolderOpen" size={32} className="text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">No files yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by uploading your first file to your secure encrypted vault.
              </p>
            </div>
            <Button
              onClick={() => navigate('/file-upload-interface')}
              iconName="Upload"
              iconPosition="left"
            >
              Upload Your First File
            </Button>
          </div>
        )}

        {/* No Search Results */}
        {!isLoading && filteredFiles.length === 0 && files.length > 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Icon name="Search" size={32} className="text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">No files match your search</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search terms or filters to find what you are looking for.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setActiveFilters([]);
              }}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Batch Actions Bar */}
        {selectedFiles.length > 0 && (
          <div className="fixed bottom-20 left-4 right-4 bg-card border border-border rounded-lg shadow-elevated p-4 z-40">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {selectedFiles.length} files selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedFiles.forEach(fileId => {
                      const file = files.find(f => f.id === fileId);
                      if (file) handleFileAction('download', file);
                    });
                  }}
                  iconName="Download"
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate('/file-sharing-link-management', { 
                      state: { fileIds: selectedFiles } 
                    });
                  }}
                  iconName="Share2"
                >
                  Share
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${selectedFiles.length} selected files?`)) {
                      selectedFiles.forEach(async (fileId) => {
                        const file = files.find(f => f.id === fileId);
                        if (file) {
                          await handleFileAction('delete', file);
                        }
                      });
                    }
                  }}
                  iconName="Trash2"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default FileStorageDashboard;