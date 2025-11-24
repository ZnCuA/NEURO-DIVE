import React from 'react';
import { Terminal } from 'lucide-react';

export default function ChoiceButtons({ choices = [], onSelect }) {
  if (!choices || choices.length === 0) return null;
  
  const handleChoice = (choice) => {
    if (onSelect) {
      onSelect(choice);
    }
  };
  
  return (
    <div className="choice-buttons fixed bottom-24 left-0 right-0 z-40 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-4 justify-center">
          {choices.map((choice, idx) => {
            return (
              <button
                key={choice.id || idx}
                onClick={() => handleChoice(choice)}
                className="group relative px-6 py-3 border-2 border-cyan-500 bg-black/80 hover:bg-cyan-500 hover:text-black transition-all text-sm font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,255,0.5)] hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] hover:scale-105"
              >
                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Terminal size={14} className="relative z-10" />
                <span className="relative z-10">{choice.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

