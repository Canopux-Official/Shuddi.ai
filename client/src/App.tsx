
import './App.css'
import Dashboard from './features/dashboard/pages/Dashboard'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProfilePage from './features/profile/pages/Profile';
import RewardsPage from './features/reward/pages/RewardPage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reward" element={<RewardsPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
