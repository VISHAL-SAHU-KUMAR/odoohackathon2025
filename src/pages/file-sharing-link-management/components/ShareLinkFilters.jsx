import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ShareLinkFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status', count: 24 },
    { value: 'active', label: 'Active', count: 18 },
    { value: 'expired', label: 'Expired', count: 4 },
    { value: 'revoked', label: 'Revoked', count: 2 }
  ];

  const securityOptions = [
    { value: 'all', label: 'All Security', icon: 'Shield' },
    { value: 'password', label: 'Password Protected', icon: 'Lock' },
    { value: 'otp', label: 'OTP Required', icon: 'Key' },
    { value: 'limited', label: 'Download Limited', icon: 'Download' }
  ];

  const sortOptions = [
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
    { value: 'access_desc', label: 'Most Accessed' },
    { value: 'name_asc', label: 'Name A-Z' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = () => {
    return filters.status !== 'all' || 
           filters.security !== 'all' || 
           filters.search !== '' ||
           filters.dateRange !== 'all';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search files or links..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasActiveFilters() && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {/* Status Filter */}
        <div className="flex items-center space-x-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('status', option.value)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                filters.status === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{option.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filters.status === option.value
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-foreground/10 text-foreground'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Security & Date Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Security Filter */}
        <div className="flex items-center space-x-1">
          {securityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('security', option.value)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                filters.security === option.value
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={option.icon} size={14} />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center space-x-1">
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="px-3 py-1.5 border border-border rounded-md text-sm bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={14} />
            <span>
              Showing filtered results
              {filters.search && ` for "${filters.search}"`}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {/* This would show actual count in real implementation */}
            12 of 24 links
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareLinkFilters;