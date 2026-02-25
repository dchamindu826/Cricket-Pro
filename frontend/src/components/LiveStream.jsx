import React, { useState, useEffect } from 'react';
import axios from 'axios';

// streamUrl eka nathnam (empty string "") video eka hide wenawa
const LiveStream = ({ streamUrl = "" }) => { 
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveScore = async () => {
      try {
        // API_KEY ekata oyage cricapi.com key eka danna
        const API_KEY = 'YOUR_API_KEY_HERE'; 
        const response = await axios.get(`https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`);
        
        // Data aawanam, eken live yana match ekak state ekata set karanawa
        // Udaharanayak widihata api mulinma thiyena match eka gannawa:
        if (response.data && response.data.data && response.data.data.length > 0) {
           const currentMatch = response.data.data[0]; 
           setMatchData(currentMatch);
        }
        setLoading(false);
      } catch (error) {
        console.error("Score update failed", error);
        setLoading(false);
      }
    };

    fetchLiveScore();
    // Thathpara 30n 30ta aluth score eka ganna (Auto Refresh)
    const interval = setInterval(fetchLiveScore, 30000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-8 relative z-40" id="live-match">
      <div className="bg-[#0b1b36] rounded-2xl border border-neon-blue/40 overflow-hidden shadow-[0_0_20px_rgba(100,255,218,0.1)] flex flex-col">
        
        {/* Scoreboard Section (Hama welema penenawa) */}
        <div className="bg-slate-900 p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-white font-bold uppercase tracking-wider text-lg">Live Match</span>
            </div>
            
            {/* API Score Data Display */}
            {loading ? (
                <div className="text-cricket-gold animate-pulse font-bold">Loading Live Score...</div>
            ) : matchData ? (
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <h3 className="text-cricket-gold text-2xl font-black">{matchData.teamInfo[0]?.shortname || matchData.teamInfo[0]?.name}</h3>
                        <p className="text-white text-lg font-bold">{matchData.score[0]?.r}/{matchData.score[0]?.w}</p>
                        <p className="text-slate-400 text-sm">{matchData.score[0]?.o} Overs</p>
                    </div>
                    <div className="text-xl font-bold text-slate-500">vs</div>
                    <div className="text-center">
                        <h3 className="text-white text-xl font-black">{matchData.teamInfo[1]?.shortname || matchData.teamInfo[1]?.name}</h3>
                        {matchData.score[1] ? (
                            <>
                              <p className="text-white text-lg font-bold">{matchData.score[1]?.r}/{matchData.score[1]?.w}</p>
                              <p className="text-slate-400 text-sm">{matchData.score[1]?.o} Overs</p>
                            </>
                        ) : (
                            <p className="text-slate-400 text-sm mt-1">Yet to bat</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-slate-400 font-semibold">No Live Matches Available</div>
            )}
            
            <div className="text-neon-blue text-xs md:text-sm font-semibold text-center md:text-right max-w-[200px]">
                {matchData?.status || "Match status updating..."}
            </div>
        </div>

        {/* Video Player Section (streamUrl thiyenawanam witharai penenne) */}
        {streamUrl ? (
          <div className="relative w-full pt-[56.25%] bg-black flex items-center justify-center">
              <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={streamUrl} 
                  title="Live Cricket Stream"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
              ></iframe>
          </div>
        ) : (
          <div className="w-full h-[300px] bg-black flex flex-col items-center justify-center text-slate-400 p-4 text-center">
             <span className="text-5xl mb-4 animate-bounce">🏏</span>
             <p className="text-xl font-bold tracking-wider text-white">Live stream will start shortly...</p>
             <p className="text-sm mt-2 opacity-60">Keep checking the scoreboard above for the latest updates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStream;