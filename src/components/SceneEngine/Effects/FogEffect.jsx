import React from 'react';

export default function FogEffect({ color = 'rgba(0, 255, 255, 0.1)', speed = 'slow' }) {
  const speedClass = speed === 'fast' ? 'animate-pulse' : '';
  
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${speedClass}`}
      style={{
        background: `radial-gradient(circle at 30% 50%, ${color} 0%, transparent 50%),
                     radial-gradient(circle at 70% 50%, ${color} 0%, transparent 50%)`,
        opacity: 0.6,
        animation: speed === 'slow' ? 'fogFloat 8s ease-in-out infinite' : 'fogFloat 4s ease-in-out infinite'
      }}
    >
      <style>{`
        @keyframes fogFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

