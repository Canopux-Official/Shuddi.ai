
import './App.css'
import Dashboard from './features/dashboard/pages/Dashboard'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProfilePage from './features/profile/pages/Profile';
import RewardsPage from './features/reward/pages/RewardPage';

import {SocialFeed} from "./features/feed/pages/socialFeed"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
<<<<<<< HEAD
          <Route path="/reward" element={<RewardsPage />} />
=======
          <Route path="/s" element={<SocialFeed />} />
>>>>>>> c9ae8a6c78b90ff9fc911178e42efbd75dba5bb5
        </Routes>
      </Router>
    </>
  )
}

export default App
