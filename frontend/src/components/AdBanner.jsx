import React from 'react';

const AdBanner = () => {
  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      <div className="w-full h-[100px] md:h-[120px] bg-[#0b1b36] border border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group">
        <span className="text-xs tracking-widest uppercase mb-1">Advertisement</span>
        <span className="text-lg font-bold group-hover:text-neon-blue transition-colors duration-300">
          YOUR MOCK BANNER AD HERE
        </span>
        {/* Ad network placeholder text */}
        <span className="absolute bottom-2 right-2 text-[10px] opacity-50">Ads by Adsterra</span>
      </div>
    </div>
  );
};

export default AdBanner;