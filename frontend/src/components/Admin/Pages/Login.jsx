import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiCricketBall } from 'react-icons/bi';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Danata dummy check ekak. Backend eka haduwama meka API call ekak wenawa.
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      navigate('/admin/dashboard');
    } else {
      alert('Invalid Username or Password!');
    }
  };

  return (
    <div className="min-h-screen bg-cricket-dark flex items-center justify-center p-4">
      <div className="bg-[#0b1b36] p-8 rounded-2xl border border-neon-blue/30 w-full max-w-md shadow-[0_0_30px_rgba(100,255,218,0.1)]">
        
        <div className="flex flex-col items-center mb-8">
            <BiCricketBall className="text-cricket-gold animate-spin-slow mb-2" size={48} />
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Admin Login</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-400 text-sm mb-2">Username</label>
            <input 
              type="text" 
              className="w-full bg-[#020c1b] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#020c1b] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-neon-blue to-[#00b3cc] text-cricket-dark font-extrabold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(100,255,218,0.4)] transition-all"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;