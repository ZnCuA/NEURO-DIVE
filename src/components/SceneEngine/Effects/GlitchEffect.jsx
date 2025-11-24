import React from 'react';

export default function GlitchEffect({ frequency = 'low', intensity = 0.5 }) {
  const frequencyClass = frequency === 'high' ? 'animate-pulse' : '';
  const opacity = intensity * 0.3;
  
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${frequencyClass}`}
      style={{
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,${opacity}) 2px, rgba(255,0,0,${opacity}) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,255,255,${opacity}) 2px, rgba(0,255,255,${opacity}) 4px)
        `,
        mixBlendMode: 'screen',
        animation: frequency === 'high' ? 'glitch 0.3s infinite' : 'glitch 2s infinite'
      }}
    >
      <style>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
      `}</style>
    </div>
  );
}

