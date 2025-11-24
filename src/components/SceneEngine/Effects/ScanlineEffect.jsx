import React from 'react';

export default function ScanlineEffect({ intensity = 0.3 }) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 255, 255, ${intensity}) 2px,
          rgba(0, 255, 255, ${intensity}) 4px
        )`,
        opacity: 0.5
      }}
    />
  );
}

