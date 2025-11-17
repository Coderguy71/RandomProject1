import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigation } from '../ui';
import { useSidebar } from '../../context/SidebarContext';

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, closeMobileSidebar, toggleCollapse } = useSidebar();
  
  // Check if current page is dashboard
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  const navigation = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'practice',
      label: 'Practice',
      href: '/practice',
      icon: (
        <span className="text-xl">✏️</span>
      ),
    },
    {
      id: 'tutorials',
      label: 'Tutorials',
      href: '/tutorials',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Settings',
      href: '/profile',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const activeItem = location.pathname.split('/')[1] || 'dashboard';

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-950/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bg-card-bg backdrop-blur-xl border-r border-card-border
          transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 lg:inset-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <Link
            to="/dashboard"
            className={`
              flex h-16 items-center border-b border-dark-700 transition-all duration-300
              ${isCollapsed ? 'px-3 lg:justify-center' : 'px-6'}
              hover:bg-dark-800/30
            `}
            onClick={closeMobileSidebar}
            title="Go to Dashboard"
          >
            <h2
              className={`
                text-xl font-bold text-transparent bg-clip-text bg-gradient-premium
                transition-all duration-300 ${isCollapsed ? 'hidden lg:inline-block lg:text-2xl' : ''}
              `}
            >
              {isCollapsed ? '📚' : 'SAT Math Platform'}
            </h2>
          </Link>

          {/* Navigation */}
          <nav className={`flex-1 transition-all duration-300 ${isCollapsed ? 'py-6 lg:px-0' : 'space-y-1 px-4 py-6'}`}>
            {isCollapsed ? (
              <div className="space-y-2 px-2 lg:px-0">
                {navigation.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`
                      w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200
                      ${
                        activeItem === item.id
                          ? 'bg-primary-600/20 text-primary-400 shadow-glow'
                          : 'text-dark-200 hover:bg-dark-700/50 hover:text-primary-400'
                      }
                    `}
                    title={item.label}
                    aria-label={item.label}
                    onClick={closeMobileSidebar}
                  >
                    {item.icon}
                  </Link>
                ))}
              </div>
            ) : (
              <Navigation
                items={navigation}
                activeItem={activeItem}
                orientation="vertical"
                variant="default"
              />
            )}
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="border-t border-dark-700 p-4 transition-all duration-300">
              <div className="rounded-lg bg-gradient-premium p-4 text-white">
                <h3 className="font-semibold mb-1">Keep Learning!</h3>
                <p className="text-sm opacity-90 mb-3">Master SAT Math with practice problems and tutorials.</p>
                <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-sm font-medium transition-colors">
                  Start Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating toggle button on sidebar edge - only show on dashboard and desktop */}
        {isDashboard && (
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex absolute top-20 -right-3 z-50 items-center justify-center w-6 h-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-glow transition-all duration-300 hover:scale-110"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`h-3 w-3 transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default Sidebar;