import React, { useState, useEffect } from 'react';

export default function DialogueBox({ dialogue, onNext, typingSpeed = 30, onDialogueComplete, onShowChoices }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (!dialogue?.text) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }
    
    setDisplayedText('');
    setIsComplete(false);
    let currentIndex = 0;
    
    const timer = setInterval(() => {
      if (currentIndex < dialogue.text.length) {
        setDisplayedText(dialogue.text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
        // 当对话完成且没有下一句时，触发完成回调
        if (!onNext && onDialogueComplete) {
          onDialogueComplete();
        }
      }
    }, typingSpeed);
    
    return () => clearInterval(timer);
  }, [dialogue, typingSpeed, onNext, onDialogueComplete]);
  
  if (!dialogue) return null;
  
  // 根据对话类型设置样式
  const getDialogueStyle = () => {
    if (dialogue.type === 'system') {
      return {
        borderColor: '#facc15',
        bgColor: 'rgba(0, 0, 0, 0.95)',
        textColor: '#facc15',
        nameBgColor: 'rgba(250, 204, 21, 0.2)'
      };
    }
    if (dialogue.type === 'narrator') {
      return {
        borderColor: '#67e8f9',
        bgColor: 'rgba(0, 0, 0, 0)',
        textColor: '#ffffff',
        nameBgColor: 'rgba(103, 232, 249, 0.2)'
      };
    }
    if (dialogue.type === 'character' || dialogue.speaker) {
      return {
        borderColor: '#0ff',
        bgColor: 'rgba(0, 0, 0, 0.95)',
        textColor: '#ffffff',
        nameBgColor: 'rgba(0, 255, 255, 0.2)'
      };
    }
    return {
      borderColor: '#0ff',
      bgColor: 'rgba(0, 0, 0, 0)',
      textColor: '#ffffff',
      nameBgColor: 'rgba(0, 255, 255, 0.2)'
    };
  };
  
  const style = getDialogueStyle();
  
  return (
    <div className="dialogue-box fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* 对话框主体 */}
        <div 
          className="border-2 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.6)] backdrop-blur-sm"
          style={{
            borderColor: style.borderColor,
            backgroundColor: style.bgColor
          }}
        >
          {/* 角色名栏 */}
          {dialogue.speaker && (
            <div 
              className="px-6 py-2 border-b-2 font-bold text-lg"
              style={{
                borderColor: style.borderColor,
                backgroundColor: style.nameBgColor,
                color: style.textColor
              }}
            >
              {dialogue.speaker}
            </div>
          )}
          
          {/* 对话内容 */}
          <div className="px-6 py-6">
            <div 
              className="dialogue-text text-lg md:text-xl leading-relaxed font-mono"
              style={{ 
                color: style.textColor,
                minHeight: '80px',
                display: 'flex',
                alignItems: 'flex-start',
                transition: 'none'
              }}
            >
              <span style={{ flex: 1, wordBreak: 'break-word' }}>{displayedText}</span>
              {!isComplete && <span className="animate-pulse ml-1 flex-shrink-0">|</span>}
            </div>
            
            {/* 按钮容器 - 固定高度避免突然变大 */}
            <div className="mt-4 h-10 flex justify-end items-center">
              {/* 继续提示 */}
              {isComplete && onNext && (
                <button
                  onClick={onNext}
                  className="px-6 py-2 border-2 rounded hover:bg-cyan-500 hover:text-black transition-all font-bold text-sm animate-pulse"
                  style={{
                    borderColor: style.borderColor,
                    color: style.textColor
                  }}
                >
                  点击继续 →
                </button>
              )}
              {/* 对话完成后的查看选项按钮 */}
              {isComplete && !onNext && onShowChoices && (
                <button
                  onClick={onShowChoices}
                  className="px-6 py-2 border-2 rounded hover:bg-cyan-500 hover:text-black transition-all font-bold text-sm animate-pulse"
                  style={{
                    borderColor: style.borderColor,
                    color: style.textColor
                  }}
                >
                  查看选项 →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

