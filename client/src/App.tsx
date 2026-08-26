import { useState, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, CircularProgress, Box, ThemeProvider } from '@mui/material';
import './App.css';
import { jwtDecode } from 'jwt-decode';
import { Toaster } from 'react-hot-toast';

// --- Feature Pages ---
import Dashboard from './features/dashboard/pages/Dashboard';
import AdminDashboard from './features/admin-dashboard/pages/AdminDashboard';
import ProfilePage from './features/profile/pages/Profile';
import SignupPage from './features/auth/pages/SignupPage';
import LoginPage from './features/auth/pages/LoginPage';
import RewardsPage from './features/reward/pages/RewardPage';
import { SocialFeed } from "./features/feed/pages/socialFeed";
// import LandingPage from './features/landing/pages/LandingPage'; // Replaced by RootRedirect logic

// Import the new Task Page
import IndividualTaskPage from './features/individual-tasks/pages/IndividualTaskPage';
// import AllTasksPage from './features/individual-tasks/pages/AllTasksPage';
// import AllTasks from './features/community-task/pages/allTask';
import TasksPage from './features/tasks-browse/pages/TasksPage';
import ControlCenter from './features/admin-dashboard/control-center/ControlCenter';
import AdminLayout from './features/admin-dashboard/components/AdminLayout';
import ApplyNGO from './features/dashboard/pages/NgoApply';
import NGODetailsPage from './features/admin-dashboard/pages/NGODetailsPage';
import NGODashboard from './features/ngo/pages/NGODashboardPage';
import theme from './features/admin-dashboard/theme';
import UserLayout from './layouts/UserLayout';
import CommunityTaskPage from './features/community-task/pages/communityTask';

interface TokenPayload {
  role: string;
  exp: number; // Added exp field which is populated by the backend's expiresIn
}

// Check if token exists and hasn't expired
const validateToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds to match JWT exp

    if (decoded.exp < currentTime) {
      // Token is expired
      return false;
    }

    // Token is valid
    // Note: You can still add your actual server-side validation call here later if needed
    return true;
  } catch (error) {
    // If jwtDecode fails (e.g., malformed token), it's invalid
    return false;
  }
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime || decoded.role !== "SUPER_ADMIN") {
      localStorage.removeItem("authToken"); // Clean up if expired
      return <Navigate to="/auth/login" />;
    }

    return children;
  } catch {
    return <Navigate to="/auth/login" />;
  }
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        localStorage.removeItem('authToken'); // Clean up invalid/expired token
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

// New Component to handle the root '/' redirect logic
const RootRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();
      setIsAuthenticated(isValid);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/login" replace />;
};

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Toaster position="top-right" />
        <CssBaseline />
        <Router>
          <Routes>
            {/* --- Public Routes --- */}
            {/* Replace LandingPage with the new RootRedirect component */}
            <Route path="/" element={<RootRedirect />} />

            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/login" element={<LoginPage />} />

            {/* --- User Routes (Protected + Header via UserLayout) --- */}
            <Route
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/apply-for-ngo" element={<ApplyNGO />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/reward" element={<RewardsPage />} />
              <Route path="/s" element={<SocialFeed />} />
              <Route path="/all-tasks" element={<TasksPage />} />
              <Route path="/tasks/:taskId" element={<IndividualTaskPage />} />
              <Route path="/community-tasks/:taskId" element={<CommunityTaskPage />} />
            </Route>

            {/* --- NGO Route (Protected, NO user header) --- */}
            <Route
              path="/ngo-dashboard"
              element={
                <ProtectedRoute>
                  <NGODashboard />
                </ProtectedRoute>
              }
            />

            {/* --- Admin Routes (NO user header) --- */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/control-center"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ControlCenter />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/super-admin/ngo/:ngoId"
              element={
                <ProtectedRoute>
                  <NGODetailsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '50px' }}>404: Page Not Found</h1>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;