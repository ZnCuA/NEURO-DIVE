import { useState, useEffect } from 'react';

export function useDialogue(dialogueData) {
  const [dialogueQueue, setDialogueQueue] = useState([]);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  useEffect(() => {
    if (!dialogueData) return;

    const queue = [];
    
    // 系统日志
    if (dialogueData.system) {
      queue.push({
        ...dialogueData.system,
        type: 'system'
      });
    }
    
    // 叙述文本
    if (dialogueData.narrator) {
      queue.push({
        ...dialogueData.narrator,
        type: 'narrator'
      });
    }
    
    // 角色对话
    if (dialogueData.character) {
      queue.push({
        ...dialogueData.character,
        type: 'character'
      });
    }
    
    // 第二个角色对话
    if (dialogueData.character2) {
      queue.push({
        ...dialogueData.character2,
        type: 'character'
      });
    }
    
    // 语音提示
    if (dialogueData.voice) {
      queue.push({
        ...dialogueData.voice,
        type: 'voice'
      });
    }

    setDialogueQueue(queue);
    setDialogueIndex(0);
    if (queue.length > 0) {
      setCurrentDialogue(queue[0]);
    }
  }, [dialogueData]);

  const nextDialogue = () => {
    if (dialogueIndex < dialogueQueue.length - 1) {
      const nextIndex = dialogueIndex + 1;
      setDialogueIndex(nextIndex);
      setCurrentDialogue(dialogueQueue[nextIndex]);
    } else {
      // 对话结束
      setCurrentDialogue(null);
    }
  };

  const resetDialogue = () => {
    setDialogueIndex(0);
    if (dialogueQueue.length > 0) {
      setCurrentDialogue(dialogueQueue[0]);
    }
  };

  return {
    currentDialogue,
    dialogueQueue,
    dialogueIndex,
    hasNext: dialogueIndex < dialogueQueue.length - 1,
    nextDialogue,
    resetDialogue
  };
}

