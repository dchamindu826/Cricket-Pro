import React from 'react';

const LiveStream = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-8 relative z-40">
      <div className="bg-[#0b1b36] rounded-2xl border border-neon-blue/40 overflow-hidden shadow-[0_0_20px_rgba(100,255,218,0.1)]">
        
        {/* Stream Header */}
        <div className="bg-slate-900 px-4 py-3 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-white font-bold uppercase tracking-wider">Live Match</span>
            </div>
            <span className="text-cricket-gold text-sm font-bold">IND vs AUS</span>
        </div>

        {/* 16:9 Aspect Ratio Container for Iframe */}
        <div className="relative w-full pt-[56.25%] bg-black flex items-center justify-center">
            {/* Methanata thama oya Live streaming link eka iframe ekak widihata danne */}
            <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1" 
                title="Live Cricket Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            
            {/* Aththa link ekak nathi welawata pennanna placeholder ekak */}
            {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <p>Stream will start shortly...</p>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default LiveStream;