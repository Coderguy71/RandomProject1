import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';

// Layout Components
import Layout from './components/layout/Layout';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Page Components
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Practice from './pages/practice/Practice';
import Tutorials from './pages/tutorials/Tutorials';
import Profile from './pages/profile/Profile';

// Component Showcase
import ComponentShowcase from './components/ComponentShowcase';

// UI Components
import { Spinner } from './components/ui';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-dark-950 flex items-center justify-center">
    <Spinner size="xl" variant="gradient" label="Loading..." />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Main App Content
function AppContent() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="practice/*" element={<Practice />} />
          <Route path="tutorials" element={<Tutorials />} />
          <Route path="profile" element={<Profile />} />
          <Route path="showcase" element={<ComponentShowcase />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;