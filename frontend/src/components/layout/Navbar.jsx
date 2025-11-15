import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard',
      '/practice': 'Practice',
      '/village': 'Village',
      '/analytics': 'Analytics',
      '/community': 'Community',
      '/tutorials': 'Tutorials',
      '/profile': 'Profile',
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <header className="bg-dark-900 border-b border-dark-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-dark-400 hover:text-dark-100 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page title */}
            <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-dark-100">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications placeholder */}
            <button className="p-2 rounded-full text-dark-400 hover:text-dark-100 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User menu */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                {/* User avatar */}
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-medium text-sm">
                  {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                </div>
                
                {/* User info */}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-dark-100">
                    {user?.firstName || user?.email || 'User'}
                  </div>
                  <div className="text-xs text-dark-400">
                    Student
                  </div>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-dark-400 hover:text-dark-100 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  title="Logout"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;