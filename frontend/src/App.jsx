import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Frontend Components
import Navbar from './components/Navbar';
import HeroSection from './components/Hero/HeroSection';
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

// Main Frontend Layout
const MainSite = () => (
  <div className="min-h-screen bg-cricket-dark font-sans text-slate-200 relative">
    <Navbar />
    <HeroSection />
    <LiveStream />
    <PostSection />
    <WinnersSection />
    <VIPPackages />
    <WhatsAppBtn />
  </div>
);

function App() {
  // Danata test karanna 'true' dila thiyenne. Backend awama meka false wenawa.
  const [isAuthenticated, setIsAuthenticated] = useState(true); 

  return (
    <Router>
      <Routes>
        {/* Public Main Website */}
        <Route path="/" element={<MainSite />} />

        {/* Admin Login Route (domain/admin or domain/admin/login) */}
        <Route 
            path="/admin" 
            element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
            path="/admin/login" 
            element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />

        {/* Protected Admin Routes Wrapped with AdminLayout (Sidebar + Content) */}
        <Route path="/admin" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posts" element={<ManagePosts />} />
            <Route path="vip-packages" element={<AdminVIPPackages />} />
            <Route path="orders" element={<Orders />} />
            <Route path="winners" element={<Winners />} /> 
        </Route>
        
        {/* Fallback route - any wrong URL goes home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;