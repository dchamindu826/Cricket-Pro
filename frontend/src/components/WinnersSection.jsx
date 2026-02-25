import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAward, FiUser, FiGift } from 'react-icons/fi';

const WinnersSection = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lang, setLang] = useState('EN'); // Language State (EN, SI, TA)

  // Translations for the claim message
  const claimMessages = {
    EN: "🎉 Congratulations to our winners! To claim your cash prize, please take a screenshot of your winning comment and send it to us via WhatsApp.",
    SI: "🎉 අපගේ ජයග්‍රාහකයින්ට සුබ පැතුම්! ඔබේ ත්‍යාගය ලබා ගැනීමට, කරුණාකර ඔබේ ජයග්‍රාහී කමෙන්ටුවේ Screenshot එකක් ගෙන අපගේ WhatsApp අංකයට එවන්න.",
    TA: "🎉 எங்கள் வெற்றியாளர்களுக்கு வாழ்த்துக்கள்! உங்கள் பரிசைப் பெற, உங்கள் வெற்றிப் பின்னூட்டத்தை ஸ்கிரீன்ஷாட் எடுத்து எங்கள் WhatsApp எண்ணிற்கு அனுப்பவும்."
  };

  useEffect(() => {
    const fetchPublishedWinners = async () => {
      try {
        const response = await axios.get('https://cricket-pro-three.vercel.app/api/winners/published');
        setWinners(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching published winners:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchPublishedWinners();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Loading Winners...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">Error loading winners. Please try again later.</div>;

  return (
    <section id="winners" className="py-20 relative z-20 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cricket-gold to-yellow-500 mb-4 uppercase tracking-wider flex items-center justify-center gap-4">
            <FiAward className="text-cricket-gold" /> Our Winners <FiAward className="text-cricket-gold" />
          </h2>
          <p className="text-slate-400">The lucky predictors who won our latest matches!</p>
        </div>

        {winners.length === 0 ? (
          <div className="bg-[#0b1b36] border border-slate-700 p-10 rounded-2xl text-center max-w-2xl mx-auto shadow-lg">
            <p className="text-slate-400 text-lg">No winners have been announced yet. Keep playing and you could be the first!</p>
          </div>
        ) : (
          <>
            {/* ====== Claim Message & WhatsApp Box ====== */}
            <div className="bg-gradient-to-b from-[#0b1b36] to-[#050f20] border border-neon-blue/30 p-6 md:p-8 rounded-3xl max-w-3xl mx-auto mb-16 shadow-[0_0_20px_rgba(100,255,218,0.1)] relative overflow-hidden">
              
              {/* Language Switcher */}
              <div className="flex justify-center gap-2 mb-6">
                {['EN', 'SI', 'TA'].map((l) => (
                  <button 
                    key={l} 
                    onClick={() => setLang(l)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${lang === l ? 'bg-neon-blue text-[#050f20]' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
                  >
                    {l === 'EN' ? 'English' : l === 'SI' ? 'සිංහල' : 'தமிழ்'}
                  </button>
                ))}
              </div>

              {/* Message Text */}
              <p className="text-center text-slate-200 text-sm md:text-base leading-relaxed mb-8">
                {claimMessages[lang]}
              </p>

              {/* WhatsApp Button */}
              <div className="flex justify-center">
                <a 
                  href="https://wa.me/94700000000" // ඔයාගේ WhatsApp Number එක මෙතන දාන්න (+94...)
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20b858] text-white px-8 py-3 rounded-full font-bold flex items-center gap-3 transition-transform hover:scale-105 shadow-[0_0_15px_rgba(37,211,102,0.4)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                  Claim via WhatsApp
                </a>
              </div>
            </div>

            {/* ====== Winners Cards Grid (Auto Balancing) ====== */}
            <div className="flex flex-wrap justify-center gap-6">
              {winners.map((winner) => (
                <div 
                  key={winner.id} 
                  className="bg-[#0b1b36] w-full md:w-[320px] p-6 rounded-2xl border border-cricket-gold/30 hover:border-cricket-gold shadow-[0_0_15px_rgba(255,215,0,0.05)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cricket-gold/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-cricket-gold/20 transition-all"></div>

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cricket-gold to-yellow-600 flex items-center justify-center shadow-lg text-black">
                      <FiUser size={24} className="font-bold" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-cricket-gold uppercase tracking-widest mb-1">Winner</p>
                      <h3 className="text-xl font-bold text-white leading-tight">{winner.name}</h3>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl relative z-10 flex items-start gap-3">
                    <div className="mt-0.5 text-neon-blue">
                      <FiGift size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Prize Won</p>
                      <p className="text-sm font-bold text-white">{winner.prize}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default WinnersSection;