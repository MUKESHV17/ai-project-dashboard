import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-dark-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin glow-brand" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading workspace...</p>
      </div>
    );
  }

  // Enforce session check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50 dark:bg-dark-950">
      {/* Background Animated Gradient Mesh */}
      <div className="bg-mesh" />

      {/* Sidebar Panel */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden">
        {/* Header Toolbar */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Dynamic Nested Routes */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
