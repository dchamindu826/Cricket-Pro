import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    // ⚠️ අලුත් Monetag Banner Script එක ලැබුනම, ඒකෙ URL එක මෙතනට දාන්න.
    // උදාහරණයක්: https://domain.com/tag.min.js
    const monetagScriptURL = ""; 

    if (monetagScriptURL && bannerRef.current && !bannerRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = monetagScriptURL;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      
      // Script එක Container එක ඇතුලට දානවා
      bannerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full mx-auto my-6 md:my-8 px-4 flex justify-center overflow-hidden">
      
      {/* Ad එක load වෙනකම් ලස්සනට පෙන්නන්න හදපු Box එක */}
      <div className="bg-[#0b1b36]/50 border border-slate-800 rounded-2xl min-w-[300px] min-h-[100px] md:min-h-[250px] flex items-center justify-center shadow-lg relative">
        
        {/* Monetag එකෙන් දෙන ID එක (උදා: id="container-12345") මේ div එකට දාන්න */}
        <div ref={bannerRef} id="monetag-banner-container" className="relative z-10">
            {/* Ads load වෙනකම් පෙන්නන Placeholder එක */}
            <span className="text-slate-600 text-xs md:text-sm font-semibold tracking-widest uppercase">
                Advertisement
            </span>
        </div>

      </div>
      
    </div>
  );
};

export default AdBanner;