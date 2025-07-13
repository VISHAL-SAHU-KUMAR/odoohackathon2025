import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import ContextualActionBar from '../../components/ui/ContextualActionBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import ShareLinkWizard from './components/ShareLinkWizard';
import ShareLinkCard from './components/ShareLinkCard';
import AccessAnalytics from './components/AccessAnalytics';
import ShareLinkFilters from './components/ShareLinkFilters';
import BulkActionsBar from './components/BulkActionsBar';

const FileSharingLinkManagement = () => {
  const [shareLinks, setShareLinks] = useState([]);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyticsLink, setAnalyticsLink] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    security: 'all',
    dateRange: 'all',
    sort: 'created_desc'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock share links data
  const mockShareLinks = [
    {
      id: 1,
      fileName: 'Project_Proposal_2025.pdf',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      url: 'https://securevault.app/share/abc123def456',
      status: 'active',
      createdAt: '2025-01-10T14:30:00Z',
      expiresAt: '2025-01-20T14:30:00Z',
      accessCount: 24,
      downloadCount: 18,
      passwordProtected: true,
      otpRequired: false,
      downloadLimit: true,
      maxDownloads: 50,
      trackAccess: true
    },
    {
      id: 2,
      fileName: 'Marketing_Strategy.docx',
      fileSize: '1.8 MB',
      fileType: 'DOCX',
      url: 'https://securevault.app/share/xyz789ghi012',
      status: 'active',
      createdAt: '2025-01-08T09:15:00Z',
      expiresAt: null,
      accessCount: 12,
      downloadCount: 8,
      passwordProtected: false,
      otpRequired: true,
      downloadLimit: false,
      maxDownloads: null,
      trackAccess: true
    },
    {
      id: 3,
      fileName: 'Financial_Report_Q4.xlsx',
      fileSize: '3.2 MB',
      fileType: 'XLSX',
      url: 'https://securevault.app/share/mno345pqr678',
      status: 'expired',
      createdAt: '2025-01-05T16:45:00Z',
      expiresAt: '2025-01-12T16:45:00Z',
      accessCount: 45,
      downloadCount: 32,
      passwordProtected: true,
      otpRequired: true,
      downloadLimit: true,
      maxDownloads: 100,
      trackAccess: true
    },
    {
      id: 4,
      fileName: 'Team_Photos.zip',
      fileSize: '15.7 MB',
      fileType: 'ZIP',
      url: 'https://securevault.app/share/stu901vwx234',
      status: 'revoked',
      createdAt: '2025-01-03T11:20:00Z',
      expiresAt: '2025-01-25T11:20:00Z',
      accessCount: 8,
      downloadCount: 3,
      passwordProtected: false,
      otpRequired: false,
      downloadLimit: false,
      maxDownloads: null,
      trackAccess: false
    },
    {
      id: 5,
      fileName: 'Product_Demo.mp4',
      fileSize: '45.3 MB',
      fileType: 'MP4',
      url: 'https://securevault.app/share/def567ghi890',
      status: 'active',
      createdAt: '2025-01-12T13:10:00Z',
      expiresAt: '2025-01-19T13:10:00Z',
      accessCount: 67,
      downloadCount: 42,
      passwordProtected: true,
      otpRequired: false,
      downloadLimit: true,
      maxDownloads: 200,
      trackAccess: true
    }
  ];

  useEffect(() => {
    // Simulate loading share links
    const loadShareLinks = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShareLinks(mockShareLinks);
      } catch (error) {
        console.error('Failed to load share links:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShareLinks();
  }, []);

  const handleCreateShareLink = () => {
    // Mock file selection for demo
    const mockFile = {
      name: 'New_Document.pdf',
      size: '1.2 MB',
      type: 'PDF'
    };
    setSelectedFile(mockFile);
    setShowWizard(true);
  };

  const handleLinkGenerated = (linkData) => {
    const newLink = {
      id: shareLinks.length + 1,
      fileName: linkData.file.name,
      fileSize: linkData.file.size,
      fileType: linkData.file.type,
      url: linkData.link,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: linkData.settings.expirationEnabled ? linkData.settings.expirationDate : null,
      accessCount: 0,
      downloadCount: 0,
      passwordProtected: linkData.settings.passwordProtected,
      otpRequired: linkData.settings.otpRequired,
      downloadLimit: linkData.settings.downloadLimit,
      maxDownloads: linkData.settings.maxDownloads,
      trackAccess: linkData.settings.trackAccess
    };
    
    setShareLinks(prev => [newLink, ...prev]);
    setShowWizard(false);
    setSelectedFile(null);
  };

  const handleLinkAction = (action, link) => {
    switch (action) {
      case 'copy':
        // Handle copy action
        break;
      case 'edit':
        // Handle edit action
        break;
      case 'analytics':
        setAnalyticsLink(link);
        setShowAnalytics(true);
        break;
      case 'revoke':
        setShareLinks(prev => 
          prev.map(l => l.id === link.id ? { ...l, status: 'revoked' } : l)
        );
        break;
      default:
        break;
    }
  };

  const handleBulkAction = async (action, links) => {
    switch (action) {
      case 'extend':
        // Handle extend expiry
        break;
      case 'password':
        // Handle add password
        break;
      case 'export':
        // Handle export
        break;
      case 'revoke':
        const linkIds = links.map(l => l.id);
        setShareLinks(prev => 
          prev.map(l => linkIds.includes(l.id) ? { ...l, status: 'revoked' } : l)
        );
        setSelectedLinks([]);
        break;
      default:
        break;
    }
  };

  const handleContextualAction = (actionId) => {
    switch (actionId) {
      case 'create-share-link':
        handleCreateShareLink();
        break;
      case 'bulk-manage':
        // Handle bulk management
        break;
      case 'export-links':
        // Handle export all links
        break;
      case 'revoke-selected':
        if (selectedLinks.length > 0) {
          handleBulkAction('revoke', selectedLinks);
        }
        break;
      default:
        break;
    }
  };

  const handleSelectLink = (link, checked) => {
    if (checked) {
      setSelectedLinks(prev => [...prev, link]);
    } else {
      setSelectedLinks(prev => prev.filter(l => l.id !== link.id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLinks(filteredLinks);
    } else {
      setSelectedLinks([]);
    }
  };

  const filteredLinks = shareLinks.filter(link => {
    if (filters.search && !link.fileName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && link.status !== filters.status) {
      return false;
    }
    if (filters.security !== 'all') {
      switch (filters.security) {
        case 'password':
          if (!link.passwordProtected) return false;
          break;
        case 'otp':
          if (!link.otpRequired) return false;
          break;
        case 'limited':
          if (!link.downloadLimit) return false;
          break;
      }
    }
    return true;
  });

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      security: 'all',
      dateRange: 'all',
      sort: 'created_desc'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>File Sharing & Link Management - SecureVault</title>
        <meta name="description" content="Manage secure file sharing links with comprehensive access control and analytics tracking" />
      </Helmet>

      <Header />
      
      <main className="w-full">
        {/* Navigation & Actions */}
        <div className="border-b border-border bg-surface">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            <NavigationBreadcrumbs />
          </div>
          <ContextualActionBar 
            selectedFiles={selectedLinks}
            onAction={handleContextualAction}
          />
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Share Management</h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage secure sharing links for your encrypted files
                </p>
              </div>
              <Button
                onClick={handleCreateShareLink}
                iconName="Plus"
                iconPosition="left"
                className="hidden sm:flex"
              >
                Create Share Link
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <ShareLinkFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Share Links List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading share links...</span>
                </div>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Share2" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Share Links Found</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.status !== 'all' || filters.security !== 'all' ?'No links match your current filters. Try adjusting your search criteria.' :'Create your first secure sharing link to get started.'
                  }
                </p>
                <Button
                  onClick={handleCreateShareLink}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Create Share Link
                </Button>
              </div>
            ) : (
              <>
                {/* Select All */}
                <div className="flex items-center justify-between bg-surface border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedLinks.length === filteredLinks.length && filteredLinks.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <span className="text-sm text-foreground">
                      Select all {filteredLinks.length} link{filteredLinks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {selectedLinks.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {selectedLinks.length} selected
                    </span>
                  )}
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredLinks.map((link) => (
                    <div key={link.id} className="relative">
                      <div className="absolute top-4 left-4 z-10">
                        <Checkbox
                          checked={selectedLinks.some(l => l.id === link.id)}
                          onChange={(e) => handleSelectLink(link, e.target.checked)}
                        />
                      </div>
                      <div className="pl-10">
                        <ShareLinkCard
                          shareLink={link}
                          onAction={handleLinkAction}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showWizard && (
        <ShareLinkWizard
          selectedFile={selectedFile}
          onLinkGenerated={handleLinkGenerated}
          onClose={() => {
            setShowWizard(false);
            setSelectedFile(null);
          }}
        />
      )}

      {showAnalytics && analyticsLink && (
        <AccessAnalytics
          shareLink={analyticsLink}
          onClose={() => {
            setShowAnalytics(false);
            setAnalyticsLink(null);
          }}
        />
      )}

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedLinks={selectedLinks}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedLinks([])}
      />

      {/* Mobile Create Button */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          onClick={handleCreateShareLink}
          size="lg"
          iconName="Plus"
          className="rounded-full shadow-elevated"
        />
      </div>
    </div>
  );
};

export default FileSharingLinkManagement;