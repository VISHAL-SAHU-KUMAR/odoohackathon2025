import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SearchInterface = ({ 
  onSearch, 
  onFilterChange, 
  searchQuery = '', 
  className = '' 
}) => {
  const [query, setQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    fileType: '',
    dateRange: '',
    encryptionStatus: '',
    sharingStatus: '',
    sizeRange: ''
  });
  const searchRef = useRef(null);

  // Mock recent searches and suggestions
  useEffect(() => {
    const mockRecentSearches = [
      "project documents",
      "vacation photos",
      "tax documents 2024",
      "presentation slides",
      "backup files"
    ];
    setRecentSearches(mockRecentSearches);
  }, []);

  const fileTypeOptions = [
    { value: '', label: 'All file types' },
    { value: 'document', label: 'Documents' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'archive', label: 'Archives' },
    { value: 'other', label: 'Other' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'Any time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Past week' },
    { value: 'month', label: 'Past month' },
    { value: 'year', label: 'Past year' }
  ];

  const encryptionStatusOptions = [
    { value: '', label: 'All files' },
    { value: 'encrypted', label: 'Encrypted only' },
    { value: 'unencrypted', label: 'Unencrypted only' }
  ];

  const sharingStatusOptions = [
    { value: '', label: 'All files' },
    { value: 'shared', label: 'Shared files' },
    { value: 'private', label: 'Private files' }
  ];

  const sizeRangeOptions = [
    { value: '', label: 'Any size' },
    { value: 'small', label: 'Small (< 1MB)' },
    { value: 'medium', label: 'Medium (1MB - 100MB)' },
    { value: 'large', label: 'Large (> 100MB)' }
  ];

  const handleSearch = (searchTerm = query) => {
    if (searchTerm.trim()) {
      // Add to recent searches
      const updatedRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updatedRecent);
    }
    
    if (onSearch) {
      onSearch(searchTerm, filters);
    }
    setShowSuggestions(false);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      fileType: '',
      dateRange: '',
      encryptionStatus: '',
      sharingStatus: '',
      sizeRange: ''
    };
    setFilters(clearedFilters);
    
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <div className="relative">
            <Input
              ref={searchRef}
              type="search"
              placeholder="Search files and folders..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="xs"
                iconName="Search"
                onClick={() => handleSearch()}
                className="text-muted-foreground hover:text-foreground"
              />
              <Button
                variant="ghost"
                size="xs"
                iconName={showFilters ? "ChevronUp" : "SlidersHorizontal"}
                onClick={() => setShowFilters(!showFilters)}
                className={`${hasActiveFilters ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
              />
            </div>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-elevated z-50">
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Recent searches</div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-smooth flex items-center space-x-2"
                  >
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="File Type"
              options={fileTypeOptions}
              value={filters.fileType}
              onChange={(value) => handleFilterChange('fileType', value)}
              className="text-sm"
            />
            
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={filters.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              className="text-sm"
            />
            
            <Select
              label="Encryption"
              options={encryptionStatusOptions}
              value={filters.encryptionStatus}
              onChange={(value) => handleFilterChange('encryptionStatus', value)}
              className="text-sm"
            />
            
            <Select
              label="Sharing Status"
              options={sharingStatusOptions}
              value={filters.sharingStatus}
              onChange={(value) => handleFilterChange('sharingStatus', value)}
              className="text-sm"
            />
            
            <Select
              label="File Size"
              options={sizeRangeOptions}
              value={filters.sizeRange}
              onChange={(value) => handleFilterChange('sizeRange', value)}
              className="text-sm"
            />

            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                iconName="X"
                iconPosition="left"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  
                  const getFilterLabel = (key, value) => {
                    const option = {
                      fileType: fileTypeOptions,
                      dateRange: dateRangeOptions,
                      encryptionStatus: encryptionStatusOptions,
                      sharingStatus: sharingStatusOptions,
                      sizeRange: sizeRangeOptions
                    }[key]?.find(opt => opt.value === value);
                    
                    return option ? option.label : value;
                  };

                  return (
                    <div
                      key={key}
                      className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs"
                    >
                      <span>{getFilterLabel(key, value)}</span>
                      <button
                        onClick={() => handleFilterChange(key, '')}
                        className="hover:bg-primary/20 rounded p-0.5"
                      >
                        <Icon name="X" size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInterface;