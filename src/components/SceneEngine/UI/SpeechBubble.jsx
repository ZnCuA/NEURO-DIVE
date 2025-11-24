import React, { useState, useEffect } from 'react';

export default function SpeechBubble({ text, speaker, typingSpeed = 25, onComplete, keepVisible = true }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }
    
    setDisplayedText('');
    setIsComplete(false);
    let currentIndex = 0;
    
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
        // 如果keepVisible为false，才自动触发onComplete
        if (!keepVisible && onComplete) {
          onComplete();
        }
      }
    }, typingSpeed);
    
    return () => clearInterval(timer);
  }, [text, typingSpeed, onComplete, keepVisible]);
  
  if (!text) return null;
  
  return (
    <div className="speech-bubble absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
      <div className="relative bg-black/90 border-2 border-cyan-500 rounded-lg px-5 py-4 shadow-[0_0_20px_rgba(0,255,255,0.5)] min-w-[250px] max-w-[400px]">
        {/* 角色名 */}
        {speaker && (
          <div className="text-cyan-400 font-bold text-base mb-2 border-b border-cyan-500/30 pb-2">
            {speaker}
          </div>
        )}
        {/* 对话内容 */}
        <div className="text-white text-lg font-mono leading-relaxed">
          {displayedText}
          {!isComplete && <span className="animate-pulse ml-1">|</span>}
        </div>
        {/* 气泡尾部 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div 
            className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-cyan-500"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,255,255,0.3))' }}
          />
        </div>
      </div>
    </div>
  );
}

