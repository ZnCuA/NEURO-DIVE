/**
 * 场景加载器
 * 负责加载和缓存场景JSON数据
 */

const sceneCache = {};

export async function loadScene(sceneId) {
  // 检查缓存
  if (sceneCache[sceneId]) {
    return sceneCache[sceneId];
  }

  try {
    // 根据场景ID构建路径（使用process.env.PUBLIC_URL支持子路径）
    const publicUrl = process.env.PUBLIC_URL || '';
    const scenePath = `${publicUrl}/data/scenes/chapter1/${sceneId}.json`;
    
    const response = await fetch(scenePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load scene: ${sceneId}, status: ${response.status}`);
    }
    
    const sceneData = await response.json();
    
    // 缓存场景数据
    sceneCache[sceneId] = sceneData;
    
    return sceneData;
  } catch (error) {
    return null;
  }
}

export function preloadScenes(sceneIds) {
  return Promise.all(sceneIds.map(id => loadScene(id)));
}

export function clearSceneCache() {
  Object.keys(sceneCache).forEach(key => delete sceneCache[key]);
}

