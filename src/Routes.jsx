import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Authentication imports
import Login from "pages/authentication/Login";
import Signup from "pages/authentication/Signup";
import ForgotPassword from "pages/authentication/ForgotPassword";
// App page imports
import FileUploadInterface from "pages/file-upload-interface";
import FileStorageDashboard from "pages/file-storage-dashboard";
import FileOrganizationSearch from "pages/file-organization-search";
import FileSharingLinkManagement from "pages/file-sharing-link-management";
import UserProfileSecuritySettings from "pages/user-profile-security-settings";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Authentication routes */}
        <Route path="/authentication/login" element={<Login />} />
        <Route path="/authentication/signup" element={<Signup />} />
        <Route path="/authentication/forgot-password" element={<ForgotPassword />} />
        
        {/* App routes - accessible for development preview */}
        <Route path="/" element={<FileStorageDashboard />} />
        <Route path="/file-upload-interface" element={<FileUploadInterface />} />
        <Route path="/file-storage-dashboard" element={<FileStorageDashboard />} />
        <Route path="/file-organization-search" element={<FileOrganizationSearch />} />
        <Route path="/file-sharing-link-management" element={<FileSharingLinkManagement />} />
        <Route path="/user-profile-security-settings" element={<UserProfileSecuritySettings />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;