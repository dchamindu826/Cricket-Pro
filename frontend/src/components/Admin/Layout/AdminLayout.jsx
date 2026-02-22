import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020914] text-slate-200 flex font-sans selection:bg-neon-blue/30 selection:text-neon-blue">
      
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
        
        {/* Mobile Top Header */}
        <div className="md:hidden h-20 bg-[#050f20]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-[#00b3cc]">CRIC PRO ADMIN</h2>
            <button onClick={() => setSidebarOpen(true)} className="text-white bg-slate-800 p-2 rounded-xl">
                <FiMenu size={24} />
            </button>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto custom-scrollbar relative">
            {/* Background glow for premium feel */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-64 bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            
            <Outlet /> 
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;