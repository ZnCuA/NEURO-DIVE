import React from 'react';
import { Activity, Shield } from 'lucide-react';

export default function HUD({ stability, chapter, visible = true }) {
  if (!visible) return null;
  
  return (
    <div className="hud fixed top-0 left-0 right-0 z-40 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-cyan-400 font-bold text-xl font-mono">
            NEURO-DIVE_TERM_v0.9
          </span>
          <span className="text-yellow-400 font-semibold">
            第一章：霓虹雨夜
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded border border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.3)]">
            <Activity size={16} className="animate-pulse" />
            <span className="font-mono">
              STABILITY: <span className="text-cyan-300">{stability}%</span>
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded border border-yellow-500/30 bg-yellow-950/30 text-yellow-500 shadow-[0_0_8px_rgba(255,255,0,0.3)]">
            <Shield size={16} />
            <span className="font-mono">
              SEC_LVL: <span className="text-yellow-300">{4 - chapter}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

