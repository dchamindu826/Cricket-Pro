import React, { useEffect, useRef } from 'react';

const NativeBanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    // Ad එක එක පාරක් විතරක් ලෝඩ් වෙනවා කියලා තහවුරු කරන්න
    if (bannerRef.current && !bannerRef.current.hasAttribute('data-ad-loaded')) {
      
      // 1. Adsterra Settings (atOptions)
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '1288ab465f57d2cb6658be1102c9718f',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      bannerRef.current.appendChild(confScript);

      // 2. Adsterra Invoke Script (ඔයා දීපු අලුත් ලින්ක් එක)
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.async = true;
      invokeScript.src = 'https://www.highperformanceformat.com/1288ab465f57d2cb6658be1102c9718f/invoke.js';
      
      bannerRef.current.appendChild(invokeScript);
      
      // Mark as loaded
      bannerRef.current.setAttribute('data-ad-loaded', 'true');
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-6 px-4">
      {/* Container Box */}
      <div 
        ref={bannerRef} 
        className="flex justify-center bg-[#0b1b36]/30 border border-slate-800/50 rounded-lg p-2 shadow-lg min-w-[336px] min-h-[66px] relative z-10 overflow-hidden"
      >
        {/* Placeholder - Script එක load වෙනකම් */}
        <span className="absolute inset-0 flex items-center justify-center text-slate-600 text-[10px] font-semibold tracking-widest uppercase -z-10">
          Advertisement
        </span>
      </div>
    </div>
  );
};

export default NativeBanner;