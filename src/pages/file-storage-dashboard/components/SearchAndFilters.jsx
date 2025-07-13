import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchAndFilters = ({ onSearch, onFilter, onViewModeChange, viewMode = 'grid', className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    { id: 'recent', label: 'Recent', icon: 'Clock' },
    { id: 'images', label: 'Images', icon: 'Image' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'videos', label: 'Videos', icon: 'Video' },
    { id: 'audio', label: 'Audio', icon: 'Music' },
    { id: 'encrypted', label: 'Encrypted', icon: 'Shield' },
    { id: 'shared', label: 'Shared', icon: 'Share2' },
    { id: 'favorites', label: 'Favorites', icon: 'Star' }
  ];

  const sortOptions = [
    { id: 'name-asc', label: 'Name A-Z', icon: 'ArrowUp' },
    { id: 'name-desc', label: 'Name Z-A', icon: 'ArrowDown' },
    { id: 'date-desc', label: 'Newest First', icon: 'Calendar' },
    { id: 'date-asc', label: 'Oldest First', icon: 'Calendar' },
    { id: 'size-desc', label: 'Largest First', icon: 'HardDrive' },
    { id: 'size-asc', label: 'Smallest First', icon: 'HardDrive' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterToggle = (filterId) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    if (onFilter) {
      onFilter([]);
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search files..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
        </div>
        
        {/* Filter Toggle */}
        <Button
          variant={showFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          iconName="Filter"
        />
        
        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? "default" : "ghost"}
            size="xs"
            onClick={() => onViewModeChange && onViewModeChange('grid')}
            iconName="Grid3X3"
            className="h-8 w-8"
          />
          <Button
            variant={viewMode === 'list' ? "default" : "ghost"}
            size="xs"
            onClick={() => onViewModeChange && onViewModeChange('list')}
            iconName="List"
            className="h-8 w-8"
          />
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {activeFilters.map(filterId => {
            const filter = filterOptions.find(f => f.id === filterId);
            return (
              <div
                key={filterId}
                className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
              >
                <Icon name={filter?.icon || 'Tag'} size={12} />
                <span>{filter?.label}</span>
                <button
                  onClick={() => handleFilterToggle(filterId)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-smooth"
                >
                  <Icon name="X" size={10} />
                </button>
              </div>
            );
          })}
          <Button
            variant="ghost"
            size="xs"
            onClick={clearAllFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          {/* Filter Categories */}
          <div>
            <h4 className="font-medium text-foreground mb-2">File Types & Status</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterToggle(filter.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm transition-smooth ${
                    activeFilters.includes(filter.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  <Icon name={filter.icon} size={14} />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className="font-medium text-foreground mb-2">Sort By</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => onFilter && onFilter([...activeFilters, `sort:${option.id}`])}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name={option.icon} size={14} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile View Mode Toggle */}
          <div className="sm:hidden">
            <h4 className="font-medium text-foreground mb-2">View Mode</h4>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange && onViewModeChange('grid')}
                iconName="Grid3X3"
                iconPosition="left"
                className="flex-1"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange && onViewModeChange('list')}
                iconName="List"
                iconPosition="left"
                className="flex-1"
              >
                List
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;