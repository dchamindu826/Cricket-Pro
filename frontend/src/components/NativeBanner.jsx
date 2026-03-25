import React, { useEffect } from 'react';

const NativeBanner = () => {

  useEffect(() => {
    // Adsterra බලාපොරොත්තු වෙන ID එක තියෙන Container එක හොයාගන්නවා
    const adContainer = document.getElementById('container-ab51d3417470d9dc62ca478863f19725');

    // Container එක තියෙනවා නම් සහ කලින් Script එක ලෝඩ් වෙලා නැත්නම් විතරක් ලෝඩ් කරනවා
    if (adContainer && !adContainer.hasChildNodes()) {
      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = 'https://pl28974724.profitablecpmratenetwork.com/ab51d3417470d9dc62ca478863f19725/invoke.js';
      
      adContainer.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-6 px-4 overflow-hidden">
      {/* Mobile Optimized Box:
        max-w-md (උපරිම පළල) දීලා තියෙන නිසා ෆෝන් වලට ලස්සනට ගැලපෙනවා.
        වෙබ්සයිට් එකේ පාටට ගැලපෙන විදිහට Background එක දීලා තියෙනවා.
      */}
      <div className="w-full max-w-md bg-[#0b1b36]/30 border border-slate-800/50 rounded-xl p-2 shadow-lg min-h-[100px] flex justify-center items-center relative z-10">
        
        {/* Adsterra Script එකෙන් Ad එක පෙන්වන ප්‍රධාන Container එක */}
        <div id="container-ab51d3417470d9dc62ca478863f19725" className="w-full flex justify-center"></div>
        
      </div>
    </div>
  );
};

export default NativeBanner;