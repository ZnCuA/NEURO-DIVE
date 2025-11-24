import React from 'react';

export default function SystemLog({ text, visible = true }) {
  if (!visible || !text) return null;
  
  return (
    <div className="system-log fixed top-20 left-0 right-0 z-30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/80 border-2 border-yellow-500 rounded-lg p-4 shadow-[0_0_20px_rgba(255,255,0,0.3)]">
          <div className="text-yellow-400 font-mono text-sm">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}

