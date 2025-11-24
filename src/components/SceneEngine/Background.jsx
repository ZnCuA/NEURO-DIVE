import React from 'react';
import ScanlineEffect from './Effects/ScanlineEffect';
import FogEffect from './Effects/FogEffect';
import GlitchEffect from './Effects/GlitchEffect';

export default function Background({ background, effects = [] }) {
  // 生成背景样式（支持图片和渐变）
  const getBackgroundStyle = () => {
    if (background?.type === 'image' && background.image) {
      const publicUrl = process.env.PUBLIC_URL || '';
      const imagePath = background.image.startsWith('/') 
        ? `${publicUrl}${background.image}` 
        : `${publicUrl}/${background.image}`;
      return {
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    
    if (background?.type === 'gradient' && background.colors) {
      const colors = background.colors.join(', ');
      return {
        background: `linear-gradient(135deg, ${colors})`
      };
    }
    
    return {
      background: 'linear-gradient(135deg, #000000, #001a1a)'
    };
  };

  const bgStyle = getBackgroundStyle();

  return (
    <div className="background-container absolute inset-0">
      {/* 主背景 */}
      <div 
        className="main-background absolute inset-0"
        style={bgStyle}
      />
      
      {/* 叠加效果 */}
      {background?.overlay?.type === 'scanlines' && (
        <ScanlineEffect intensity={background.overlay.intensity || 0.3} />
      )}
      
      {/* 特效层 */}
      {effects.map((effect, idx) => {
        if (effect.type === 'fog') {
          return (
            <FogEffect 
              key={`fog-${idx}`}
              color={effect.color}
              speed={effect.speed}
            />
          );
        }
        if (effect.type === 'glitch') {
          return (
            <GlitchEffect 
              key={`glitch-${idx}`}
              frequency={effect.frequency}
              intensity={effect.intensity || 0.5}
            />
          );
        }
        if (effect.type === 'dataParticles') {
          return (
            <div
              key={`particles-${idx}`}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 20% 30%, ${effect.color || 'rgba(0,255,255,0.3)'} 0%, transparent 50%),
                             radial-gradient(circle at 80% 70%, ${effect.color || 'rgba(0,255,255,0.3)'} 0%, transparent 50%)`,
                animation: 'particleFloat 6s ease-in-out infinite'
              }}
            >
              <style>{`
                @keyframes particleFloat {
                  0%, 100% { opacity: 0.3; transform: translateY(0); }
                  50% { opacity: 0.8; transform: translateY(-30px); }
                }
              `}</style>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

