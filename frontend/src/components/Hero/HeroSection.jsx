import React from 'react';
import { motion } from 'framer-motion';
import FireworksBg from './FireworksBg';
import captainsImg from '../../assets/captains-hero.png'; 

const HeroSection = () => {
  return (
    // Height eka wenas kara: Mobile = 65vh, PC = 90vh
    <div className="relative h-[65vh] md:h-[90vh] w-full flex items-end justify-center overflow-hidden">
        <FireworksBg />

        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute bottom-0 z-20 w-full md:w-4/5 lg:w-2/3 pointer-events-none"
        >
            <img 
                src={captainsImg} 
                alt="Cricket Captains" 
                className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(100,255,218,0.3)]" 
            />
        </motion.div>

        {/* Text Position eka wenas kara: PC ekedi thawa yatata (md:top-[40%]) */}
        <div className="absolute top-1/4 md:top-[80%] left-0 w-full text-center z-30 px-4">
             <motion.h1 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-cricket-gold uppercase tracking-wider drop-shadow-lg"
             >
                The Ultimate Cricket Arena
             </motion.h1>
             <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                 className="text-lg md:text-xl text-slate-300 mt-4 font-light drop-shadow-md"
             >
                Live Scores. Predict. Win Big.
             </motion.p>
        </div>
    </div>
  );
};

export default HeroSection;