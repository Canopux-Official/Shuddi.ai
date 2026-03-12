import { useState, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import './App.css';

// --- Feature Pages ---
import Dashboard from './features/dashboard/pages/Dashboard';
import ProfilePage from './features/profile/pages/Profile';
import SignupPage from './features/auth/pages/SignupPage';
import LoginPage from './features/auth/pages/LoginPage';
import RewardsPage from './features/reward/pages/RewardPage';
import { SocialFeed } from "./features/feed/pages/socialFeed";
import LandingPage from './features/landing/pages/LandingPage';
// Import the new Task Page
import IndividualTaskPage from './features/individual-tasks/pages/IndividualTaskPage';
import AllTasksPage from './features/individual-tasks/pages/AllTasksPage';
import AllTasks from './features/community-task/pages/allTask'

const validateToken = async (): Promise<boolean> => {
  // actually validate the token with the server
  // abhi ke liye hai bas
  return !!localStorage.getItem('authToken');
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const isValid = await validateToken();
      if (!isValid) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/login" element={<LoginPage />} />

          {/* --- Protected Routes --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reward"
            element={
              <ProtectedRoute>
                <RewardsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/s"
            element={
              <ProtectedRoute>
                <SocialFeed />
              </ProtectedRoute>
            }
          />

          {/* NEW ROUTE ADDED HERE */}
          <Route
            path="/all-tasks"
            element={
              <ProtectedRoute>
                <AllTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community-tasks"
            element={
              <ProtectedRoute>
                <AllTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:taskId"
            element={
              <ProtectedRoute>
                <IndividualTaskPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '50px' }}>404: Page Not Found</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;