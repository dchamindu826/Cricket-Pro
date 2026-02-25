import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); 

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://cricket-pro-three.vercel.app/api/orders'); 
      const data = await res.json();
      setOrders(data || []);
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
    
    try {
      const res = await fetch(`https://cricket-pro-three.vercel.app/api/orders/${action}/${id}`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if(data.success) {
        alert(`Order successfully ${action}d!`);
        fetchOrders(); 
      } else {
        alert("Failed to process order.");
      }
    } catch (error) {
      alert(`Error trying to ${action} order.`);
      console.error(error);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-200">
      <div className="flex justify-between items-end mb-6">
          <div>
              <h1 className="text-3xl font-black text-white mb-1">VIP Orders Management</h1>
              <p className="text-slate-400 text-sm">Review payment slips and manage VIP requests.</p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 hidden sm:block">
              <span className="text-slate-400 text-sm font-bold">Total: <span className="text-neon-blue">{orders.length}</span></span>
          </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          {loading ? (
             <div className="p-8 text-center text-slate-400 font-bold animate-pulse">Loading all orders...</div>
          ) : orders.length === 0 ? (
             <div className="p-10 text-center text-slate-500 bg-slate-900/30 border border-dashed border-slate-700 m-4 rounded-xl">No orders found.</div>
          ) : (
             <>
                {/* DESKTOP VIEW */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-5 font-bold">User Details</th>
                                <th className="px-6 py-5 font-bold">Package</th>
                                <th className="px-6 py-5 font-bold text-center">Status</th>
                                <th className="px-6 py-5 font-bold text-center">Payment Slip</th>
                                <th className="px-6 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {currentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-white text-base">{order.user_name}</p>
                                        <p className="text-xs text-slate-500 mb-1">{order.user_email}</p>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <span className="bg-cricket-gold/10 text-cricket-gold border border-cricket-gold/30 px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap">
                                            {order.package_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        {order.status === 'pending' && <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-2 py-1 rounded text-xs font-bold uppercase">Pending</span>}
                                        {order.status === 'approved' && <span className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded text-xs font-bold uppercase">Approved</span>}
                                        {order.status === 'declined' && <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-1 rounded text-xs font-bold uppercase">Declined</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        <button onClick={() => setSelectedSlip(order.slip_url)} className="bg-slate-700 hover:bg-slate-600 text-neon-blue border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto whitespace-nowrap">
                                            <FiEye size={14} /> View Slip
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right align-middle">
                                        {order.status === 'pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleAction(order.id, 'approve')} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg transition-all shadow-lg" title="Approve">
                                                    <FiCheck size={16} />
                                                </button>
                                                <button onClick={() => handleAction(order.id, 'decline')} className="bg-red-600 hover:bg-red-500 text-white p-2.5 rounded-lg transition-all shadow-lg" title="Decline">
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-500 text-xs italic bg-slate-900 px-3 py-1.5 rounded-md border border-slate-700">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE VIEW */}
                <div className="md:hidden divide-y divide-slate-700">
                    {currentOrders.map((order) => (
                        <div key={order.id} className="p-5 space-y-4 hover:bg-slate-700/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold text-white text-base">{order.user_name}</p>
                                    <p className="text-xs text-slate-400 mb-2">{order.user_email}</p>
                                    <span className="bg-cricket-gold/10 text-cricket-gold px-2 py-1.5 rounded-md font-bold text-[10px] border border-cricket-gold/20">{order.package_name}</span>
                                </div>
                                <div className="text-right">
                                    {order.status === 'pending' && <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-[10px] font-bold uppercase">Pending</span>}
                                    {order.status === 'approved' && <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded text-[10px] font-bold uppercase">Approved</span>}
                                    {order.status === 'declined' && <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded text-[10px] font-bold uppercase">Declined</span>}
                                </div>
                            </div>
                            <div className="flex gap-2 w-full pt-3 border-t border-slate-700/50">
                                <button onClick={() => setSelectedSlip(order.slip_url)} className="flex-1 bg-slate-700 border border-slate-600 hover:bg-slate-600 text-neon-blue py-2.5 rounded-lg text-xs font-bold flex justify-center items-center gap-2 transition-colors">
                                    <FiEye size={14} /> View Slip
                                </button>
                                {order.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleAction(order.id, 'approve')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-bold flex justify-center items-center transition-colors">
                                            <FiCheck size={16} />
                                        </button>
                                        <button onClick={() => handleAction(order.id, 'decline')} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-bold flex justify-center items-center transition-colors">
                                            <FiX size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700 bg-slate-900/80">
                        <p className="text-sm text-slate-400 hidden sm:block">
                            Showing <span className="font-bold text-white">{indexOfFirstOrder + 1}</span> to <span className="font-bold text-white">{Math.min(indexOfLastOrder, orders.length)}</span> of <span className="font-bold text-white">{orders.length}</span>
                        </p>
                        <div className="flex gap-2 w-full sm:w-auto justify-center">
                            <button 
                                onClick={() => paginate(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white disabled:opacity-50 hover:bg-slate-700 transition"
                            >
                                <FiChevronLeft />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button 
                                    key={i + 1} 
                                    onClick={() => paginate(i + 1)}
                                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-neon-blue text-black' : 'bg-slate-800 border border-slate-600 text-white hover:bg-slate-700'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => paginate(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white disabled:opacity-50 hover:bg-slate-700 transition"
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                )}
             </>
          )}
      </div>

      {/* ================= IMAGE MODAL FOR SLIP ================= */}
      {selectedSlip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm">
            <div className="bg-[#0b1b36] border border-slate-600 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col animate-fade-in max-h-[90vh]">
                
                <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/80">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FiEye className="text-neon-blue"/> Payment Slip Receipt
                    </h3>
                    <button 
                        onClick={() => setSelectedSlip(null)} 
                        className="text-slate-400 hover:text-white bg-slate-800 hover:bg-red-500 p-2 rounded-lg transition-all"
                    >
                        <FiX size={20} />
                    </button>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto bg-black flex justify-center items-center custom-scrollbar">
                    {/* Image eka lassanata fit wenawa (iframe wenuwata img damma) */}
                    <img 
                        src={selectedSlip} 
                        alt="Payment Slip" 
                        className="max-w-full h-auto object-contain rounded-lg shadow-lg border border-slate-700" 
                    />
                </div>
                
                <div className="p-4 border-t border-slate-700 bg-slate-900/80 flex justify-end">
                     <button onClick={() => setSelectedSlip(null)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold transition">
                         Close Preview
                     </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Orders;