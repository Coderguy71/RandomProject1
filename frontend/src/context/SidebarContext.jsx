import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) {
      return JSON.parse(stored);
    }
    return window.innerWidth < 1024;
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Track if user manually toggled (to prevent auto-collapse override)
  const [userToggled, setUserToggled] = useState(false);

  // Auto-collapse on non-dashboard pages (desktop only)
  useEffect(() => {
    const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';
    const isDesktop = window.innerWidth >= 1024;
    
    // Close mobile sidebar on navigation
    setIsMobileOpen(false);
    
    // Auto-collapse on non-dashboard pages (only if user hasn't manually toggled)
    if (isDesktop && !isDashboard && !userToggled) {
      setIsCollapsed(true);
    }
    
    // Reset user toggle flag after navigation
    if (userToggled) {
      setUserToggled(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setIsMobileOpen(false);
    setUserToggled(true);
  };

  const openMobileSidebar = () => {
    setIsMobileOpen(true);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const value = {
    isCollapsed,
    setIsCollapsed,
    toggleCollapse,
    isMobileOpen,
    openMobileSidebar,
    closeMobileSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;
