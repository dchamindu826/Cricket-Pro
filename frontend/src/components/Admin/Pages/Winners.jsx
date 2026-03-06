import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiEdit2, FiCheck } from 'react-icons/fi';

const AdminWinners = () => {
  const [pendingWinners, setPendingWinners] = useState([]);
  const [publishedWinners, setPublishedWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [customName, setCustomName] = useState('');
  const [customPrize, setCustomPrize] = useState('');
  const [customPrizeValue, setCustomPrizeValue] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    try {
      const [pendingRes, publishedRes] = await Promise.all([
        axios.get('https://cricket-pro-three.vercel.app/api/winners/pending'),
        axios.get('https://cricket-pro-three.vercel.app/api/winners/published')
      ]);
      setPendingWinners(pendingRes.data);
      setPublishedWinners(publishedRes.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePublish = async (winner) => {
    try {
      await axios.put(`https://cricket-pro-three.vercel.app/api/winners/publish/${winner.id}`, {
        name: winner.name, prize: winner.prize || 'VIP', prize_value: winner.prize_value || 0
      });
      alert("Published successfully!");
      fetchData();
    } catch (error) { alert("Failed to publish"); }
  };

  const handleAddCustom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://cricket-pro-three.vercel.app/api/winners/custom', {
        name: customName, prize: customPrize, prize_value: Number(customPrizeValue || 0)
      });
      alert("Added successfully!");
      setCustomName(''); setCustomPrize(''); setCustomPrizeValue('');
      fetchData();
    } catch (error) { alert("Failed to add"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://cricket-pro-three.vercel.app/api/winners/${id}`);
      fetchData();
    } catch (error) { alert("Failed to delete"); }
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`https://cricket-pro-three.vercel.app/api/winners/edit/${id}`, editData);
      setEditingId(null);
      fetchData();
    } catch (error) { alert("Failed to update"); }
  };

  const renderWinnerRow = (winner, isPublished) => {
    const isEditing = editingId === winner.id;
    return (
      <div key={winner.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
        {isEditing ? (
          <>
            <input type="text" value={editData.name} onChange={e=>setEditData({...editData, name: e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white flex-1" />
            <input type="text" value={editData.prize} onChange={e=>setEditData({...editData, prize: e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white flex-1" />
            <input type="number" value={editData.prize_value} onChange={e=>setEditData({...editData, prize_value: e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white w-24" />
            <button onClick={() => handleSaveEdit(winner.id)} className="bg-green-500 p-2 rounded text-black"><FiCheck size={20}/></button>
          </>
        ) : (
          <>
            <div className="flex-1 text-white font-bold">{winner.name}</div>
            <div className="flex-1 text-slate-300">{winner.prize || 'No Prize'}</div>
            <div className="w-24 text-cricket-gold font-bold">${winner.prize_value || 0}</div>
            
            <div className="flex gap-2">
              {!isPublished && <button onClick={() => handlePublish(winner)} className="bg-emerald-600 px-4 py-1.5 rounded text-sm text-white font-bold">Publish</button>}
              <button onClick={() => { setEditingId(winner.id); setEditData(winner); }} className="bg-blue-500/20 text-blue-400 p-2 rounded"><FiEdit2/></button>
              <button onClick={() => handleDelete(winner.id)} className="bg-red-500/20 text-red-500 p-2 rounded"><FiTrash2/></button>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center text-white mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-neon-blue">Add Custom Winner</h2>
        <form onSubmit={handleAddCustom} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div><label className="block text-xs text-slate-400 mb-1">Name</label><input type="text" value={customName} onChange={(e)=>setCustomName(e.target.value)} className="w-full bg-slate-900 border rounded p-2 text-white" required /></div>
          <div><label className="block text-xs text-slate-400 mb-1">Prize Text</label><input type="text" value={customPrize} onChange={(e)=>setCustomPrize(e.target.value)} className="w-full bg-slate-900 border rounded p-2 text-white" required /></div>
          <div><label className="block text-xs text-slate-400 mb-1">Value ($)</label><input type="number" value={customPrizeValue} onChange={(e)=>setCustomPrizeValue(e.target.value)} className="w-full bg-slate-900 border rounded p-2 text-white" required /></div>
          <button type="submit" className="bg-cricket-gold text-black font-bold py-2 px-4 rounded">Add & Publish</button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3 text-orange-400">Pending Approval ({pendingWinners.length})</h2>
        <div className="grid gap-3">{pendingWinners.map(w => renderWinnerRow(w, false))}</div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3 text-green-400">Published Winners ({publishedWinners.length})</h2>
        <div className="grid gap-3">{publishedWinners.map(w => renderWinnerRow(w, true))}</div>
      </div>
    </div>
  );
};
export default AdminWinners;