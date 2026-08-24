import { useState, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, CircularProgress, Box, ThemeProvider } from '@mui/material';
import './App.css';
import { jwtDecode } from 'jwt-decode';
import {Toaster} from 'react-hot-toast';

// --- Feature Pages ---
import Dashboard from './features/dashboard/pages/Dashboard';
import AdminDashboard from './features/admin-dashboard/pages/AdminDashboard';
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
import ControlCenter from './features/admin-dashboard/control-center/ControlCenter';
import AdminLayout from './features/admin-dashboard/components/AdminLayout';
import ApplyNGO from './features/dashboard/pages/NgoApply';
import NGODetailsPage from './features/admin-dashboard/pages/NGODetailsPage';
import NGODashboard from './features/ngo/pages/NGODashboardPage';
import theme from './features/admin-dashboard/theme';
import UserLayout from './layouts/UserLayout';


const validateToken = async (): Promise<boolean> => {
  // actually validate the token with the server
  // abhi ke liye hai bas
  return !!localStorage.getItem('authToken');
};

interface ProtectedRouteProps {
  children: ReactNode;
}

interface TokenPayload {
  role: string;
}

/**Need to improve this, can centralize it 
 * src/
 ├─ auth/
 │   ├─ AuthContext.tsx
 │   ├─ useAuth.ts
 │   └─ getUserFromToken.ts
 │
 ├─ routes/
 │   ├─ ProtectedRoute.tsx
 │   └─ AdminRoute.tsx
 */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (decoded.role !== "SUPER_ADMIN") {
      return <Navigate to="/dashboard" />;
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
      <ThemeProvider theme={theme}>
      <Toaster position="top-right" />
      <CssBaseline />
      <Router>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<LandingPage />} />
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
            <Route path="/all-tasks" element={<AllTasksPage />} />
            <Route path="/community-tasks" element={<AllTasks />} />
            <Route path="/tasks/:taskId" element={<IndividualTaskPage />} />
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