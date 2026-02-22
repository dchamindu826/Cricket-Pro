import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Scoreboard = () => {
  // Mock Data state
  const [score, setScore] = useState({ runs: 145, wickets: 3, overs: 18.2, currentBatsmanRuns: 4 });
  const [isSix, setIsSix] = useState(false);

  // Simulate Live Data Update (Hamathissema run 1k 2k 4k 6k wadinawa wage)
  useEffect(() => {
    const interval = setInterval(() => {
      // Random runs (0, 1, 4, or 6)
      const possibleRuns = [0, 1, 1, 2, 4, 6]; 
      const runsScored = possibleRuns[Math.floor(Math.random() * possibleRuns.length)];
      
      if (runsScored === 6) {
        setIsSix(true);
        // Sekadakis 6 animation eka nawaththanna
        setTimeout(() => setIsSix(false), 3000);
      }

      setScore(prev => ({
        ...prev,
        runs: prev.runs + runsScored,
        overs: prev.overs + 0.1 > 18.5 ? 19.0 : prev.overs + 0.1, // Simple over logic
        currentBatsmanRuns: runsScored
      }));

    }, 5000); // Hama second 5kata sarayak update wenawa

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full bg-cricket-blue/50 backdrop-blur-md border-y border-neon-blue/20 p-4 z-40 overflow-hidden">
      
      {/* === "6" Animation Overlay === */}
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
      {/* ============================ */}


      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Team Info */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white">IND</span>
                <span className="text-sm text-slate-400">Batting</span>
            </div>
            <div className="text-5xl font-extrabold text-neon-blue">
                {score.runs}/{score.wickets}
            </div>
            <div className="text-xl text-slate-300 pt-4">
                in {score.overs.toFixed(1)} overs
            </div>
        </div>

        {/* Last Ball Event */}
        <div className="flex items-center space-x-2">
            <span className="text-slate-400">Last Ball:</span>
            <motion.div
                key={score.runs} // Score eka wenas wena hama welema meka animate wenawa
                initial={{ scale: 1.5, color: '#fff' }}
                animate={{ scale: 1, color: score.currentBatsmanRuns === 6 ? '#ffd700' : (score.currentBatsmanRuns === 4 ? '#64ffda' : '#fff') }}
                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xl ${score.currentBatsmanRuns === 6 ? 'bg-cricket-blue border-2 border-cricket-gold' : 'bg-slate-700'}`}
            >
                {score.currentBatsmanRuns}
            </motion.div>
        </div>

        {/* Match Status */}
        <div className="text-cricket-gold font-semibold animate-pulse">
             ● LIVE | IND needs 32 runs in 18 balls
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;