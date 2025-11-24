import React, { useState, useEffect } from 'react';

const POSITION_MAP = {
  left: { left: '10%', transform: 'translateX(-50%)' },
  center: { left: '50%', transform: 'translateX(-50%)' },
  right: { right: '10%', transform: 'translateX(50%)' }
};

export default function Character({ character, animation = 'fadeIn' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSprite] = useState(character.sprite);
  
  useEffect(() => {
    if (animation === 'fadeIn' || animation === 'glitchIn') {
      setIsVisible(true);
    }
  }, [animation]);
  
  const positionStyle = POSITION_MAP[character.position] || POSITION_MAP.center;
  const duration = character.duration || 800;
  
  // 占位符渲染
  const renderPlaceholder = () => {
    return (
      <div
        className="character-placeholder relative"
        style={{
          width: '200px',
          height: '400px',
          backgroundColor: character.color || '#666',
          border: `2px solid ${character.color || '#999'}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 30px ${character.color || '#999'}40`
        }}
      >
        <div className="text-white text-sm font-bold text-center px-4">
          {character.name}
        </div>
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, transparent, ${character.color || '#999'}40)`,
            borderRadius: '8px'
          }}
        />
      </div>
    );
  };
  
  const getAnimationStyle = () => {
    const baseStyle = {
      opacity: isVisible ? 1 : 0,
      transition: `opacity ${duration}ms ease-in-out`,
      transform: `scale(${character.scale || 1}) ${positionStyle.transform}`
    };
    
    if (animation === 'glitchIn') {
      return {
        ...baseStyle,
        animation: 'glitchIn 1.5s ease-in-out'
      };
    }
    
    return baseStyle;
  };
  
  return (
    <div
      className="character absolute bottom-0 z-10"
      style={{
        ...positionStyle,
        ...getAnimationStyle()
      }}
    >
      {character.sprite === 'placeholder' ? (
        renderPlaceholder()
      ) : (
        <img
          src={(() => {
            const publicUrl = process.env.PUBLIC_URL || '';
            return character.sprite.startsWith('/') 
              ? `${publicUrl}${character.sprite}` 
              : `${publicUrl}/${character.sprite}`;
          })()}
          alt={character.name}
          className="character-sprite max-h-[80vh]"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.5))'
          }}
        />
      )}
      <style>{`
        @keyframes glitchIn {
          0% { opacity: 0; transform: scale(0.8) translateX(-50%); filter: hue-rotate(0deg); }
          25% { opacity: 0.5; transform: scale(1.1) translateX(-52%); filter: hue-rotate(90deg); }
          50% { opacity: 0.8; transform: scale(0.9) translateX(-48%); filter: hue-rotate(180deg); }
          75% { opacity: 0.9; transform: scale(1.05) translateX(-51%); filter: hue-rotate(270deg); }
          100% { opacity: 1; transform: scale(1) translateX(-50%); filter: hue-rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

