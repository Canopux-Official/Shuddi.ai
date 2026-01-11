
import './App.css'
import Dashboard from './features/dashboard/pages/Dashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfilePage from './features/profile/pages/Profile';
import SignupPage from './features/auth/pages/SignupPage';
import LoginPage from './features/auth/pages/LoginPage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
