import React, { useEffect } from 'react';

const NativeBanner = () => {
  useEffect(() => {
    if (!document.querySelector('script[src*="4c2d5bf22cad3fd9a066824b28e22dd3"]')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = 'https://pl28789850.effectivegatecpm.com/4c2d5bf22cad3fd9a066824b28e22dd3/invoke.js';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-6 overflow-hidden min-h-[100px]">
      <div id="container-4c2d5bf22cad3fd9a066824b28e22dd3"></div>
    </div>
  );
};

export default NativeBanner;