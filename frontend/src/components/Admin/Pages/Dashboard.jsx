import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiDollarSign, FiMessageSquare, FiGift, FiClock, FiVideo, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    liveUsers: 0,
    totalTraffic: 0,
    pendingOrders: 0,
    vipMembers: 0,
    activePostComments: 0,
    vipRevenue: 0,
    totalPrizesGiven: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [ytLink, setYtLink] = useState('');
  const [isUpdatingLink, setIsUpdatingLink] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get('https://cricket-pro-three.vercel.app/api/admin/dashboard-stats');
        setStats(statsRes.data);

        const chartRes = await axios.get('https://cricket-pro-three.vercel.app/api/admin/revenue-chart');
        setRevenueData(chartRes.data);

        const linkRes = await axios.get('https://cricket-pro-three.vercel.app/api/admin/live-stream');
        setYtLink(linkRes.data.url);
        
        setLoading(false);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
    // Refresh live users every 1 minute
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStream = async () => {
    setIsUpdatingLink(true);
    try {
      await axios.post('https://cricket-pro-three.vercel.app/api/admin/live-stream', { url: ytLink });
      alert('Live stream link updated successfully!');
    } catch (error) {
      alert('Failed to update link');
    }
    setIsUpdatingLink(false);
  };

  const StatCard = ({ title, value, icon: Icon, color, isPulse }) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-lg">
      <div className={`p-4 rounded-xl ${color} ${isPulse ? 'animate-pulse' : ''}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-semibold">{title}</p>
        <h3 className="text-2xl font-black text-white">{value}</h3>
      </div>
    </div>
  );

  if (loading) return <div className="text-center text-white mt-20 animate-pulse">Loading Dashboard...</div>;

  const netRevenue = stats.vipRevenue - stats.totalPrizesGiven;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-black text-white mb-6">Overview Dashboard</h1>

      {/* Stats Grid - Updated with Live Users & Total Traffic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Live Active Users" value={stats.liveUsers} icon={FiActivity} color="bg-green-500/20 text-green-500 border border-green-500/50" isPulse={true} />
        <StatCard title="Total Site Visits" value={stats.totalTraffic} icon={FiUsers} color="bg-blue-500/20 text-blue-500 border border-blue-500/50" />
        <StatCard title="Active VIP Members" value={stats.vipMembers} icon={FiUsers} color="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50" />
        <StatCard title="Post Predictions" value={stats.activePostComments} icon={FiMessageSquare} color="bg-slate-500/20 text-slate-300 border border-slate-500/50" />
        
        <StatCard title="VIP Revenue" value={`Rs. ${stats.vipRevenue}`} icon={FiDollarSign} color="bg-emerald-500/20 text-emerald-500 border border-emerald-500/50" />
        <StatCard title="Total Prizes Given" value={`Rs. ${stats.totalPrizesGiven}`} icon={FiGift} color="bg-red-500/20 text-red-500 border border-red-500/50" />
        <StatCard title="Net Revenue" value={`Rs. ${netRevenue}`} icon={FiTrendingUp} color="bg-neon-blue/20 text-neon-blue border border-neon-blue/50" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={FiClock} color="bg-orange-500/20 text-orange-500 border border-orange-500/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Revenue Analytics</h2>
          <div className="w-full flex-1" style={{ minHeight: '300px' }}>
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64ffda" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#64ffda" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#64ffda" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <FiVideo className="text-red-500 text-2xl" />
            <h2 className="text-xl font-bold text-white">Update Live Stream</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">Paste the YouTube embed URL here to update the live stream.</p>
          <input 
            type="text" 
            value={ytLink}
            onChange={(e) => setYtLink(e.target.value)}
            placeholder="https://www.youtube.com/embed/..." 
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue mb-4"
          />
          <button 
            onClick={handleUpdateStream}
            disabled={isUpdatingLink}
            className="w-full bg-neon-blue hover:bg-teal-400 text-slate-900 font-bold px-8 py-3 rounded-lg transition"
          >
            {isUpdatingLink ? 'Updating...' : 'Save Live Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;