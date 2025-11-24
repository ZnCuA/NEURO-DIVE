import React from 'react';

export default function SystemLog({ text, visible = true }) {
  if (!visible || !text) return null;
  
  return (
    <div className="system-log fixed top-20 left-0 right-0 z-30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-950/30 border-l-4 border-yellow-500 pl-4 py-2 text-yellow-400 font-mono text-sm shadow-[0_0_10px_rgba(255,255,0,0.2)]">
          {text}
        </div>
      </div>
    </div>
  );
}

