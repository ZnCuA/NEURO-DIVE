import React, { useEffect, useState } from 'react';
import Background from './Background';
import Character from './Character';
import DialogueBox from './DialogueBox';
import HUD from './UI/HUD';
import ChoiceModal from './UI/ChoiceModal';
import SystemLog from './UI/SystemLog';
import { useScene } from '../../hooks/useScene';
import { useDialogue } from '../../hooks/useDialogue';
import { preloadSceneAssets } from '../../utils/assetPreloader';

export default function SceneEngine({ sceneData, onChoiceSelect, stability, chapter }) {
  const { currentScene, isTransitioning } = useScene(sceneData);
  const { currentDialogue, nextDialogue, hasNext } = useDialogue(currentScene?.dialogue);
  const [showChoices, setShowChoices] = useState(false);
  
  // 预加载资源
  useEffect(() => {
    if (currentScene) {
      preloadSceneAssets(currentScene);
    }
  }, [currentScene]);
  
  // 控制选项显示时机：所有对话完成后自动弹出
  useEffect(() => {
    // 只有当没有当前对话（所有对话都完成）且有选项时，才自动弹出
    if (!currentDialogue && !hasNext && currentScene?.ui?.choices) {
      const timer = setTimeout(() => {
        setShowChoices(true);
      }, 800);
      return () => clearTimeout(timer);
    } else if (currentDialogue) {
      // 如果还有对话在进行，确保弹窗关闭
      setShowChoices(false);
    }
  }, [hasNext, currentScene, currentDialogue]);
  
  if (!currentScene) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-cyan-400">
        <div className="animate-pulse">加载场景中...</div>
      </div>
    );
  }
  
  return (
    <div className="scene-engine w-full h-screen relative overflow-hidden bg-black">
      {/* 过渡遮罩 */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black z-50 transition-opacity duration-500" />
      )}
      
      {/* 背景层 */}
      <Background 
        background={currentScene.background}
        effects={currentScene.background?.effects || []}
      />
      
      {/* 角色层 */}
      <div className="characters-layer absolute inset-0 z-10">
        {currentScene.characters?.map((char, idx) => (
          <Character
            key={`${char.id}-${idx}`}
            character={char}
            animation={char.animation}
          />
        ))}
      </div>
      
      {/* UI 层 */}
      <div className="ui-layer absolute inset-0 z-30">
        <HUD 
          stability={stability}
          chapter={chapter}
          visible={currentScene.ui?.hud?.show !== false}
        />
        
        {/* 系统日志 */}
        {currentScene.dialogue?.system && (
          <SystemLog text={currentScene.dialogue.system.text} />
        )}
        
        {/* 对话框 */}
        {currentDialogue && (
          <DialogueBox
            dialogue={currentDialogue}
            onNext={hasNext ? nextDialogue : undefined}
            typingSpeed={currentDialogue.typingSpeed || 30}
          />
        )}
        
        {/* 对话完成后的选项按钮 */}
        {!currentDialogue && !hasNext && currentScene.ui?.choices && !showChoices && (
          <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6">
            <div className="max-w-5xl mx-auto flex justify-end">
              <button
                onClick={() => setShowChoices(true)}
                className="px-6 py-3 border-2 border-cyan-500 bg-black/90 hover:bg-cyan-500 hover:text-black transition-all font-bold text-sm font-mono shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:shadow-[0_0_30px_rgba(0,255,255,0.8)]"
              >
                查看选项 →
              </button>
            </div>
          </div>
        )}
        
        {/* 选项弹窗 */}
        {showChoices && currentScene.ui?.choices && (
          <ChoiceModal
            choices={currentScene.ui.choices}
            onSelect={onChoiceSelect}
            onClose={() => setShowChoices(false)}
          />
        )}
      </div>
    </div>
  );
}

