import React, { useEffect, useRef } from 'react';

const NativeBanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.hasAttribute('data-ad-loaded')) {
      
      // 1. Adsterra වලට අවශ්‍ය Settings (atOptions) සකස් කිරීම
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '4c2d5bf22cad3fd9a066824b28e22dd3',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      bannerRef.current.appendChild(confScript);

      // 2. Adsterra Invoke Script එක Load කිරීම
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.async = true;
      invokeScript.src = '//pl28789850.effectivegatecpm.com/4c2d5bf22cad3fd9a066824b28e22dd3/invoke.js';
      
      bannerRef.current.appendChild(invokeScript);
      
      // ආයේ ආයේ Load වෙන එක නවත්වන්න Mark කරනවා
      bannerRef.current.setAttribute('data-ad-loaded', 'true');
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-6 overflow-hidden px-4">
      {/* Ad එක මැදට ලස්සනට පෙන්නන්න හදපු Box එක */}
      <div 
        ref={bannerRef} 
        className="flex justify-center bg-[#0b1b36]/30 border border-slate-800/50 rounded-lg p-2 shadow-lg min-w-[320px] min-h-[66px] relative z-10"
      >
        {/* Ads Load වෙනකම් විතරක් මේක පෙනේවි */}
        {!bannerRef.current?.hasAttribute('data-ad-loaded') && (
            <span className="text-slate-600 text-xs font-semibold tracking-widest uppercase flex items-center justify-center h-[50px]">
                Advertisement
            </span>
        )}
      </div>
    </div>
  );
};

export default NativeBanner;