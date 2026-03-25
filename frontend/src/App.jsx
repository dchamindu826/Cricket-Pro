import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; // <-- මේක අලුතින් import කරන්න ඕනේ

// Frontend Components (ඔයාගේ පරණ imports ටික එහෙම්මම තියාගන්න)
import Navbar from './components/Navbar';
import HeroSection from './components/Hero/HeroSection';
import Scoreboard from './components/LiveScore/Scoreboard';
import LiveStream from './components/LiveStream';
import PostSection from './components/PostSection';
import WinnersSection from './components/WinnersSection';
import VIPPackages from './components/VIPPackages';
import WhatsAppBtn from './components/WhatsAppBtn';
import NativeBanner from './components/NativeBanner'; 
import TermsWidget from './components/TermsWidget'; 
import TermsPage from './components/TermsPage';     

// Admin Layout & Pages (ඔයාගේ පරණ imports ටික එහෙම්මම තියාගන්න)
import AdminLayout from './components/Admin/Layout/AdminLayout';
import Login from './components/Admin/Pages/Login';
import Dashboard from './components/Admin/Pages/Dashboard';
import ManagePosts from './components/Admin/Pages/ManagePosts';
import AdminVIPPackages from './components/Admin/Pages/VIPPackages';
import Orders from './components/Admin/Pages/Orders';
import Winners from './components/Admin/Pages/Winners';
import LiveComments from './components/Admin/Pages/LiveComments';
import ManageAdmins from './components/Admin/Pages/ManageAdmins';
import ManageTerms from './components/Admin/Pages/ManageTerms'; 

// Main Frontend Layout එක වෙනස් කරපු විදිහ 
const MainSite = () => {
  const [youtubeLink, setYoutubeLink] = useState("");

  useEffect(() => {
    // Backend එකෙන් Admin සේව් කරපු ලින්ක් එක ගන්නවා
    const fetchStreamLink = async () => {
      try {
        const res = await axios.get('https://cricket-pro-three.vercel.app/api/admin/live-stream');
        if (res.data && res.data.url) {
          setYoutubeLink(res.data.url);
        }
      } catch (error) {
        console.error("Error fetching stream link:", error);
      }
    };

    fetchStreamLink();
  }, []);

  return (
    <div className="min-h-screen bg-cricket-dark font-sans text-slate-200 relative overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <NativeBanner /> 
      <Scoreboard />
      
      {/* අලුතින් ගත්ත ලින්ක් එක LiveStream එකට දෙනවා */}
      <LiveStream streamUrl={youtubeLink} />
      
      <NativeBanner /> 
      <PostSection />
      <WinnersSection />
      
      <div className="relative z-[80]">
          <VIPPackages />
      </div>

      <WhatsAppBtn />
      <TermsWidget />
    </div>
  );
};

// App Component එක (කිසිම වෙනසක් නෑ, පරණ විදිහමයි)
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />

        <Route path="/terms" element={<div className="min-h-screen bg-cricket-dark"><Navbar /><TermsPage /><WhatsAppBtn /></div>} />

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
            <Route path="terms" element={<ManageTerms />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;