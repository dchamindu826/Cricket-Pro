import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Frontend Components
import Navbar from './components/Navbar';
import HeroSection from './components/Hero/HeroSection';
import Scoreboard from './components/LiveScore/Scoreboard';
import LiveStream from './components/LiveStream';
import PostSection from './components/PostSection';
import WinnersSection from './components/WinnersSection';
import VIPPackages from './components/VIPPackages';
import WhatsAppBtn from './components/WhatsAppBtn';

// Admin Layout & Pages
import AdminLayout from './components/Admin/Layout/AdminLayout';
import Login from './components/Admin/Pages/Login';
import Dashboard from './components/Admin/Pages/Dashboard';
import ManagePosts from './components/Admin/Pages/ManagePosts';
import AdminVIPPackages from './components/Admin/Pages/VIPPackages';
import Orders from './components/Admin/Pages/Orders';
import Winners from './components/Admin/Pages/Winners';
import LiveComments from './components/Admin/Pages/LiveComments';
import ManageAdmins from './components/Admin/Pages/ManageAdmins';

// Main Frontend Layout
const MainSite = () => (
  <div className="min-h-screen bg-cricket-dark font-sans text-slate-200 relative">
    <Navbar />
    <HeroSection />
    
    <Scoreboard />
    
    <LiveStream />
    <PostSection />
    <WinnersSection />
    <VIPPackages />
    <WhatsAppBtn />
  </div>
);

function App() {
  // Start with FALSE so it forces a login attempt
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />

        {/* --- STRICT ADMIN ROUTING --- */}
        
        {/* If user tries to go to Login page but is already logged in, redirect to Dashboard */}
        <Route 
            path="/admin/login" 
            element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/admin/dashboard" replace />} 
        />

        {/* Main Admin Wrapper Route */}
        <Route 
            path="/admin" 
            element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />}
        >
            {/* If they just type /admin, redirect them to /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* Admin Sub-Pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posts" element={<ManagePosts />} />
            <Route path="comments" element={<LiveComments />} />
            <Route path="vip-packages" element={<AdminVIPPackages />} />
            <Route path="orders" element={<Orders />} />
            <Route path="winners" element={<Winners />} /> 
            <Route path="manage-admins" element={<ManageAdmins />} />
        </Route>
        
        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;