import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area - flex column to fill remaining space */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Navbar - no extra margin/padding between navbar and content */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content - grows to fill available space */}
        <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;