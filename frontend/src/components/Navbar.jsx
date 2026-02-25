import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { auth, provider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isVip, setIsVip] = useState(false);
  const [showVipAnimation, setShowVipAnimation] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // User කෙනෙක් ලොග් වෙලා ඉන්නවා නම්, කෙලින්ම Backend එකෙන් VIP status අහනවා
      if (currentUser && currentUser.email) {
          try {
              // මේ route එකෙන් admin approve කරපු active order එකක් තියෙනවද බලනවා
              const response = await axios.get(`https://cricket-pro-three.vercel.app/api/orders/check-vip/${currentUser.email}`);
              if (response.data.isVip) {
                  setIsVip(true);
              } else {
                  setIsVip(false);
              }
          } catch (error) {
              console.error("Error checking VIP status:", error);
              setIsVip(false);
          }
      } else {
          setIsVip(false);
      }
    });

    return () => unsubscribe();
  }, []); 

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
      await signOut(auth);
      setIsVip(false);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
    setIsOpen(false); 
  };

  const NavLinks = () => (
    <>
      <a href="#live-match" onClick={(e) => scrollToSection(e, 'live-match')} className="text-slate-300 hover:text-white font-bold transition">Live Match</a>
      <a href="#posts" onClick={(e) => scrollToSection(e, 'posts')} className="text-slate-300 hover:text-white font-bold transition">Posts</a>
      <a href="#winners" onClick={(e) => scrollToSection(e, 'winners')} className="text-slate-300 hover:text-white font-bold transition">Winners</a>
      <a href="#vip-packages" onClick={(e) => scrollToSection(e, 'vip-packages')} className="text-cricket-gold font-black uppercase tracking-wider relative group">
        VIP Pass
        <span className="absolute -inset-1 bg-cricket-gold blur-md opacity-40 group-hover:opacity-100 transition duration-300"></span>
      </a>
    </>
  );

  const getProfilePic = () => {
    if (user?.photoURL) return user.photoURL;
    const initial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';
    return `https://ui-avatars.com/api/?name=${initial}&background=0D8ABC&color=fff&bold=true`;
  };

  return (
    <nav className="bg-[#050f20]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      
      {showVipAnimation && (
         <div className="absolute inset-0 z-0 bg-cricket-gold/20 animate-pulse pointer-events-none overflow-hidden">
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full shadow-[0_0_200px_rgba(255,215,0,0.8)] blur-3xl rounded-full"></div>
         </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-[#00b3cc] tracking-widest uppercase cursor-pointer" onClick={(e) => scrollToSection(e, 'top')}>
              Cric<span className="text-white">Pro</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <button onClick={handleLogin} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl font-bold transition shadow-lg relative z-20">
                Login
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-md pl-2 pr-4 py-1.5 rounded-full border border-slate-700 relative z-20">
                <div className="relative flex items-center justify-center">
                  
                  {/* Profile Pic Ring / VIP Glow */}
                  <div className={`rounded-full p-[2px] transition-all duration-500 ${isVip ? 'bg-gradient-to-tr from-yellow-500 via-cricket-gold to-yellow-200 shadow-[0_0_20px_rgba(255,215,0,0.8)]' : 'bg-neon-blue'}`}>
                      <img 
                        src={getProfilePic()} 
                        alt="User" 
                        className={`w-9 h-9 rounded-full object-cover border-2 border-[#050f20] ${showVipAnimation ? 'animate-bounce' : ''}`} 
                        onError={(e) => {e.target.src = 'https://ui-avatars.com/api/?name=User&background=333&color=fff'}} 
                      />
                  </div>

                  {isVip && (
                    <span className={`absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-lg border border-yellow-200 z-10 ${showVipAnimation ? 'scale-150 transition-transform' : ''}`}>
                      VIP
                    </span>
                  )}
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 text-sm font-bold ml-1">Logout</button>
              </div>
            )}
            
            {!isVip && (
                <a href="#vip-packages" onClick={(e) => scrollToSection(e, 'vip-packages')} className="bg-gradient-to-r from-cricket-gold to-yellow-600 text-slate-900 px-5 py-2 rounded-xl font-black transition shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] relative z-20">
                  VIP Access
                </a>
            )}
          </div>

          <div className="md:hidden flex items-center relative z-20">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#071327] border-b border-slate-800 absolute w-full pb-6 shadow-2xl z-50">
          <div className="px-4 pt-4 pb-3 space-y-4 flex flex-col items-center text-lg">
            <NavLinks />
            <div className="w-full border-t border-slate-700 pt-4 flex flex-col gap-3">
              {!user ? (
                <button onClick={handleLogin} className="w-full bg-slate-800 text-white px-5 py-3 rounded-xl font-bold">Login</button>
              ) : (
                <button onClick={handleLogout} className="w-full bg-red-500/20 text-red-500 px-5 py-3 rounded-xl font-bold">Logout ({user.displayName || 'User'})</button>
              )}
              {!isVip && (
                  <a href="#vip-packages" onClick={(e) => scrollToSection(e, 'vip-packages')} className="w-full text-center bg-cricket-gold text-slate-900 px-5 py-3 rounded-xl font-black shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                    Get VIP Access
                  </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;