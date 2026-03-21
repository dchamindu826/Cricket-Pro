import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const colors = ['#64ffda', '#ffd700', '#0077be']; // Neon blue, Gold, Ocean blue

const FireworkParticle = ({ color }) => {
  // Re-render වෙද්දී position එක වෙනස් වෙන එක නවත්වන්න useMemo දැම්මා
  const randomPos = useMemo(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    scale: Math.random() * 0.5 + 0.5,
  }), []);

  // Delay සහ Duration එකත් එක පාරක් විතරක් හැදෙන්න දැම්මා
  const animSettings = useMemo(() => ({
    duration: Math.random() * 2 + 2.5,
    delay: Math.random() * 2
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.7, 0], // 0.8 ඉඳන් 0.7 කළා තවත් smooth වෙන්න
        scale: [0, 2, 4], 
      }}
      transition={{
        duration: animSettings.duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeOut", // easeInOut වෙනුවට easeOut දැම්මම performance වැඩියි
        delay: animSettings.delay
      }}
      style={{
        position: 'absolute',
        ...randomPos,
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        // Blur එක නැතුව Soft Look එක ගන්න gradient එක වෙනස් කළා
        background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 60%)`, 
        willChange: 'transform, opacity', // 🚀 මේකෙන් තමයි lag වෙන එක නවත්වන්නේ (Hardware Acceleration)
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

const FireworksBg = () => {
  const [particleCount, setParticleCount] = useState(15);

  useEffect(() => {
    // Phone එකක් නම් particles 8ක් පෙන්නනවා, PC එකේ 15ක් පෙන්නනවා
    if (window.innerWidth < 768) {
      setParticleCount(8);
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-cricket-blue opacity-90">
      {[...Array(particleCount)].map((_, i) => (
        <FireworkParticle key={i} color={colors[i % colors.length]} />
      ))}
      
      {/* Overlay එක Click වෙන එක වළක්වන්න pointer-events-none දැම්මා */}
      <div className="absolute inset-0 bg-gradient-to-t from-cricket-dark via-transparent to-cricket-dark z-10 pointer-events-none"></div>
    </div>
  );
};

export default FireworksBg;