/**
 * 文本到场景的转换工具
 * 使用关键词匹配将文本转换为场景JSON结构
 */

// 关键词映射表
const SCENE_KEYWORDS = {
  backgrounds: {
    "地铁站|站台|subway": "subway_station",
    "后巷|小巷|alley": "neon_alley",
    "广场|plaza": "data_plaza",
    "实验室|lab": "cyber_lab",
    "森林|forest": "digital_forest",
    "城市|city": "cyber_city"
  },
  moods: {
    "紧张|tense|危险": "tense",
    "神秘|mysterious": "mysterious",
    "温暖|warm": "warm",
    "混乱|chaos|故障": "chaos"
  },
  characters: {
    "义体犬|robot dog": { 
      sprite: "placeholder", 
      position: "right",
      color: "#ff0000",
      name: "义体犬"
    },
    "面摊机器人|noodle robot": { 
      sprite: "placeholder", 
      position: "left",
      color: "#00ff00",
      name: "面摊机器人"
    },
    "黑客之神|hacker": { 
      sprite: "placeholder", 
      position: "center",
      color: "#ff0000",
      name: "黑客之神"
    }
  },
  effects: {
    "闪烁|flicker|霓虹": "neon",
    "雾气|fog": "fog",
    "雨水|rain": "rain",
    "数据流|data stream|数据碎片": "dataParticles",
    "故障|glitch": "glitch"
  }
};

/**
 * 检测背景场景
 */
export function detectBackground(text) {
  for (const [pattern, bgId] of Object.entries(SCENE_KEYWORDS.backgrounds)) {
    if (new RegExp(pattern, 'i').test(text)) {
      const bgConfigs = {
        subway_station: {
          type: "gradient",
          colors: ["#0a0a0a", "#001a1a", "#003333"],
          overlay: { type: "scanlines", intensity: 0.3 },
          effects: [
            { type: "fog", color: "rgba(0, 255, 255, 0.1)", speed: "slow" },
            { type: "glitch", frequency: "low" }
          ]
        },
        neon_alley: {
          type: "gradient",
          colors: ["#1a0033", "#330066", "#6600cc", "#ff00ff"],
          overlay: { type: "scanlines", intensity: 0.2 },
          effects: [
            { type: "neon", intensity: 0.5 },
            { type: "rain", intensity: 0.3 }
          ]
        },
        data_plaza: {
          type: "gradient",
          colors: ["#000000", "#001a33", "#003366", "#0066cc"],
          overlay: { type: "scanlines", intensity: 0.4 },
          effects: [
            { type: "dataParticles", intensity: 0.6, color: "rgba(0, 255, 255, 0.5)" },
            { type: "glow", color: "rgba(0, 255, 255, 0.3)" }
          ]
        }
      };
      
      return bgConfigs[bgId] || {
        type: "gradient",
        colors: ["#000000", "#001a1a"]
      };
    }
  }
  
  return {
    type: "gradient",
    colors: ["#000000", "#001a1a"],
    overlay: { type: "scanlines", intensity: 0.3 }
  };
}

/**
 * 检测角色
 */
export function detectCharacters(text) {
  const characters = [];
  for (const [pattern, config] of Object.entries(SCENE_KEYWORDS.characters)) {
    if (new RegExp(pattern, 'i').test(text)) {
      characters.push({
        ...config,
        id: config.name.toLowerCase().replace(/\s+/g, '_'),
        scale: 0.7,
        animation: "fadeIn",
        duration: 800
      });
    }
  }
  return characters;
}

/**
 * 检测特效
 */
export function detectEffects(text) {
  const effects = [];
  for (const [pattern, effectType] of Object.entries(SCENE_KEYWORDS.effects)) {
    if (new RegExp(pattern, 'i').test(text)) {
      const effectConfigs = {
        fog: { type: "fog", color: "rgba(0, 255, 255, 0.1)", speed: "slow" },
        neon: { type: "neon", intensity: 0.5 },
        rain: { type: "rain", intensity: 0.3 },
        dataParticles: { type: "dataParticles", intensity: 0.6, color: "rgba(0, 255, 255, 0.5)" },
        glitch: { type: "glitch", frequency: "low", intensity: 0.5 }
      };
      
      if (effectConfigs[effectType]) {
        effects.push(effectConfigs[effectType]);
      }
    }
  }
  return effects;
}

/**
 * 检测情绪
 */
export function detectMood(text) {
  for (const [pattern, mood] of Object.entries(SCENE_KEYWORDS.moods)) {
    if (new RegExp(pattern, 'i').test(text)) {
      return mood;
    }
  }
  return "neutral";
}

/**
 * 提取系统日志
 */
export function extractSystemLog(text) {
  const match = text.match(/\[系统日志[^\]]+\]/);
  return match ? match[0] : null;
}

/**
 * 提取叙述文本
 */
export function extractNarration(text) {
  const lines = text.split('\n');
  return lines
    .filter(line => {
      const trimmed = line.trim();
      return trimmed && 
             !trimmed.startsWith('[') && 
             !trimmed.match(/^[A-Z_]+:/) &&
             !trimmed.includes('：') &&
             !trimmed.match(/^[>]/);
    })
    .join('\n')
    .trim();
}

/**
 * 提取角色对话
 */
export function extractCharacterDialogue(text) {
  const dialogues = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // 匹配 "角色名：" 或 "角色名:"
    const match = line.match(/^([^：:]+)[：:]\s*(.+)$/);
    if (match) {
      dialogues.push({
        speaker: match[1].trim(),
        text: match[2].trim(),
        typingSpeed: 25
      });
    }
  }
  
  return dialogues;
}

/**
 * 主转换函数：将文本转换为场景JSON
 */
export function parseTextToScene(text, sceneId) {
  const background = detectBackground(text);
  const characters = detectCharacters(text);
  const effects = detectEffects(text);
  const mood = detectMood(text);
  const systemLog = extractSystemLog(text);
  const narration = extractNarration(text);
  const characterDialogue = extractCharacterDialogue(text);
  
  // 合并检测到的特效到背景
  if (effects.length > 0) {
    background.effects = [...(background.effects || []), ...effects];
  }
  
  const scene = {
    id: sceneId,
    chapter: 1,
    metadata: {
      mood: mood,
      timeOfDay: "night"
    },
    background: background,
    characters: characters,
    dialogue: {
      system: systemLog ? { text: systemLog, type: "system" } : null,
      narrator: narration ? { text: narration, typingSpeed: 30 } : null,
      character: characterDialogue[0] || null,
      character2: characterDialogue[1] || null
    },
    ui: {
      hud: {
        stability: 100,
        chapter: 1,
        show: true
      }
    },
    camera: {
      effect: "fadeIn",
      shake: false,
      zoom: 1.0
    },
    transitions: {
      in: "fade",
      out: "fade",
      duration: 1000
    }
  };
  
  return scene;
}

