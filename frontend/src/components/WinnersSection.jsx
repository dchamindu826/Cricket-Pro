import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAward, FiUser, FiGift } from 'react-icons/fi';

const WinnersSection = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await axios.get('https://cricket-pro-three.vercel.app/api/winners/published');
        setWinners(response.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchWinners();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Loading Winners...</div>;

  return (
    <section id="winners" className="py-20 relative z-20 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cricket-gold to-yellow-500 mb-4 uppercase tracking-wider flex items-center justify-center gap-4">
            <FiAward className="text-cricket-gold" /> Our Winners <FiAward className="text-cricket-gold" />
          </h2>
          <p className="text-slate-400">The lucky predictors who won our latest matches!</p>
        </div>

        {winners.length === 0 ? (
          <div className="bg-[#0b1b36] border border-slate-700 p-10 rounded-2xl text-center max-w-2xl mx-auto">
            <p className="text-slate-400 text-lg">No winners have been announced yet.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {winners.map((winner) => (
              <div key={winner.id} className="bg-gradient-to-b from-[#0b1b36] to-[#050f20] w-full md:w-[340px] p-6 rounded-3xl border-2 border-cricket-gold/20 hover:border-cricket-gold shadow-[0_0_20px_rgba(255,215,0,0.05)] hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all duration-500 relative overflow-hidden group transform hover:-translate-y-2">
                
                {/* Animated Background Ray */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cricket-gold to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cricket-gold to-yellow-600 flex items-center justify-center shadow-lg text-black border-2 border-[#0b1b36]">
                    <FiUser size={26} className="font-bold" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-cricket-gold uppercase tracking-widest mb-1">Champion</p>
                    <h3 className="text-2xl font-black text-white leading-tight">{winner.name}</h3>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 p-5 rounded-2xl flex items-center justify-between group-hover:border-cricket-gold/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-cricket-gold/20 p-2 rounded-lg text-cricket-gold">
                      <FiGift size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Prize Won</p>
                      <p className="text-sm font-bold text-white">{winner.prize}</p>
                    </div>
                  </div>
                  
                  {/* Animated Price Amount */}
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Value</p>
                    <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                      ${winner.prize_value || 0}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WinnersSection;