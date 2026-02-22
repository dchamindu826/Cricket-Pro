import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiExternalLink } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders/pending');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (id, action) => {
    if(!window.confirm(`Are you sure you want to ${action} this request?`)) return;
    
    // Add a temporary loading state for the button if needed, but for now we just block UI slightly
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${action}/${id}`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if(data.success) {
        alert(`Order successfully ${action}d!`);
        // Remove the processed order from the list immediately
        setOrders(orders.filter(order => order.id !== id));
      } else {
        alert("Failed to process order.");
      }
    } catch (error) {
      alert(`Error trying to ${action} order. Make sure backend is running.`);
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-200">
      <div>
          <h1 className="text-3xl font-black text-white mb-1">VIP Orders & Approvals</h1>
          <p className="text-slate-400 text-sm">Review uploaded bank slips and manually activate VIP accounts.</p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          {loading ? (
             <div className="p-8 text-center text-slate-400 font-bold animate-pulse">Loading pending orders...</div>
          ) : orders.length === 0 ? (
             <div className="p-8 text-center text-slate-500">No pending VIP requests.</div>
          ) : (
             <>
                {/* DESKTOP VIEW: Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-5 font-bold">User Details</th>
                                <th className="px-6 py-5 font-bold">Package</th>
                                <th className="px-6 py-5 font-bold text-center">Payment Slip Frame</th>
                                <th className="px-6 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-white text-base">{order.user_name}</p>
                                        <p className="text-xs text-slate-500 mb-1">{order.user_email}</p>
                                        <p className="text-[10px] text-slate-600 font-mono bg-slate-800 inline-block px-2 py-0.5 rounded">ID: {order.id.slice(0,8)}...</p>
                                    </td>
                                    <td className="px-6 py-4 align-top pt-5">
                                        <span className="bg-cricket-gold/10 text-cricket-gold border border-cricket-gold/30 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm">
                                            {order.package_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {/* Slip Frame Implementation */}
                                        <div className="relative group inline-block">
                                            <div className="w-24 h-16 rounded-lg overflow-hidden border-2 border-slate-600 group-hover:border-neon-blue transition-colors relative shadow-inner">
                                                <img 
                                                    src={order.slip_url} 
                                                    alt="Payment Slip" 
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    onClick={() => window.open(order.slip_url, '_blank')}
                                                />
                                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center pointer-events-none">
                                                    <FiExternalLink className="text-white drop-shadow-md" size={18}/>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-slate-500 mt-1">Click to view full</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top pt-5">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleAction(order.id, 'approve')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-xs shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5">
                                                <FiCheck size={16} /> Approve
                                            </button>
                                            <button onClick={() => handleAction(order.id, 'decline')} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-xs shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5">
                                                <FiX size={16} /> Decline
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE VIEW: Cards */}
                <div className="md:hidden divide-y divide-slate-700">
                    {orders.map((order) => (
                        <div key={order.id} className="p-5 space-y-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold text-white text-base">{order.user_name}</p>
                                    <p className="text-xs text-slate-400 mb-2">{order.user_email}</p>
                                    <span className="bg-cricket-gold/10 text-cricket-gold border border-cricket-gold/30 px-2 py-1 rounded-md font-bold text-[10px]">{order.package_name}</span>
                                </div>
                                {/* Mobile Frame View */}
                                <div className="w-20 h-14 rounded-md overflow-hidden border border-slate-600 shadow-sm cursor-pointer" onClick={() => window.open(order.slip_url, '_blank')}>
                                     <img src={order.slip_url} alt="Slip" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex gap-3 w-full pt-3 border-t border-slate-700/50">
                                <button onClick={() => handleAction(order.id, 'approve')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-bold transition-colors flex justify-center items-center gap-2 text-sm shadow-md">
                                    <FiCheck size={18} /> Approve
                                </button>
                                <button onClick={() => handleAction(order.id, 'decline')} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-bold transition-colors flex justify-center items-center gap-2 text-sm shadow-md">
                                    <FiX size={18} /> Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             </>
          )}
      </div>
    </div>
  );
};

export default Orders;