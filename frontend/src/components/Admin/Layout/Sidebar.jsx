import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiEdit3, FiMessageSquare, FiStar, FiShoppingCart, FiAward, FiLogOut, FiShield, FiSettings } from 'react-icons/fi';
import { BiCricketBall } from 'react-icons/bi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Live Comments', path: '/admin/comments', icon: <FiMessageSquare /> },
    { name: 'Manage Posts', path: '/admin/posts', icon: <FiEdit3 /> },
    { name: 'VIP Packages', path: '/admin/vip-packages', icon: <FiStar /> },
    { name: 'VIP Orders', path: '/admin/orders', icon: <FiShoppingCart /> },
    { name: 'Winners Workflow', path: '/admin/winners', icon: <FiAward /> },
    { name: 'Manage Admins', path: '/admin/manage-admins', icon: <FiShield /> },
    { name: 'Manage Terms', path: '/admin/terms', icon: <FiSettings /> } // <-- මෙන්න මේක හැදුවා
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Content */}
      <div className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#050f20]/95 backdrop-blur-xl border-r border-slate-800/80 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Brand */}
        <div className="h-24 flex items-center justify-center border-b border-slate-800/50">
          <div className="flex items-center gap-3 bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800 shadow-inner">
            <BiCricketBall className="text-cricket-gold animate-spin-slow text-3xl drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-[#00b3cc] tracking-widest">
              CRIC<span className="text-white">PRO</span>
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-8 px-5 space-y-3 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)} 
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold ${
                  isActive 
                    ? 'bg-gradient-to-r from-neon-blue/10 to-transparent text-neon-blue border border-neon-blue/20 shadow-[0_0_20px_rgba(100,255,218,0.05)]' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 hover:translate-x-1'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* User / Logout */}
        <div className="p-5 border-t border-slate-800/50">
          <div className="bg-slate-900/50 rounded-2xl p-4 flex items-center justify-between border border-slate-800">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cricket-gold to-yellow-600 flex items-center justify-center text-cricket-dark font-black shadow-lg">A</div>
                 <div>
                     <p className="text-white font-bold text-sm">Super Admin</p>
                     <p className="text-slate-500 text-xs">Online</p>
                 </div>
             </div>
             <button className="text-red-400 hover:text-red-500 p-2 bg-red-500/10 rounded-xl transition">
                <FiLogOut size={18} />
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;