import React, { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    // Native Banner script eka load kirima
    const script = document.createElement('script');
    script.src = "https://pl28789850.effectivegatecpm.com/4c2d5bf22cad3fd9a066824b28e22dd3/invoke.js";
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    // Script eka div ekata append kirima
    const container = document.getElementById('ad-container');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4 flex justify-center">
      {/* Native ad eka display wena thana */}
      <div id="ad-container">
        <div id="container-4c2d5bf22cad3fd9a066824b28e22dd3"></div>
      </div>
    </div>
  );
};

export default AdBanner;