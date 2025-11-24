/**
 * 资源预加载工具
 * 预加载场景所需的图片和音频资源
 */

const imageCache = new Map();
const audioCache = new Map();

export async function preloadSceneAssets(sceneData) {
  const assets = [];
  
  // 预加载背景（如果是图片）
  if (sceneData.background?.image) {
    assets.push(loadImage(sceneData.background.image));
  }
  
  // 预加载角色立绘
  if (sceneData.characters) {
    sceneData.characters.forEach(char => {
      if (char.sprite && char.sprite !== 'placeholder') {
        assets.push(loadImage(char.sprite));
      }
    });
  }
  
  // 预加载音频
  if (sceneData.audio?.bgm) {
    assets.push(loadAudio(sceneData.audio.bgm));
  }
  
  if (sceneData.audio?.ambient) {
    assets.push(loadAudio(sceneData.audio.ambient));
  }
  
  try {
    await Promise.all(assets);
  } catch (error) {
    // 资源预加载失败，静默处理
  }
}

function loadImage(src) {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src));
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

function loadAudio(src) {
  if (audioCache.has(src)) {
    return Promise.resolve(audioCache.get(src));
  }
  
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => {
      audioCache.set(src, audio);
      resolve(audio);
    };
    audio.onerror = reject;
    audio.src = src;
  });
}

export function clearAssetCache() {
  imageCache.clear();
  audioCache.clear();
}

