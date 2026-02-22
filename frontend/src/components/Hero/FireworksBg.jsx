import React from 'react';
import { motion } from 'framer-motion';

// Random positions saha colors generate karanna helper function
const getRandomPosition = () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  scale: Math.random() * 0.5 + 0.5,
});

const colors = ['#64ffda', '#ffd700', '#0077be']; // Neon blue, Gold, Ocean blue

const FireworkParticle = ({ color }) => {
  const randomPos = getRandomPosition();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0], // Pata wela, dim wela nathi wenawa
        scale: [0, 2, 4],     // Loku wela pupuranawa
      }}
      transition={{
        duration: Math.random() * 2 + 2, // Random welawak yanawa
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: Math.random() * 2
      }}
      style={{
        position: 'absolute',
        ...randomPos,
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, // Soft radial gradient
        filter: 'blur(20px)', // Soft look eka ganna blur karanawa
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

const FireworksBg = () => {
  // Random fireworks 15k withara screen ekata damu
  return (
    <div className="absolute inset-0 overflow-hidden bg-cricket-blue opacity-90">
      {[...Array(15)].map((_, i) => (
        <FireworkParticle key={i} color={colors[i % colors.length]} />
      ))}
        {/* Thawa dark gradient overlay ekak damu kattiya highlight wenna */}
       <div className="absolute inset-0 bg-gradient-to-t from-cricket-dark via-transparent to-cricket-dark z-10"></div>
    </div>
  );
};

export default FireworksBg;