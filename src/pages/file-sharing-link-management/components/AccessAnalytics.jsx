import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccessAnalytics = ({ shareLink, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock analytics data
  const accessData = [
    { date: '2025-01-07', accesses: 12, downloads: 8, unique: 6 },
    { date: '2025-01-08', accesses: 18, downloads: 12, unique: 9 },
    { date: '2025-01-09', accesses: 24, downloads: 16, unique: 12 },
    { date: '2025-01-10', accesses: 15, downloads: 10, unique: 8 },
    { date: '2025-01-11', accesses: 21, downloads: 14, unique: 11 },
    { date: '2025-01-12', accesses: 30, downloads: 20, unique: 15 },
    { date: '2025-01-13', accesses: 27, downloads: 18, unique: 13 }
  ];

  const locationData = [
    { country: 'United States', value: 45, color: '#1E3A8A' },
    { country: 'United Kingdom', value: 25, color: '#059669' },
    { country: 'Germany', value: 15, color: '#F59E0B' },
    { country: 'Canada', value: 10, color: '#DC2626' },
    { country: 'Others', value: 5, color: '#64748B' }
  ];

  const accessLogs = [
    {
      id: 1,
      timestamp: '2025-01-13T10:30:00Z',
      ip: '192.168.1.100',
      location: 'New York, US',
      userAgent: 'Chrome 120.0.0.0',
      action: 'download',
      status: 'success'
    },
    {
      id: 2,
      timestamp: '2025-01-13T09:15:00Z',
      ip: '10.0.0.50',
      location: 'London, UK',
      userAgent: 'Safari 17.0',
      action: 'preview',
      status: 'success'
    },
    {
      id: 3,
      timestamp: '2025-01-13T08:45:00Z',
      ip: '172.16.0.25',
      location: 'Berlin, DE',
      userAgent: 'Firefox 121.0',
      action: 'access',
      status: 'failed'
    },
    {
      id: 4,
      timestamp: '2025-01-12T16:20:00Z',
      ip: '203.0.113.42',
      location: 'Toronto, CA',
      userAgent: 'Edge 120.0.0.0',
      action: 'download',
      status: 'success'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'geography', label: 'Geography', icon: 'Globe' },
    { id: 'logs', label: 'Access Logs', icon: 'List' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'text-success' : 'text-error';
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'download':
        return 'Download';
      case 'preview':
        return 'Eye';
      case 'access':
        return 'Globe';
      default:
        return 'Activity';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{shareLink.accessCount}</div>
                <div className="text-sm text-muted-foreground">Total Access</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{shareLink.downloadCount}</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">24</div>
                <div className="text-sm text-muted-foreground">Unique Visitors</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">67%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>

            {/* Access Trend Chart */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Access Trends (Last 7 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="var(--color-muted-foreground)"
                    />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip 
                      labelFormatter={(value) => formatDate(value)}
                      contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accesses" 
                      stroke="var(--color-primary)" 
                      strokeWidth={2}
                      name="Accesses"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="downloads" 
                      stroke="var(--color-success)" 
                      strokeWidth={2}
                      name="Downloads"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'geography':
        return (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Access by Location</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {locationData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-foreground">{item.country}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Recent Access Logs</h3>
              </div>
              <div className="divide-y divide-border">
                {accessLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-muted/50 transition-smooth">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-md ${
                          log.status === 'success' ? 'bg-success/10' : 'bg-error/10'
                        }`}>
                          <Icon 
                            name={getActionIcon(log.action)} 
                            size={16} 
                            className={getStatusColor(log.status)}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-foreground capitalize">
                              {log.action}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              log.status === 'success' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>IP: {log.ip} • {log.location}</div>
                            <div>{log.userAgent}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Share Analytics</h2>
            <p className="text-sm text-muted-foreground">{shareLink.fileName}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AccessAnalytics;