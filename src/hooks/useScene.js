import { useState, useEffect } from 'react';

export function useScene(initialSceneData) {
  const [currentScene, setCurrentScene] = useState(initialSceneData || null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('fade');
  
  // 当传入的sceneData变化时，更新currentScene
  useEffect(() => {
    if (initialSceneData) {
      setCurrentScene(initialSceneData);
    } else {
      setCurrentScene(null);
    }
  }, [initialSceneData]);

  const loadScene = async (scenePath) => {
    try {
      setIsTransitioning(true);
      setTransitionType('fade');
      
      const response = await fetch(scenePath);
      const sceneData = await response.json();
      
      // 等待过渡动画
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentScene(sceneData);
      setIsTransitioning(false);
      
      return sceneData;
    } catch (error) {
      setIsTransitioning(false);
      return null;
    }
  };

  const transition = async (newSceneData, transitionType = 'fade') => {
    setIsTransitioning(true);
    setTransitionType(transitionType);
    
    // 淡出
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCurrentScene(newSceneData);
    
    // 淡入
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsTransitioning(false);
  };

  return {
    currentScene,
    isTransitioning,
    transitionType,
    loadScene,
    transition,
    setCurrentScene
  };
}

