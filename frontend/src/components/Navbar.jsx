import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import { auth, provider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // VIP da kiyala check kireema
  const isVip = localStorage.getItem('is_vip') === 'true';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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

  // Smooth Scroll Function Eka
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Mobile menu eka close wenawa click kalama
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

  return (
    <nav className="bg-[#050f20]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-[#00b3cc] tracking-widest uppercase cursor-pointer">
              Cric<span className="text-white">Pro</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <button onClick={handleLogin} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl font-bold transition shadow-lg">
                Login
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-slate-800/50 pl-2 pr-4 py-1.5 rounded-full border border-slate-700">
                <div className="relative">
                  <img src={user.photoURL} alt="User" className={`w-9 h-9 rounded-full object-cover ${isVip ? 'border-2 border-cricket-gold shadow-[0_0_10px_rgba(255,215,0,0.6)]' : 'border border-neon-blue'}`} />
                  {isVip && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-cricket-gold text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-md border border-yellow-200 z-10">
                      VIP
                    </span>
                  )}
                </div>
                <button onClick={() => signOut(auth)} className="text-slate-400 hover:text-red-500 text-sm font-bold">Logout</button>
              </div>
            )}
            <a href="#vip-packages" onClick={(e) => scrollToSection(e, 'vip-packages')} className="bg-gradient-to-r from-cricket-gold to-yellow-600 text-slate-900 px-5 py-2 rounded-xl font-black transition shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]">
              VIP Access
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#071327] border-b border-slate-800 absolute w-full pb-6 shadow-2xl">
          <div className="px-4 pt-4 pb-3 space-y-4 flex flex-col items-center text-lg">
            <NavLinks />
            <div className="w-full border-t border-slate-700 pt-4 flex flex-col gap-3">
              {!user ? (
                <button onClick={handleLogin} className="w-full bg-slate-800 text-white px-5 py-3 rounded-xl font-bold">Login</button>
              ) : (
                <button onClick={() => signOut(auth)} className="w-full bg-red-500/20 text-red-500 px-5 py-3 rounded-xl font-bold">Logout ({user.displayName})</button>
              )}
              <a href="#vip-packages" onClick={(e) => scrollToSection(e, 'vip-packages')} className="w-full text-center bg-cricket-gold text-slate-900 px-5 py-3 rounded-xl font-black shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                Get VIP Access
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;