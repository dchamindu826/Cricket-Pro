import React from 'react';

const WinnersSection = () => {
  const winners = [
    { name: "Sahan Kavinda", amount: "Rs. 2500", match: "IND vs AUS" },
    { name: "Amila Ruwan", amount: "Rs. 5000", match: "SL vs ENG" },
    { name: "Lahiru P.", amount: "Rs. 1000", match: "PAK vs NZ" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-cricket-gold">
          🏆 RECENT WINNERS
        </h2>
        <p className="text-slate-400 mt-2">Accurate predictions turn into real cash!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {winners.map((winner, index) => (
          <div key={index} className="bg-gradient-to-br from-[#0b1b36] to-cricket-dark p-6 rounded-2xl border border-neon-blue/30 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-[0_10px_30px_rgba(100,255,218,0.05)]">
             <div className="w-16 h-16 bg-slate-800 rounded-full mb-4 border-2 border-cricket-gold flex items-center justify-center text-2xl">
                 🧑‍💻
             </div>
             <h3 className="text-xl font-bold text-white">{winner.name}</h3>
             <p className="text-slate-500 text-sm mb-3">Predicted correctly on: {winner.match}</p>
             <div className="text-2xl font-black text-neon-blue bg-neon-blue/10 px-4 py-1 rounded-lg">
                {winner.amount}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnersSection;