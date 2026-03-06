import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiDollarSign, FiMessageSquare, FiGift, FiClock, FiVideo, FiTrendingUp, FiActivity, FiMonitor } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    liveUsers: 0, totalTraffic: 0, pendingOrders: 0, vipMembers: 0,
    activePostComments: 0, vipRevenue: 0, totalPrizesGiven: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [ytLink, setYtLink] = useState('');
  const [isUpdatingLink, setIsUpdatingLink] = useState(false);
  const [loading, setLoading] = useState(true);

  const [liveMatches, setLiveMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [currentActiveMatchId, setCurrentActiveMatchId] = useState('');
  const [updatingMatch, setUpdatingMatch] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Backend Stats
        try {
            const statsRes = await axios.get('https://cricket-pro-three.vercel.app/api/admin/dashboard-stats');
            setStats(statsRes.data);
        } catch (e) { console.log("Stats Error"); }

        try {
            const chartRes = await axios.get('https://cricket-pro-three.vercel.app/api/admin/revenue-chart');
            setRevenueData(chartRes.data);
        } catch (e) { console.log("Chart Error"); }

        try {
            const linkRes = await axios.get('https://cricket-pro-three.vercel.app/api/admin/live-stream');
            setYtLink(linkRes.data.url);
        } catch (e) { console.log("YT Error"); }

        try {
            const activeMatchRes = await axios.get('https://cricket-pro-three.vercel.app/api/admin/active-match');
            if(activeMatchRes.data) {
                setCurrentActiveMatchId(activeMatchRes.data.match_id);
                setSelectedMatchId(activeMatchRes.data.match_id);
            }
        } catch (e) { console.log("Active Match Check Error"); }

        // === RAPID API: Live Matches ගන්නවා ===
        try {
            const options = {
              method: 'GET',
              url: 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live',
              headers: {
                'X-RapidAPI-Key': 'cd72733c17mshb6183f2ce7d960ap15870fjsn5d09d19ac6a5',
                'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
              }
            };
            const matchRes = await axios.request(options);
            let extractedMatches = [];

            if (matchRes.data && matchRes.data.typeMatches) {
                matchRes.data.typeMatches.forEach(type => {
                    if (type.seriesMatches) {
                        type.seriesMatches.forEach(series => {
                            if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
                                series.seriesAdWrapper.matches.forEach(m => {
                                    extractedMatches.push({
                                        id: m.matchInfo.matchId,
                                        name: `${m.matchInfo.team1.teamSName} vs ${m.matchInfo.team2.teamSName} (${m.matchInfo.matchDesc})`,
                                    });
                                });
                            }
                        });
                    }
                });
            }
            setLiveMatches(extractedMatches);
        } catch (e) { console.log("RapidAPI Fetch Error", e); }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleUpdateStream = async () => {
    setIsUpdatingLink(true);
    try {
      await axios.post('https://cricket-pro-three.vercel.app/api/admin/live-stream', { url: ytLink });
      alert('Live stream link updated successfully!');
    } catch (error) { alert('Failed to update link'); }
    setIsUpdatingLink(false);
  };

  const handleSetActiveMatch = async () => {
    setUpdatingMatch(true);
    try {
      await axios.post('https://cricket-pro-three.vercel.app/api/admin/active-match', { match_id: selectedMatchId });
      setCurrentActiveMatchId(selectedMatchId);
      alert('Active match updated for Scoreboard!');
    } catch (error) { alert('Failed to update active match'); }
    setUpdatingMatch(false);
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-lg">
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-semibold">{title}</p>
        <h3 className="text-2xl font-black text-white">{value}</h3>
      </div>
    </div>
  );

  if (loading) return <div className="text-center text-white mt-20 animate-pulse">Loading Dashboard...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-black text-white mb-6">Overview Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Live Active Users" value={stats.liveUsers} icon={FiActivity} color="bg-green-500/20 text-green-500 border border-green-500/50" />
        <StatCard title="Active VIP Members" value={stats.vipMembers} icon={FiUsers} color="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50" />
        <StatCard title="Post Predictions" value={stats.activePostComments} icon={FiMessageSquare} color="bg-slate-500/20 text-slate-300 border border-slate-500/50" />
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

        <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FiMonitor className="text-cricket-gold text-2xl" />
                  <h2 className="text-xl font-bold text-white">Scoreboard Control</h2>
                </div>
                <p className="text-sm text-slate-400 mb-4">Select the match you want to show on the Live Scoreboard.</p>
                
                <select 
                    value={selectedMatchId} 
                    onChange={(e) => setSelectedMatchId(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cricket-gold mb-4"
                >
                    <option value="">-- No Match Selected --</option>
                    {liveMatches.map(match => (
                        <option key={match.id} value={match.id}>
                            {match.name}
                        </option>
                    ))}
                </select>

                <button 
                  onClick={handleSetActiveMatch}
                  disabled={updatingMatch || !selectedMatchId}
                  className="w-full font-bold px-8 py-3 rounded-lg transition bg-cricket-gold hover:bg-yellow-500 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingMatch ? 'Updating...' : 'Set Active Match'}
                </button>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <FiVideo className="text-red-500 text-2xl" />
                <h2 className="text-xl font-bold text-white">Live Stream</h2>
              </div>
              <input 
                type="text" 
                value={ytLink}
                onChange={(e) => setYtLink(e.target.value)}
                placeholder="YouTube embed URL" 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue mb-4"
              />
              <button onClick={handleUpdateStream} disabled={isUpdatingLink} className="w-full bg-neon-blue hover:bg-teal-400 text-slate-900 font-bold px-8 py-3 rounded-lg transition">
                {isUpdatingLink ? 'Updating...' : 'Save Link'}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;