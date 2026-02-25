import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminWinners = () => {
  const [pendingWinners, setPendingWinners] = useState([]);
  const [publishData, setPublishData] = useState({});
  const [loading, setLoading] = useState(true);

  // Custom Winner States
  const [customName, setCustomName] = useState('');
  const [customPrize, setCustomPrize] = useState('');
  const [customPrizeValue, setCustomPrizeValue] = useState('');

  useEffect(() => {
    fetchPendingWinners();
  }, []);

  const fetchPendingWinners = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/winners/pending');
      setPendingWinners(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending winners:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setPublishData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  // 1. Publish Pending Winner
  const handlePublish = async (winner) => {
    const data = publishData[winner.id] || {};
    const finalName = data.name !== undefined ? data.name : winner.name;
    const finalPrize = data.prize || '';
    const finalPrizeValue = data.prize_value || 0;

    if (!finalPrize.trim()) {
      alert("Please enter a prize before publishing!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/winners/publish/${winner.id}`, {
        name: finalName,
        prize: finalPrize,
        prize_value: Number(finalPrizeValue)
      });
      
      alert("Winner successfully published!");
      setPendingWinners(pendingWinners.filter(w => w.id !== winner.id));
    } catch (error) {
      alert("Failed to publish winner. Check backend logs.");
    }
  };

  // 2. Add Custom Winner Directly
  const handleAddCustomWinner = async (e) => {
    e.preventDefault();
    if (!customName || !customPrize) return alert("Please fill in both name and prize!");

    try {
      await axios.post('http://localhost:5000/api/winners/custom', {
        name: customName,
        prize: customPrize,
        prize_value: Number(customPrizeValue || 0)
      });
      
      alert("Custom Winner added and published successfully!");
      setCustomName('');
      setCustomPrize('');
      setCustomPrizeValue('');
    } catch (error) {
      alert("Failed to add custom winner.");
    }
  };

  if (loading) return <div className="text-center text-white mt-10">Loading pending winners...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      
      {/* 1. Add Custom Winner Section */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-neon-blue">Add Custom Winner</h2>
        <form onSubmit={handleAddCustomWinner} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Winner Name</label>
            <input type="text" value={customName} onChange={(e)=>setCustomName(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" required />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Prize Item (e.g. VIP Pass)</label>
            <input type="text" value={customPrize} onChange={(e)=>setCustomPrize(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" required />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Prize Value (Rs.)</label>
            <input type="number" value={customPrizeValue} onChange={(e)=>setCustomPrizeValue(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" required />
          </div>
          <button type="submit" className="bg-cricket-gold hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition">
            Add & Publish
          </button>
        </form>
      </div>

      {/* 2. Pending Winners List */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Pending Winners Approval</h2>
        {pendingWinners.length === 0 ? (
          <div className="bg-slate-800 border border-dashed border-slate-600 text-slate-400 p-6 rounded-lg text-center">
            No pending winners currently.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingWinners.map((winner) => (
              <div key={winner.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col md:flex-row items-center gap-4">
                
                <div className="flex-1 w-full">
                  <label className="block text-xs text-slate-400 mb-1">Name</label>
                  <input type="text" defaultValue={winner.name} onChange={(e) => handleInputChange(winner.id, 'name', e.target.value)} className="w-full bg-slate-900 border border-slate-600 text-white rounded px-3 py-2" />
                </div>
                
                <div className="flex-1 w-full">
                  <label className="block text-xs text-slate-400 mb-1">Prize Reward</label>
                  <input type="text" placeholder="e.g. VIP Pass" onChange={(e) => handleInputChange(winner.id, 'prize', e.target.value)} className="w-full bg-slate-900 border border-slate-600 text-white rounded px-3 py-2" />
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-xs text-slate-400 mb-1">Value (Rs.)</label>
                  <input type="number" placeholder="5000" onChange={(e) => handleInputChange(winner.id, 'prize_value', e.target.value)} className="w-full bg-slate-900 border border-slate-600 text-white rounded px-3 py-2" />
                </div>
                
                <div className="mt-5 md:mt-0 pt-4">
                  <button onClick={() => handlePublish(winner)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded transition-colors w-full">
                    Publish
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWinners;