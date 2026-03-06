import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Scoreboard = () => {
  const [score, setScore] = useState({ runs: 0, wickets: 0, overs: 0.0, currentBatsmanRuns: 0 });
  const [teamInfo, setTeamInfo] = useState({ name: "TBA" });
  const [matchStatus, setMatchStatus] = useState("● LIVE | Waiting for Admin Selection...");
  const [matchTitle, setMatchTitle] = useState("Live Scoreboard");
  const [isSix, setIsSix] = useState(false);
  
  const prevRunsRef = useRef(0);

  useEffect(() => {
    axios.get('https://cricket-pro-three.vercel.app/api/admin/track-visit').catch(()=>console.log("Ignored"));

    const fetchLiveScore = async () => {
      try {
        // 1. Admin තෝරපු මැච් ID එක ගන්නවා
        const settingsRes = await axios.get('https://cricket-pro-three.vercel.app/api/admin/active-match');
        const adminSelectedId = settingsRes.data.match_id;

        if (!adminSelectedId) {
            setMatchStatus("● STANDBY | No Match Selected");
            return;
        }

        // 2. RapidAPI එකෙන් ඒ මැච් එකේ විස්තර ගන්නවා
        const options = {
          method: 'GET',
          url: `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${adminSelectedId}`,
          headers: {
            'X-RapidAPI-Key': 'cd72733c17mshb6183f2ce7d960ap15870fjsn5d09d19ac6a5',
            'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        const matchData = response.data;

        if (matchData && matchData.matchInfo) {
            setMatchTitle(`${matchData.matchInfo.team1.teamSName} vs ${matchData.matchInfo.team2.teamSName}`);
            setMatchStatus(`● LIVE | ${matchData.matchInfo.status}`);

            // ලකුණු ගන්නවා (Bat කරන ටීම් එක හොයාගෙන)
            if (matchData.matchScore && matchData.matchScore.team1Score) {
                let currentInnings = matchData.matchScore.team1Score.inngs1 || matchData.matchScore.team1Score.inngs2;
                let battingTeamName = matchData.matchInfo.team1.teamSName;

                // Team 2 එක බැට් කරනවා නම්
                if (matchData.matchScore.team2Score && matchData.matchScore.team2Score.inngs1) {
                     currentInnings = matchData.matchScore.team2Score.inngs1;
                     battingTeamName = matchData.matchInfo.team2.teamSName;
                }

                if (currentInnings) {
                    const newRuns = currentInnings.runs || 0;
                    
                    let runDiff = newRuns - prevRunsRef.current;
                    if (prevRunsRef.current === 0 || runDiff < 0 || runDiff > 6) {
                        runDiff = 0; 
                    }

                    if (runDiff === 6) {
                      setIsSix(true);
                      setTimeout(() => setIsSix(false), 3000);
                    }

                    setScore({
                      runs: newRuns,
                      wickets: currentInnings.wickets || 0,
                      overs: currentInnings.overs || 0.0,
                      currentBatsmanRuns: runDiff
                    });

                    prevRunsRef.current = newRuns;
                    setTeamInfo({ name: battingTeamName });
                }
            }
        }
      } catch (error) {
        console.error("Score fetch error:", error);
      }
    };

    fetchLiveScore(); 
    // API ලිමිට් එක ඉතුරු කරන්න මේක තත්පර 30කට සැරයක් (30000ms) විතරක් Run වෙන්න හැදුවා
    const interval = setInterval(fetchLiveScore, 30000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full bg-cricket-blue/50 backdrop-blur-md border-y border-neon-blue/20 p-4 z-40 overflow-hidden">
      
      <AnimatePresence>
        {isSix && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: [0, 1.5, 1], opacity: 1, rotate: 0 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 pointer-events-none"
          >
            <div className="text-center">
               <h2 className="text-8xl font-extrabold text-cricket-gold drop-shadow-[0_0_50px_rgba(255,215,0,0.8)] animate-pulse">
                 6 RUNS!
               </h2>
               <p className="text-neon-blue text-2xl mt-2 uppercase tracking-[0.5em]">Huge Hit!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left mb-2 md:mb-0 border-b md:border-b-0 md:border-r border-slate-700 pb-2 md:pb-0 md:pr-6">
                <span className="text-sm md:text-md text-neon-blue font-bold tracking-wide max-w-xs line-clamp-1">{matchTitle}</span>
                <span className="text-xs text-slate-400">Current Innings</span>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold text-white">{teamInfo.name}</span>
                </div>
                <div className="text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {score.runs}<span className="text-3xl text-slate-300">/{score.wickets}</span>
                </div>
                <div className="text-xl text-slate-300 pt-3">
                    ({score.overs})
                </div>
            </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Last Run:</span>
            <motion.div
                key={score.runs} 
                initial={{ scale: 1.5, color: '#fff' }}
                animate={{ scale: 1, color: score.currentBatsmanRuns === 6 ? '#ffd700' : (score.currentBatsmanRuns === 4 ? '#64ffda' : '#fff') }}
                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg ${score.currentBatsmanRuns === 6 ? 'bg-cricket-blue border border-cricket-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'bg-slate-700'}`}
            >
                {score.currentBatsmanRuns}
            </motion.div>
        </div>

        <div className="text-cricket-gold text-xs sm:text-sm font-bold animate-pulse max-w-sm text-center md:text-right bg-[#050f20]/50 px-3 py-1.5 rounded-md border border-cricket-gold/30">
             {matchStatus}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;