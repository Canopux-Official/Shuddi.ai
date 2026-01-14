
// import './App.css'
// import Dashboard from './features/dashboard/pages/Dashboard'
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import ProfilePage from './features/profile/pages/Profile';

import {SocialFeed} from "./features/feed/pages/socialFeed"

function App() {

  return (
    <>
      {/* <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router> */}
      <SocialFeed/>
    </>
  )
}

export default App
