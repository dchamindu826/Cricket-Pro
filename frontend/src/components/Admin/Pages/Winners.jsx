import React from 'react';
import { FiSend, FiGlobe, FiCheck } from 'react-icons/fi';

const Winners = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-200">
      
      <div>
          <h1 className="text-2xl font-bold text-white mb-1">Winners Workflow</h1>
          <p className="text-slate-400 text-sm">Manage winner announcements and publish verified users to the public board.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Step 1: Announcement Post */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col">
             <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-3">
                 1. Create Announcement Post
             </h3>
             <div className="flex-1 space-y-4">
                 <p className="text-sm text-slate-400">Create a post asking selected winners to contact via WhatsApp with a screenshot of their comment.</p>
                 <textarea 
                    defaultValue="Congratulations to the winners of IND vs AUS match! 🏆 Please send a screenshot of your winning comment to our WhatsApp to claim your prize."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 focus:outline-none focus:border-blue-500 h-32 resize-none"
                 ></textarea>
                 <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                     <FiSend /> Post Announcement
                 </button>
             </div>
          </div>

          {/* Step 2 & 3: Payment Verification & Publish */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col">
             <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
                 <h3 className="text-lg font-bold text-white">2. Verify & Publish</h3>
                 <span className="bg-blue-900/50 text-blue-400 text-xs px-2 py-1 rounded-md font-bold border border-blue-800/50">Verified Only</span>
             </div>
             
             <div className="flex-1 space-y-3">
                 <p className="text-sm text-slate-400 mb-2">Mark paid users and publish them to the main website.</p>
                 
                 {/* User Item */}
                 <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
                     <div>
                         <p className="font-bold text-white text-sm">Kasun Perera</p>
                         <p className="text-xs text-slate-500">IND vs AUS Match</p>
                     </div>
                     <div className="flex items-center gap-2">
                         <input type="text" placeholder="Rs. 5000" className="w-24 bg-slate-800 border border-slate-700 rounded-md p-2 text-sm text-white focus:outline-none focus:border-blue-500 text-center" />
                         <button className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-md transition-colors" title="Mark Paid">
                             <FiCheck size={18} />
                         </button>
                     </div>
                 </div>
                 
                 {/* User Item 2 */}
                 <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-center opacity-70">
                     <div>
                         <p className="font-bold text-white text-sm">Amila Ruwan</p>
                         <p className="text-xs text-slate-500">Pending WhatsApp SS</p>
                     </div>
                     <div className="flex items-center gap-2">
                         <input type="text" placeholder="Amount" disabled className="w-24 bg-slate-800 border border-slate-700 rounded-md p-2 text-sm text-slate-500 text-center" />
                         <button className="bg-slate-700 text-slate-500 p-2 rounded-md cursor-not-allowed">
                             <FiCheck size={18} />
                         </button>
                     </div>
                 </div>
             </div>

             <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                 <FiGlobe /> Publish Verified Winners to Board
             </button>
          </div>

      </div>
    </div>
  );
};

export default Winners;