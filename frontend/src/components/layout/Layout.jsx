import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSidebar } from '../../context/SidebarContext';

const Layout = () => {
  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar();

  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-900/80 backdrop-blur-sm lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area - flex column to fill remaining space */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
        `}
      >
        {/* Navbar - no extra margin/padding between navbar and content */}
        <Navbar />

        {/* Page content - grows to fill available space */}
        <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;