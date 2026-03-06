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
import NativeBanner from './components/NativeBanner'; // <-- අලුතින් Banner එක Import කලා

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
    
    <NativeBanner /> {/* <-- Hero එකට යටින් Banner එකක් */}
    
    <Scoreboard />
    <LiveStream />
    
    <NativeBanner /> {/* <-- Live Stream එකට යටින් Banner එකක් */}

    <PostSection />
    <WinnersSection />
    <VIPPackages />

    <NativeBanner /> {/* <-- VIP පැකේජ් වලට යටින් Banner එකක් */}

    <WhatsAppBtn />
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />

        <Route 
            path="/admin/login" 
            element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/admin/dashboard" replace />} 
        />

        <Route 
            path="/admin" 
            element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />}
        >
            <Route index element={<Navigate to="dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posts" element={<ManagePosts />} />
            <Route path="comments" element={<LiveComments />} />
            <Route path="vip-packages" element={<AdminVIPPackages />} />
            <Route path="orders" element={<Orders />} />
            <Route path="winners" element={<Winners />} /> 
            <Route path="manage-admins" element={<ManageAdmins />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;