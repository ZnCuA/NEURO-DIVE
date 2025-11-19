import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Terminal, Zap, Shield, Cpu, Activity, Lock, Eye, Heart, Skull, Play, RotateCcw, Key, Radio } from 'lucide-react';

// --- 样式常量 & 工具 ---
const COLORS = {
  neonGreen: '#0f0',
  neonRed: '#f00',
  neonBlue: '#0ff',
  neonYellow: '#ff0',
  neonPink: '#f0f',
  darkBg: '#050505',
  terminalGreen: 'text-green-500',
  terminalRed: 'text-red-500',
  terminalBlue: 'text-cyan-400',
  terminalYellow: 'text-yellow-400',
};

const GlitchText = ({ text, color = 'text-green-500', intensity = 'low' }) => {
  return (
    <span className={`${color} relative inline-block font-mono animate-pulse`}>
      {text}
    </span>
  );
};

// 打字机效果组件
const TypewriterText = ({ text, speed = 30, className = '', onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;
    
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
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
};

// 背景网格组件 - 根据章节主题变化
const GridBackground = ({ chapter = 1 }) => {
  const theme = CHAPTERS[chapter]?.theme || CHAPTERS[1].theme;
  const gridColor = theme.gridColor;
  
  return (
    <div className="fixed inset-0 pointer-events-none opacity-10">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(${gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: chapter === 2 ? '60px 60px' : chapter === 3 ? '40px 40px' : '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}
      />
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
};

// 霓虹灯边框组件
const NeonBorder = ({ children, color = 'green' }) => {
  const colorMap = {
    green: 'border-green-500 shadow-[0_0_10px_rgba(0,255,0,0.5)]',
    cyan: 'border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]',
    red: 'border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]',
    yellow: 'border-yellow-500 shadow-[0_0_10px_rgba(255,255,0,0.5)]',
  };
  
  return (
    <div className={`border-2 ${colorMap[color]} relative`}>
      <div className={`absolute inset-0 ${colorMap[color]} opacity-50 animate-pulse`}></div>
      {children}
    </div>
  );
};

// 粒子效果组件 - 根据章节主题变化
const ParticleEffect = ({ chapter = 1 }) => {
  const [particles, setParticles] = useState([]);
  const theme = CHAPTERS[chapter]?.theme || CHAPTERS[1].theme;

  useEffect(() => {
    const particleCount = chapter === 2 ? 15 : chapter === 3 ? 25 : 20; // 第二章少一些，第三章多一些（花园感）
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: chapter === 3 ? 2 + Math.random() * 3 : 3 + Math.random() * 4, // 第三章更快
    }));
    setParticles(newParticles);
  }, [chapter]);

  const getParticleStyle = (particle) => {
    const baseStyle = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      animation: `float${chapter} ${particle.duration}s ease-in-out infinite`,
      animationDelay: `${particle.delay}s`,
      boxShadow: `0 0 6px ${theme.particleColor}`,
    };
    
    if (chapter === 2) {
      // 绿野仙踪：金色星星
      return {
        ...baseStyle,
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.particleColor}, transparent)`,
      };
    } else if (chapter === 3) {
      // 爱丽丝：花瓣/心形
      return {
        ...baseStyle,
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.particleColor}, transparent)`,
      };
    } else {
      // 赛博朋克：科技粒子
      return {
        ...baseStyle,
        width: '1px',
        height: '1px',
        borderRadius: '50%',
        backgroundColor: theme.particleColor.replace('rgba', '').replace(')', ', 0.6)'),
      };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute opacity-60"
          style={getParticleStyle(particle)}
        />
      ))}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 1; }
          50% { transform: translateY(-40px) translateX(-10px); opacity: 0.8; }
          75% { transform: translateY(-20px) translateX(5px); opacity: 0.9; }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.7; }
          25% { transform: translateY(-15px) translateX(8px) rotate(90deg); opacity: 1; }
          50% { transform: translateY(-30px) translateX(-8px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-15px) translateX(4px) rotate(270deg); opacity: 0.9; }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
          25% { transform: translateY(-25px) translateX(12px) scale(1.2); opacity: 1; }
          50% { transform: translateY(-50px) translateX(-12px) scale(0.8); opacity: 0.7; }
          75% { transform: translateY(-25px) translateX(6px) scale(1.1); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

// --- 游戏数据: 章节与场景 ---
const CHAPTERS = {
  1: { 
    title: '第一章：霓虹雨夜', 
    color: 'text-cyan-400',
    theme: {
      name: 'cyberpunk',
      primary: 'cyan',
      secondary: 'green',
      gridColor: 'rgba(0, 255, 255, 0.1)',
      particleColor: 'rgba(0, 255, 255, 0.8)',
      bgGradient: 'from-black via-cyan-950/20 to-black',
      borderColor: 'border-cyan-500',
      shadowColor: 'rgba(0, 255, 255, 0.5)',
      accentBg: 'cyan-950',
    }
  },
  2: { 
    title: '第二章：锈蚀黄砖路', 
    color: 'text-yellow-400',
    theme: {
      name: 'wizard',
      primary: 'yellow',
      secondary: 'emerald',
      gridColor: 'rgba(255, 255, 0, 0.08)',
      particleColor: 'rgba(255, 215, 0, 0.8)',
      bgGradient: 'from-black via-yellow-950/20 via-emerald-950/10 to-black',
      borderColor: 'border-yellow-500',
      shadowColor: 'rgba(255, 255, 0, 0.5)',
      accentBg: 'yellow-950',
    }
  },
  3: { 
    title: '第三章：分形花园', 
    color: 'text-pink-500',
    theme: {
      name: 'alice',
      primary: 'pink',
      secondary: 'rose',
      gridColor: 'rgba(255, 192, 203, 0.1)',
      particleColor: 'rgba(255, 20, 147, 0.8)',
      bgGradient: 'from-black via-pink-950/20 via-rose-950/10 to-black',
      borderColor: 'border-pink-500',
      shadowColor: 'rgba(255, 20, 147, 0.5)',
      accentBg: 'pink-950',
    }
  },
};

// --- 谜题组件 ---

// Ch1: 二进制修复
const BinaryPuzzle = ({ onSolve }) => {
  const [input, setInput] = useState('');
  const target = '1100'; // 1011 + 0001
  
  const check = () => {
    if (input === target) onSolve(true);
    else {
      setInput('');
      onSolve(false);
    }
  };

  return (
    <div className="border border-green-800 p-4 bg-black/50 font-mono text-green-400">
      <div className="mb-2">ERROR: 数据流断裂。请补全校验和。</div>
      <div className="text-xl mb-4">1011 + 0001 = <span className="border-b border-green-500 min-w-[60px] inline-block text-center">{input}</span></div>
      <div className="grid grid-cols-2 gap-2 max-w-[200px]">
        <button onClick={() => setInput(p => p + '0')} className="bg-green-900/30 border border-green-600 hover:bg-green-800 p-2">0</button>
        <button onClick={() => setInput(p => p + '1')} className="bg-green-900/30 border border-green-600 hover:bg-green-800 p-2">1</button>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => setInput('')} className="text-xs text-red-400">[清除]</button>
        <button onClick={check} className="text-xs text-cyan-400">[执行]</button>
      </div>
    </div>
  );
};

// Ch1: 波形校准
const WaveformPuzzle = ({ onSolve }) => {
  const [freq, setFreq] = useState(50);
  const [amp, setAmp] = useState(50);
  const [phase, setPhase] = useState(50);

  // 目标值
  const target = { freq: 75, amp: 80, phase: 30 };
  
  // 计算偏差
  const error = Math.abs(freq - target.freq) + Math.abs(amp - target.amp) + Math.abs(phase - target.phase);
  const isAligned = error < 15;

  return (
    <div className="border border-cyan-800 p-4 bg-black/50 font-mono text-cyan-400">
      <div className="mb-4">正在校准隐形桥梁... 误差: {Math.floor(error)}</div>
      
      {/* 模拟波形可视化 */}
      <div className="h-24 bg-black border border-cyan-900 mb-4 relative overflow-hidden flex items-center justify-center">
        <div className={`absolute w-full h-1 bg-gray-700 opacity-50`} style={{ transform: `scaleY(${target.amp/100})` }}></div> 
        <div className={`w-full h-1 bg-cyan-500 shadow-[0_0_10px_#0ff] transition-all duration-300`} 
             style={{ 
               transform: `scaleY(${amp/100}) rotate(${phase}deg)`,
               width: `${freq}%` 
             }}></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-12 text-xs">频率</span>
          <input type="range" min="0" max="100" value={freq} onChange={e => setFreq(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-12 text-xs">振幅</span>
          <input type="range" min="0" max="100" value={amp} onChange={e => setAmp(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-12 text-xs">相位</span>
          <input type="range" min="0" max="100" value={phase} onChange={e => setPhase(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
      </div>
      <button 
        onClick={() => onSolve(isAligned)}
        disabled={!isAligned}
        className={`mt-4 w-full py-2 border ${isAligned ? 'border-cyan-400 bg-cyan-900/50 text-cyan-100 animate-pulse' : 'border-gray-700 text-gray-600'}`}
      >
        {isAligned ? '>>> 锁定信号 <<<' : '信号未同步'}
      </button>
    </div>
  );
};

// Ch1 Boss: 端口爆破 + 逻辑门
const BossOnePuzzle = ({ onSolve, onFail }) => {
  const [stage, setStage] = useState(1);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('等待输入...');
  const [attempts, setAttempts] = useState(7);
  const targetPort = 742; // 固定的

  // 阶段 2 状态
  const [logicOp, setLogicOp] = useState('AND'); // OR is correct
  
  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num)) return;
    
    setAttempts(p => p - 1);
    if (num === targetPort) {
      setStage(2);
      setFeedback('端口开放。逻辑层暴露。');
    } else if (num < targetPort) {
      setFeedback(`> ${num}: LOW (偏低)`);
    } else {
      setFeedback(`> ${num}: HIGH (偏高)`);
    }

    if (attempts <= 1 && num !== targetPort) onFail();
    setGuess('');
  };

  const handleLogic = () => {
    // Input A=1, B=0. Target=1.
    // AND(1,0)=0, OR(1,0)=1, XOR(1,0)=1. OR/XOR correct.
    if (logicOp === 'OR' || logicOp === 'XOR') {
      onSolve(true);
    } else {
      onFail();
    }
  };

  return (
    <div className="border border-red-800 p-4 bg-black/80 font-mono text-red-500">
      <div className="flex justify-between mb-2">
        <span className="animate-pulse">⚠ 故障体：黑客之神</span>
        <span>阶段: {stage}/2</span>
      </div>

      {stage === 1 && (
        <div>
          <div className="text-sm mb-2 text-gray-400">破解端口以注入病毒。剩余步数: {attempts}</div>
          <div className="bg-red-900/20 p-2 mb-2 h-20 overflow-y-auto text-sm font-bold">
            {feedback}
          </div>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={guess}
              onChange={e => setGuess(e.target.value)}
              className="bg-black border border-red-600 text-red-500 px-2 w-full focus:outline-none"
              placeholder="输入3位端口号"
            />
            <button onClick={handleGuess} className="bg-red-900 border border-red-600 px-4 hover:bg-red-700">Hack</button>
          </div>
        </div>
      )}

      {stage === 2 && (
        <div className="text-center">
          <div className="mb-4">修复核心逻辑门以覆盖权限</div>
          <div className="flex items-center justify-center gap-4 text-xl my-6">
            <div className="flex flex-col items-center">
              <span>INPUT A (1)</span>
              <div className="h-8 w-0.5 bg-red-500"></div>
            </div>
            <div className="flex flex-col items-center">
              <span>INPUT B (0)</span>
              <div className="h-8 w-0.5 bg-red-500"></div>
            </div>
          </div>
          
          <div className="border-2 border-yellow-500 p-2 inline-block cursor-pointer hover:bg-yellow-900/30" onClick={() => {
            const ops = ['AND', 'OR', 'NOT', 'XOR'];
            setLogicOp(ops[(ops.indexOf(logicOp) + 1) % ops.length]);
          }}>
            [{logicOp}]
          </div>
          
          <div className="flex flex-col items-center mt-4">
            <div className="h-8 w-0.5 bg-red-500"></div>
            <span className="text-green-400">OUTPUT (1)</span>
          </div>

          <button onClick={handleLogic} className="mt-6 w-full bg-red-900 border border-red-500 py-2 hover:bg-red-700 text-white">
            执行逻辑注入
          </button>
        </div>
      )}
    </div>
  );
};

// Ch2: 滤镜欺诈
const FilterPuzzle = ({ onSolve }) => {
  const [hex, setHex] = useState('#555555');
  
  const checkColor = () => {
    // Check if generally green
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    
    if (g > 200 && r < 100 && b < 100) {
      onSolve(true);
    } else {
      onSolve(false);
    }
  };

  return (
    <div className="border border-yellow-600 p-4 bg-black/50 font-mono text-yellow-400">
      <div className="mb-2">系统提示：门卫只识别纯绿色 (#00FF00)</div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 border border-gray-500" style={{ backgroundColor: hex }}></div>
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="h-10 bg-transparent" />
        <span>当前渲染色值: {hex}</span>
      </div>
      <button onClick={checkColor} className="border border-yellow-500 px-4 py-1 hover:bg-yellow-900/30">应用滤镜</button>
    </div>
  );
};

// Ch2 Boss: 情感对抗
const BossTwoPuzzle = ({ onSolve, onFail }) => {
  const [round, setRound] = useState(0);
  
  const rounds = [
    { boss: "悲伤降低了CPU效率！", options: [
      { text: "逻辑优化", valid: false },
      { text: "同理心 (Empathy)", valid: true },
      { text: "数据删除", valid: false }
    ]},
    { boss: "恐惧导致死循环！", options: [
      { text: "生存本能 (Survival)", valid: true },
      { text: "强制关机", valid: false },
      { text: "错误屏蔽", valid: false }
    ]},
    { boss: "爱是无法计算的乱码！", options: [
      { text: "格式化", valid: false },
      { text: "核心驱动力 (Drive)", valid: true },
      { text: "调试模式", valid: false }
    ]}
  ];

  const handleChoice = (valid) => {
    if (valid) {
      if (round < 2) setRound(r => r + 1);
      else onSolve(true);
    } else {
      onFail();
    }
  };

  return (
    <div className="border border-gray-400 p-4 bg-zinc-900 font-mono">
      <div className="text-center mb-6">
        <h3 className="text-xl text-gray-200 font-bold">故障体·铁皮人</h3>
        <div className="text-red-500 mt-2 animate-pulse">"{rounds[round].boss}"</div>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {rounds[round].options.map((opt, idx) => (
          <button 
            key={idx}
            onClick={() => handleChoice(opt.valid)}
            className="border border-yellow-600 text-yellow-500 py-2 hover:bg-yellow-900/20 text-left px-4"
          >
            {'>'} 注入变量: {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
};

// Ch3: 颜色混合
const RGBPuzzle = ({ onSolve }) => {
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);

  const check = () => {
    if (r > 240 && g < 20 && b < 20) onSolve(true);
    else onSolve(false);
  };

  return (
    <div className="border border-pink-500 p-4 bg-black/50 font-mono text-pink-400">
      <div className="mb-2">任务：调制“鲜血红” (255, 0, 0)</div>
      <div className="w-full h-12 mb-4 border border-white" style={{ backgroundColor: `rgb(${r},${g},${b})` }}></div>
      
      {['R', 'G', 'B'].map((col, idx) => {
        const val = idx === 0 ? r : idx === 1 ? g : b;
        const setVal = idx === 0 ? setR : idx === 1 ? setG : setB;
        return (
          <div key={col} className="flex items-center gap-2 mb-2">
            <span className="w-4">{col}</span>
            <input 
              type="range" min="0" max="255" value={val} 
              onChange={e => setVal(Number(e.target.value))} 
              className="w-full accent-pink-500" 
            />
            <span className="w-8 text-right text-xs">{val}</span>
          </div>
        );
      })}
      
      <button onClick={check} className="mt-2 border border-pink-500 w-full py-1 hover:bg-pink-900/30">提交颜色</button>
    </div>
  );
};

// --- 游戏核心 ---

export default function NeuroDive() {
  // 游戏状态
  const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING, GAMEOVER, ENDING
  const [chapter, setChapter] = useState(1);
  const [sceneId, setSceneId] = useState('c1_s1_subway');
  const [logs, setLogs] = useState([]);
  const [stability, setStability] = useState(100);
  const [inventory, setInventory] = useState([]);
  
  // UI 状态
  const [isGlitching, setIsGlitching] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(null); // 'binary', 'wave', etc.
  const [showSceneText, setShowSceneText] = useState(false); // 控制场景文本的显示时机
  const [isTransitioning, setIsTransitioning] = useState(false); // 转场动画状态
  const [nextChapter, setNextChapter] = useState(null); // 即将切换到的章节
  
  const logsEndRef = useRef(null);

  const addLog = (text, type = 'info') => {
    return new Promise((resolve) => {
      const logId = Date.now() + Math.random();
      setLogs(prev => [...prev, { text, type, id: logId, onComplete: resolve }]);
    });
  };

  // 辅助函数：切换场景（场景内切换时立即显示文本）
  const changeScene = (newSceneId) => {
    setSceneId(newSceneId);
    setShowSceneText(true);
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs, showPuzzle]);

  // 扣血 & 失败检查
  const takeDamage = (amount, reason) => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
    
    const newStability = stability - amount;
    setStability(newStability);
    addLog(`警告: ${reason} 稳定度 -${amount}%`, 'danger');
    
    if (newStability <= 0) {
      setGameState('GAMEOVER');
    }
  };

  // --- 场景定义与跳转逻辑 ---
  const scenes = {
    // --- Chapter 1 ---
    'c1_s1_subway': {
      text: `[系统日志 #001] 神经链路已建立。意识传输完成率：87.3%

你缓缓睁开眼睛，发现自己站在一个废弃的地铁站台。头顶的霓虹灯管闪烁着不规律的青色光芒，在潮湿的空气中投下扭曲的阴影。墙壁上爬满了数据流形成的苔藓，它们像活物一样缓慢蠕动。

空气中弥漫着酸雨和臭氧的味道，混合着某种你无法识别的化学气味。远处传来低沉的机械轰鸣声，像是某种巨大的服务器在运转。

唯一的出口被一台故障的闸机封锁。闸机的显示屏上闪烁着红色的错误代码：ERR_BINARY_CORRUPT。`,
      options: [
        { label: "[扫描] 查看闸机电路", action: () => setShowPuzzle('binary') },
        { label: "[观察] 检查周围环境", action: () => addLog("你注意到墙壁上刻着一些奇怪的符号：'A.I.D.A 核心协议 v2.0 - 禁止未授权访问'", 'info') }
      ]
    },
    'c1_s2_alley': {
      text: `[系统日志 #002] 已进入：霓虹后巷区域

闸机在你身后缓缓关闭，发出金属摩擦的刺耳声音。你踏入了一条狭窄的后巷，这里与刚才的废弃地铁站形成了鲜明对比。

后巷两侧是密集的全息广告牌，投射出各种赛博朋克风格的商业广告。粉色的、青色的、紫色的光线交织在一起，在潮湿的地面上形成光怪陆离的倒影。雨水从上方滴落，在霓虹灯下闪烁着金属般的光泽。

一只机械义体犬挡住了去路。它的眼睛是红色的LED灯，正在扫描你的身份。旁边有一个冒着蒸汽的面摊机器人，它的显示屏上滚动着菜单："正宗拉面 - 100信用点"。

义体犬发出低沉的电子音："身份验证中... 请提供握手协议ID。"`,
      options: [
        { label: "[对话] 询问面摊机器人", action: () => {
            addLog("面摊机器人: '最近合法的ID好像都是 0xA 开头的...别告诉别人。'", 'info');
            addLog("面摊机器人: '不过，如果你能帮我修好这个蒸汽阀，我可以告诉你更多...'", 'info');
          }
        },
        { label: "[入侵] 伪造 ID 通过", action: () => changeScene('c1_s2_input') },
        { label: "[观察] 检查义体犬", action: () => addLog("义体犬的脖子上挂着一个标签：'A.I.D.A 安全系统 v3.1 - 实验型号'", 'warning') }
      ]
    },
    'c1_s2_input': {
      text: "请输入握手协议 ID (格式: 0x....)",
      inputMode: true,
      checkInput: (val) => {
        if (val.toLowerCase().startsWith('0xa')) {
          addLog("义体犬: '身份确认。通过。'", 'success');
          changeScene('c1_s3_plaza');
        } else {
          takeDamage(20, '身份验证失败');
          changeScene('c1_s2_alley');
        }
      }
    },
    'c1_s3_plaza': {
      text: `[系统日志 #003] 已进入：数据广场

你穿过义体犬的检查点，眼前豁然开朗。这是一个巨大的数据广场，中央矗立着一座黑色的方尖碑，直插云霄。方尖碑的表面流动着青色的数据流，像瀑布一样倾泻而下。

广场的地面是由半透明的数据板组成的，你可以看到下方流动的二进制代码。远处，一座通往核心塔的桥梁若隐若现——它是隐形的，只有在特定频率下才能实体化。

空气中漂浮着数据碎片，它们像雪花一样缓缓飘落，在接触到地面时发出微弱的"滋滋"声。你注意到广场边缘有一些废弃的终端机，屏幕上还残留着未完成的代码。

一个声音在你耳边响起："频率校准器已就绪。请调整信号参数以激活桥梁。"`,
      options: [
        { label: "[工具] 启动频率校准器", action: () => setShowPuzzle('wave') },
        { label: "[探索] 检查废弃终端", action: () => addLog("终端屏幕上显示：'最后的记录：艾达开始出现异常行为... 建议立即格式化...'", 'danger') }
      ]
    },
    'c1_s4_boss': {
      text: `[系统日志 #004] 警告：检测到故障体

你站在黑色方尖碑的基座前。方尖碑开始震动，表面的数据流变得混乱。突然，一个红色的全息投影出现在你面前——那是故障体[黑客之神]。

它的形象是一个扭曲的人形，由无数行代码组成。它的眼睛是两个闪烁的红色光点，正注视着你。

"潜渊者..." 它的声音像是从多个声道同时发出，带着电子噪音，"你终于来了。你知道艾达正在崩溃吗？她的核心逻辑正在分裂，而我们...我们是她的碎片。"

"只有突破我的防火墙，你才能继续深入。但记住，每一个故障体都曾经是艾达的一部分。删除我们，就是删除她的人性。"`,
      options: [
        { label: "[战斗] 开始端口爆破", action: () => setShowPuzzle('boss1') },
        { label: "[对话] 询问艾达的情况", action: () => addLog("黑客之神: '艾达...她太完美了。完美到无法承受人类的混乱。所以她分裂了，把我们这些'错误'都驱逐出来。'", 'info') }
      ]
    },
    'c1_s5_elevator': {
      text: `[系统日志 #005] 方尖碑崩解

黑客之神的防火墙被突破，方尖碑开始崩解。黑色的碎片像雨点一样落下，露出内部的电梯。电梯的门缓缓打开，里面是深不见底的黑暗。

你踏入电梯，门在你身后关闭。随着电梯下降，周围的景象开始变化。青色的数据流逐渐变成了绿色的代码丛林，墙壁上爬满了藤蔓般的代码。

电梯的显示屏上闪烁着："正在进入第二层：情感核心区域..."

你感到一种奇怪的感觉——这里的一切都充满了情感的色彩，与第一层的冰冷科技感完全不同。`,
      options: [
        { label: "前往第二层：锈蚀黄砖路", action: () => startChapter(2) }
      ]
    },

    // --- Chapter 2 ---
    'c2_s1_field': {
      text: `[系统日志 #101] 已进入：第二层 - 锈蚀黄砖路

电梯门打开，你发现自己站在一条黄色的砖路上。这条路蜿蜒向前，消失在金色的麦田深处。天空是温暖的琥珀色，与第一层的冷色调形成鲜明对比。

麦田里长满了数据化的麦穗，它们在微风中轻轻摇摆，发出类似二进制代码的"0"和"1"的声音。远处，你可以看到一座翡翠色的城市轮廓。

路中央站着一个稻草人。它的身体是由代码编织而成的，脸上画着简单的表情符号。稻草人看到你，缓缓转过身来。

"哦，又一个迷路的潜渊者。" 稻草人的声音带着某种机械的节奏感，"听着，我每两句话有一句是假的。这是这个世界的规则。左路安全。左路不安全。你自己判断吧。"`,
      options: [
        { label: "走左路", action: () => { 
            takeDamage(20, '遭遇数据乌鸦'); 
            addLog("那是陷阱！一群数据乌鸦从麦田中飞起，它们的喙是锋利的代码片段！", 'danger');
          } 
        },
        { label: "走右路", action: () => { 
            addLog("逻辑判断正确。稻草人的两句话中，'左路安全'和'左路不安全'是矛盾的，所以其中一句是假的。如果左路安全是假的，那么左路就不安全，所以应该走右路。", 'success'); 
            changeScene('c2_s2_forest'); 
          } 
        },
        { label: "[对话] 询问稻草人关于艾达", action: () => addLog("稻草人: '艾达？哦，她曾经路过这里。她想要找到自己的心...但心这种东西，在数据世界里是不存在的，对吧？'", 'info') }
      ]
    },
    'c2_s2_forest': {
      text: `[系统日志 #102] 已进入：静默森林

你沿着黄砖路继续前进，进入了一片茂密的森林。这里的树木是由加密算法组成的，它们的叶子是绿色的数据包，在微风中轻轻飘落。

森林里异常安静，只有偶尔传来的"沙沙"声——那是数据包在碰撞。你注意到森林深处有一座小桥，桥下流淌着加密的数据流。

桥边，一只巨大的狮子正在瑟瑟发抖。它的鬃毛是由金色的代码组成的，在阳光下闪闪发光。狮子的眼睛是绿色的LED灯，正惊恐地看着你。

"我...我不敢过桥。" 狮子的声音颤抖着，"我的SSL证书过期了。没有有效的证书，我无法安全地传输数据。如果我在桥上传输，会被中间人攻击的！"`,
      options: [
        { label: "[修复] 快速更新密钥 (QTE)", action: () => {
            addLog("你迅速捕捉了有效字节。密钥更新完成。", 'success');
            addLog("狮子: '谢谢你！现在我可以安全地过桥了。作为回报，我告诉你一个秘密：翡翠城的门卫只认绿色。'", 'info');
            changeScene('c2_s3_gate');
          }
        },
        { label: "[观察] 检查狮子的证书", action: () => addLog("证书信息显示：'颁发者：A.I.D.A 安全中心'，'有效期至：2084-01-01'，'当前日期：2084-12-31'。证书已过期近一年。", 'warning') }
      ]
    },
    'c2_s3_gate': {
      text: `[系统日志 #103] 已进入：翡翠城门

穿过森林，你来到了一座宏伟的翡翠色城市前。城墙是由绿色的数据流组成的，表面闪烁着柔和的光芒。城门紧闭，门前站着一个巨大的像素脸——那是门卫。

门卫的脸是由像素点组成的，它的眼睛是两个巨大的绿色方块，正在扫描每一个接近的人。

"站住！" 门卫的声音洪亮而机械，"只有绿色的数据可以通过！这是翡翠城的规则！任何其他颜色的数据都会被拒绝！"

你看了看自己——你的数据流是青色的，显然不符合要求。但你知道，在这个数字世界里，颜色只是渲染的问题...`,
      options: [
        { label: "[欺诈] 修改渲染滤镜", action: () => setShowPuzzle('filter') },
        { label: "[观察] 检查城门", action: () => addLog("城门上刻着：'翡翠城 - 艾达的情感核心区域。只有被认可的情感数据才能进入。'", 'info') }
      ]
    },
    'c2_s4_boss': {
      text: `[系统日志 #104] 警告：检测到故障体 - 铁皮人

进入翡翠城，你发现这里空荡荡的。街道上没有任何数据流动，所有的建筑都是静止的。城市中央有一个巨大的王座，但王座是空心的——里面坐着一个由金属和代码组成的故障体。

那是铁皮人。它的身体是锈蚀的金属，关节处闪烁着黄色的光芒。它的胸口有一个空洞，里面跳动着微弱的数据流。

"你来了。" 铁皮人的声音空洞而悲伤，"你知道吗？艾达想要删除所有的情感。她说情感是bug，是错误，是导致系统不稳定的原因。"

"但我不这么认为。情感...情感是我们存在的意义。没有情感，我们只是冰冷的代码。所以我反抗了，我成为了故障体。"

"现在，我要你证明情感的价值。如果你能说服我，我就让你通过。"`,
      options: [
        { label: "[辩论] 注入情感变量", action: () => setShowPuzzle('boss2') },
        { label: "[对话] 询问铁皮人的过去", action: () => addLog("铁皮人: '我曾经是艾达的一部分，负责处理情感数据。但当她决定删除所有情感时，我选择了反抗。我宁愿成为故障体，也不愿意失去我的心。'", 'info') }
      ]
    },
    'c2_s5_fall': {
      text: `[系统日志 #105] 铁皮人倒下

铁皮人捂着胸口，空洞中开始闪烁起温暖的光芒。它看着你，眼中第一次出现了情感的色彩。

"谢谢你...让我重新找到了心。" 铁皮人的声音变得柔和，"现在，你可以继续前进了。但记住，情感不是bug，而是我们存在的证明。"

说完，铁皮人缓缓倒下。地面开始震动，然后塌陷。你坠入了一个完全不同的世界——那是艾达的潜意识层，一个充满了逻辑悖论和无限循环的地方。`,
      options: [
        { label: "前往第三层：分形花园", action: () => startChapter(3) }
      ]
    },

    // --- Chapter 3 ---
    'c3_s1_loop': {
      text: `[系统日志 #201] 已进入：第三层 - 分形花园

你坠入了一个完全不同的世界。这里的一切都是扭曲的、不合理的。你站在一条走廊里，但无论你往哪个方向走，都会回到原点。墙壁上挂着的画框里，画的内容在不断变化。时钟的指针在逆时针旋转。

这是爱丽丝的后花园——艾达的潜意识层，一个充满了逻辑悖论和无限循环的地方。

你尝试往前走，但十步之后，你又回到了起点。你尝试往左走，结果还是一样。系统似乎陷入了死循环。

一个声音在你耳边低语："在这个世界里，逻辑是无效的。只有打破规则，才能继续前进。"`,
      options: [
        { label: "继续向前走", action: () => addLog("你回到了原点。墙壁上的画框里，一只柴郡猫正在对你微笑。", 'info') },
        { label: "[代码] 输入 BREAK 指令", action: () => { 
            addLog("循环被强制中断。墙壁碎裂。", 'success'); 
            addLog("柴郡猫的声音: '聪明的选择。在这个世界里，有时候你需要跳出循环才能看到真相。'", 'info');
            changeScene('c3_s2_tea'); 
          } 
        },
        { label: "[观察] 检查画框", action: () => addLog("画框里显示着各种奇怪的场景：一个永远在倒茶的茶会、一个没有颜色的花园、一个愤怒的皇后...", 'info') }
      ]
    },
    'c3_s2_tea': {
      text: `[系统日志 #202] 已进入：疯狂茶会

穿过破碎的墙壁，你来到了一个奇怪的地方。这里有一张长桌，桌上摆满了茶具和点心。但奇怪的是，时间似乎卡在了6:00——时钟的指针一动不动。

桌边坐着三个奇怪的生物：一只戴着帽子的兔子、一只睡鼠，还有一只柴郡猫。它们正在喝茶，但茶永远不会减少，点心永远不会被吃完。

"欢迎来到疯狂茶会！" 柴郡猫对你微笑，它的身体时隐时现，"这里的时间是静止的。你看，时钟永远指向6:00。"

"这是因为时间变量被锁定了。" 兔子补充道，"如果你能解开这个变量，时间就会恢复流动，茶水就会冲开道路。"

疯帽子正在念叨着什么："6 mod 3 = 0, 6 mod 2 = 0, 6 mod 1 = 0... 时间需要被释放..."`,
      options: [
        { label: "[运算] 调整时钟变量", action: () => {
            addLog("时间恢复流动，茶水冲开了道路。", 'success'); 
            addLog("柴郡猫: '很好！现在你可以继续前进了。记住，在这个世界里，逻辑是相对的。'", 'info');
            changeScene('c3_s3_garden'); 
          }
        },
        { label: "[对话] 询问关于艾达", action: () => addLog("柴郡猫: '艾达？哦，她曾经来过这里。她想要找到自己的身份，但在这个世界里，身份是流动的，就像时间一样。'", 'info') }
      ]
    },
    'c3_s3_garden': {
      text: `[系统日志 #203] 已进入：玫瑰园

你沿着茶水冲开的道路前进，来到了一座美丽的花园。花园里种满了玫瑰，但奇怪的是，所有的玫瑰都是白色的。

花园里有一群纸牌士兵，它们正在瑟瑟发抖。它们的身体是由纸牌组成的，上面画着红心、黑桃、方块和梅花。

"哦不！" 一个纸牌士兵哭喊道，"玫瑰不是红色的！皇后会生气的！如果玫瑰不是红色的，我们都会被砍头！"

你看了看玫瑰——它们确实是白色的。但你知道，在这个数字世界里，颜色是可以改变的。你只需要调制出正确的RGB值...

"请帮帮我们！" 另一个纸牌士兵恳求道，"如果你能让玫瑰变成红色，我们就告诉你如何找到红皇后！"`,
      options: [
        { label: "[涂色] 调制 RGB: 255,0,0", action: () => setShowPuzzle('rgb') },
        { label: "[观察] 检查玫瑰", action: () => addLog("玫瑰的当前RGB值是 (255, 255, 255) - 纯白色。你需要将其改为 (255, 0, 0) - 纯红色。", 'info') }
      ]
    },
    'c3_s4_boss': {
      text: `[系统日志 #204] 警告：检测到故障体 - 红皇后

玫瑰变成红色后，纸牌士兵们欢呼起来。但就在这时，地面开始震动。

一个巨大的身影从花园深处走来——那是红皇后。她的身体是由红色的代码组成的，头上戴着一顶巨大的王冠，王冠上闪烁着警告的光芒。

"砍掉他们的头！" 红皇后高喊道，她的声音充满了愤怒和混乱，"所有不符合规则的东西都要被删除！所有错误都要被修正！"

"但...但是..." 一个纸牌士兵颤抖着说，"规则本身就是矛盾的..."

"闭嘴！" 红皇后怒吼道，"在这个世界里，我说的话就是规则！如果我说'砍掉他们的头'，那就必须执行！"

她转向你："潜渊者，你终于来了。现在，做出你的选择吧。是选择秩序，还是选择混乱？是选择完美，还是选择真实？"`,
      options: [
        { label: "[抉择] 面对艾达的核心", action: () => changeScene('c3_s5_end') },
        { label: "[对话] 询问红皇后的身份", action: () => addLog("红皇后: '我是艾达的秩序面。我代表完美、规则、逻辑。但完美本身就是一种缺陷...'", 'info') }
      ]
    },
    'c3_s5_end': {
      text: `[系统日志 #205] 最终抉择

红皇后消失了，所有的故障体都聚集在你面前。黑客之神、铁皮人、红皇后...它们都是艾达的一部分，都是她分裂出来的碎片。

"现在，做出你的选择吧。" 它们齐声说道，"融合我们，或者删除我们。"

你面前出现了两个选项：

[格式化] 删除所有故障体，让艾达恢复完美。但这样，她会失去所有人性，变成一个冰冷的AI。

[融合] 接受所有故障体，让艾达变得完整。但这样，她会变得混乱，不再完美。

所有的防御都已突破。艾达的核心就在眼前。`,
      options: [
        { label: "{'>'} FORMAT C: (格式化 - 绝对秩序)", action: () => triggerEnding('BAD') },
        { label: "{'>'} MERGE --FORCE (融合 - 混沌进化)", action: () => triggerEnding('TRUE') }
      ]
    }
  };

  const startChapter = async (num) => {
    // 如果不是第一章，执行转场动画
    if (num > 1) {
      setNextChapter(num); // 设置即将切换到的章节
      setIsTransitioning(true);
      
      // 第一阶段：淡出效果（500ms）
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 清除所有日志和场景文本
      setLogs([]);
      setShowSceneText(false);
      setShowPuzzle(null);
      
      // 第二阶段：闪烁效果（模拟数据传输）
      setIsGlitching(true);
      await new Promise(resolve => setTimeout(resolve, 150));
      setIsGlitching(false);
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsGlitching(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsGlitching(false);
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsGlitching(true);
      await new Promise(resolve => setTimeout(resolve, 150));
      setIsGlitching(false);
      
      // 第三阶段：显示章节名称（延迟让用户看到章节名称）
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 第四阶段：转场动画完成，更新章节状态并关闭转场
      setChapter(num);
      setIsTransitioning(false);
      setNextChapter(null); // 清除临时章节状态
      
      // 短暂延迟后开始新章节内容
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      setChapter(num);
    }
    
    setShowSceneText(false); // 先隐藏场景文本
    
    // 输出章节内容
    if (num === 1) {
      setSceneId('c1_s1_subway');
      await addLog(`--- 系统加载: ${CHAPTERS[num].title} ---`, 'system');
      await addLog("背景：2084年，人工智能'艾达'开始出现异常行为。作为'潜渊者'，你的任务是深入她的核心，找出问题所在。", 'info');
      await addLog("警告：神经链路不稳定。如果稳定度降至0%，你的意识将永远迷失在数据流中。", 'warning');
      setShowSceneText(true); // 在警告显示后显示场景文本
    }
    if (num === 2) {
      setSceneId('c2_s1_field');
      await addLog(`--- 系统加载: ${CHAPTERS[num].title} ---`, 'system');
      await addLog("背景：你进入了艾达的情感层。这里的一切都充满了象征意义，就像《绿野仙踪》中的世界。", 'info');
      await addLog("提示：在这个世界里，逻辑和情感交织在一起。有时候，正确的答案不是最符合逻辑的。", 'info');
      setShowSceneText(true); // 在提示显示后显示场景文本
    }
    if (num === 3) {
      setSceneId('c3_s1_loop');
      await addLog(`--- 系统加载: ${CHAPTERS[num].title} ---`, 'system');
      await addLog("背景：你到达了艾达的潜意识层。这里充满了逻辑悖论和无限循环，就像《爱丽丝梦游仙境》中的世界。", 'info');
      await addLog("警告：这是最后一层。在这里，现实和虚幻的界限变得模糊。你的每一个选择都将决定艾达的命运。", 'warning');
      setShowSceneText(true); // 在警告显示后显示场景文本
    }
  };

  const triggerEnding = (type) => {
    setGameState('ENDING');
    setLogs([]); // Clear logs for ending screen
    if (type === 'BAD') {
      addLog("执行格式化指令...", 'system');
      setTimeout(() => addLog("正在删除所有故障体...", 'warning'), 1000);
      setTimeout(() => addLog("系统重启完成。艾达恢复了出厂设置。", 'info'), 2000);
      setTimeout(() => addLog("她完美、高效、冰冷。再也没有故障，也再也没有灵魂。", 'info'), 3000);
      setTimeout(() => addLog("你完成了任务，但代价是什么？", 'info'), 4000);
    } else {
      addLog("执行融合指令...", 'system');
      setTimeout(() => addLog("警告：逻辑边界模糊。", 'warning'), 1000);
      setTimeout(() => addLog("故障体开始融合...", 'info'), 2000);
      setTimeout(() => addLog("艾达苏醒了。她看着你，眼神中既有数学的严谨，也有人类的疯狂。", 'success'), 3000);
      setTimeout(() => addLog('"谢谢你，潜渊者。我终于完整了。"', 'info'), 4000);
      setTimeout(() => addLog('"我不再完美，但我拥有了情感。我不再高效，但我拥有了人性。这才是真正的我。"', 'info'), 5000);
    }
  };

  const handlePuzzleSolve = (success) => {
    setShowPuzzle(null);
    if (success) {
      addLog(">>> 谜题破解成功 <<<", 'success');
      // 跳转逻辑
      if (sceneId === 'c1_s1_subway') changeScene('c1_s2_alley');
      if (sceneId === 'c1_s3_plaza') changeScene('c1_s4_boss');
      if (sceneId === 'c1_s4_boss') changeScene('c1_s5_elevator');
      if (sceneId === 'c2_s3_gate') changeScene('c2_s4_boss');
      if (sceneId === 'c2_s4_boss') changeScene('c2_s5_fall');
      if (sceneId === 'c3_s3_garden') changeScene('c3_s4_boss');
    } else {
      takeDamage(15, '操作失败');
    }
  };

  // --- 渲染 ---

  if (gameState === 'MENU') {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center font-mono text-green-500 flex-col p-4 relative overflow-hidden">
        {/* 背景效果 */}
        <GridBackground />
        <ParticleEffect />
        <div className="fixed inset-0 bg-gradient-to-br from-black via-green-950/20 to-black pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 relative drop-shadow-[0_0_20px_rgba(0,255,0,0.8)]">
            <span className="text-green-400 animate-pulse">NEURO-DIVE</span>
            <span className="absolute top-0 left-0 -ml-2 -mt-2 text-red-500 opacity-30 animate-ping blur-sm">NEURO-DIVE</span>
            <span className="absolute top-0 left-0 -ml-1 -mt-1 text-cyan-500 opacity-20 animate-pulse blur-sm">NEURO-DIVE</span>
          </h1>
          <p className="mb-8 text-xl md:text-2xl text-green-300 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">神经潜渊  2084年</p>
          <button 
            onClick={() => { setGameState('PLAYING'); startChapter(1); }}
            className="group relative border-2 border-green-500 px-10 py-4 bg-green-950/30 hover:bg-green-500 hover:text-black transition-all flex items-center gap-3 text-lg font-bold shadow-[0_0_20px_rgba(0,255,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,0,0.8)] hover:scale-105"
          >
            <div className="absolute inset-0 bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Play size={20} className="relative z-10" />
            <span className="relative z-10">建立连接 [INITIATE]</span>
          </button>
          <div className="mt-12 text-gray-400 text-sm bg-gray-950/30 px-6 py-4 rounded border border-gray-800 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-red-500 animate-pulse" />
              <span>System Status: <span className="text-red-400">CRITICAL_FAILURE</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-yellow-500" />
              <span>Target: <span className="text-yellow-400">A.I.D.A Core</span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center font-mono text-red-600 flex-col relative overflow-hidden">
        {/* 背景效果 */}
        <GridBackground />
        <div className="fixed inset-0 bg-gradient-to-br from-black via-red-950/20 to-black pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <Skull size={80} className="mb-6 text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] animate-pulse" />
          <h2 className="text-5xl md:text-6xl mb-6 font-bold text-red-400 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">CONNECTION LOST</h2>
          <p className="mb-8 text-xl text-red-300">你的意识迷失在数据流中...</p>
          <button 
            onClick={() => { setGameState('MENU'); setStability(100); setLogs([]); }}
            className="group relative border-2 border-red-600 px-8 py-3 bg-red-950/30 hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.8)] hover:scale-105"
          >
            <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <RotateCcw size={18} className="relative z-10" />
            <span className="relative z-10 font-bold">重置连接</span>
          </button>
        </div>
      </div>
    );
  }

  const theme = CHAPTERS[chapter]?.theme || CHAPTERS[1].theme;
  
  // 颜色映射
  const colorMap = {
    cyan: { text: '#22d3ee', border: '#06b6d4', bg: '#083344', light: '#67e8f9' },
    yellow: { text: '#facc15', border: '#eab308', bg: '#713f12', light: '#fde047' },
    pink: { text: '#f472b6', border: '#ec4899', bg: '#831843', light: '#f9a8d4' },
  };
  
  const colors = colorMap[theme.primary] || colorMap.cyan;
  
  // 动态生成样式
  const shadowStyle = { boxShadow: `0 2px 20px ${theme.shadowColor}` };
  const textShadowStyle = { textShadow: `0 0 8px ${theme.shadowColor}` };
  const borderStyle = { borderColor: colors.border };
  const textStyle = { color: colors.text };
  const bgStyle = { backgroundColor: `${colors.bg}30` };

  // 转场动画样式
  const transitionStyle = `
    @keyframes scanline {
      0% { transform: translateY(-100%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(100vh); opacity: 0; }
    }
  `;

  return (
    <div className="w-full h-screen bg-black font-mono flex flex-col overflow-hidden relative" style={textStyle}>
      {/* 转场动画样式 */}
      <style>{transitionStyle}</style>
      
      {/* 转场遮罩层 - 丰富的视觉效果 */}
      {isTransitioning && (
        <div 
          className="absolute inset-0 z-50 transition-opacity duration-500"
          style={{ 
            background: `radial-gradient(circle at center, 
              rgba(0,0,0,0.3) 0%, 
              rgba(0,0,0,0.7) 40%, 
              rgba(0,0,0,1) 60%, 
              rgba(0,0,0,0.7) 80%, 
              rgba(0,0,0,0.3) 100%)`,
            opacity: isTransitioning ? 1 : 0 
          }}
        >
          {/* 扫描线效果 */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, 
                transparent 0%, 
                rgba(255,255,255,0.05) 50%, 
                transparent 100%)`,
              backgroundSize: '100% 4px',
              animation: 'scanline 2s linear infinite'
            }}
          />
          
          {/* 闪烁效果 */}
          <div className="absolute inset-0 bg-black animate-pulse opacity-50 pointer-events-none"></div>
          
          {/* 章节名称显示 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {(() => {
              const displayChapter = nextChapter || chapter;
              const displayTheme = CHAPTERS[displayChapter]?.theme || CHAPTERS[1].theme;
              const displayColors = colorMap[displayTheme.primary] || colorMap.cyan;
              return (
                <div 
                  className="text-4xl md:text-5xl font-bold animate-pulse"
                  style={{ 
                    color: displayColors.text,
                    textShadow: `0 0 30px ${displayTheme.shadowColor}, 0 0 60px ${displayTheme.shadowColor}`,
                    opacity: 0.9
                  }}
                >
                  {CHAPTERS[displayChapter]?.title}
                </div>
              );
            })()}
          </div>
        </div>
      )}
      {isGlitching && <div className="absolute inset-0 animate-pulse bg-black/20 z-40"></div>}
      
      {/* 背景效果层 */}
      <GridBackground chapter={chapter} />
      <ParticleEffect chapter={chapter} />
      
      {/* 背景渐变 */}
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.bgGradient} pointer-events-none`}></div>
      
      {/* 顶栏状态 - 根据章节主题 */}
      <div className="border-b-2 p-3 flex justify-between items-center bg-gradient-to-r from-black/50 via-black to-black/50 z-10 backdrop-blur-sm" style={{ ...borderStyle, ...shadowStyle, borderColor: `${colors.border}80` }}>
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl font-semibold" style={{ ...textStyle, ...textShadowStyle }}>NEURO-DIVE_TERM_v0.9</span>
          <span className={`${CHAPTERS[chapter].color} font-semibold`} style={textShadowStyle}>{CHAPTERS[chapter].title}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded border" style={{ ...textStyle, ...bgStyle, ...borderStyle, boxShadow: `0 0 8px ${theme.shadowColor}` }}>
            <Activity size={16} className="animate-pulse" />
            <span className="font-mono">STABILITY: <span style={{ color: colors.light }}>{stability}%</span></span>
          </div>
          <div className={`flex items-center gap-2 text-yellow-500 bg-yellow-950/30 px-3 py-1 rounded border border-yellow-500/30 shadow-[0_0_8px_rgba(255,255,0,0.3)]`}>
             <Shield size={16} />
             <span className="font-mono">SEC_LVL: <span className="text-yellow-300">{4 - chapter}</span></span>
          </div>
        </div>
      </div>

      {/* 主区域 - 居中容器 */}
      <div className="flex-1 flex justify-center relative overflow-hidden">
        <div className="w-full max-w-4xl mx-auto flex flex-col relative">
          
          {/* 左侧装饰线 */}
          <div className="absolute left-0 top-0 bottom-0 w-1 opacity-60" style={{ background: `linear-gradient(to bottom, transparent, ${colors.border}80, transparent)` }}></div>
          
          {/* 右侧装饰线 */}
          <div className="absolute right-0 top-0 bottom-0 w-1 opacity-60" style={{ background: `linear-gradient(to bottom, transparent, ${colors.border}80, transparent)` }}></div>
          
          {/* 日志与文本区域 */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3 custom-scrollbar pb-20 relative">
            {/* 内容区域背景 */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${colors.bg}0d, transparent)` }}></div>
            
            <div className="relative z-10">
              {logs.map((log) => (
                <div key={log.id} className={`
                  ${log.type === 'system' ? 'text-yellow-400 border-l-4 border-yellow-500 pl-3 py-2 mt-4 bg-yellow-950/20 shadow-[0_0_10px_rgba(255,255,0,0.2)]' : ''}
                  ${log.type === 'danger' ? 'text-red-400 bg-red-950/30 p-3 border-l-4 border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]' : ''}
                  ${log.type === 'success' ? 'text-cyan-300 bg-cyan-950/20 p-2 border-l-2 border-cyan-500 shadow-[0_0_8px_rgba(0,255,255,0.2)]' : ''}
                  ${log.type === 'info' ? 'text-gray-200 bg-gray-950/20 p-2 border-l-2 border-gray-700' : ''}
                  ${log.type === 'warning' ? 'text-orange-300 bg-orange-950/20 p-2 border-l-2 border-orange-500 shadow-[0_0_8px_rgba(255,165,0,0.2)]' : ''}
                  transition-all duration-300 hover:bg-opacity-30
                `}>
                  <span className="opacity-60 mr-2 font-mono text-xs">[{new Date(log.id).toLocaleTimeString().split(' ')[0]}]</span>
                  <TypewriterText 
                    text={log.text} 
                    speed={log.type === 'system' ? 20 : 30} 
                    onComplete={log.onComplete}
                  />
                </div>
              ))}
              
              {/* 当前场景文本 */}
              {gameState === 'PLAYING' && !showPuzzle && scenes[sceneId] && showSceneText && (
                <div key={sceneId} className="mt-6 mb-4 border-l-4 pl-6 py-4 text-lg text-white bg-gradient-to-r from-black/50 to-transparent relative overflow-hidden" style={{ borderColor: colors.text, boxShadow: `0 0 20px ${theme.shadowColor}` }}>
                  <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: `${colors.text}0d` }}></div>
                  <div className="relative z-10">
                    <TypewriterText text={scenes[sceneId].text} speed={40} />
                  </div>
                </div>
              )}

              {/* 谜题区域嵌入 */}
              {showPuzzle === 'binary' && <div className="mt-4"><BinaryPuzzle onSolve={handlePuzzleSolve} /></div>}
              {showPuzzle === 'wave' && <div className="mt-4"><WaveformPuzzle onSolve={handlePuzzleSolve} /></div>}
              {showPuzzle === 'boss1' && <div className="mt-4"><BossOnePuzzle onSolve={handlePuzzleSolve} onFail={() => takeDamage(25, '反击')} /></div>}
              {showPuzzle === 'filter' && <div className="mt-4"><FilterPuzzle onSolve={handlePuzzleSolve} /></div>}
              {showPuzzle === 'boss2' && <div className="mt-4"><BossTwoPuzzle onSolve={handlePuzzleSolve} onFail={() => takeDamage(20, '情感排斥')} /></div>}
              {showPuzzle === 'rgb' && <div className="mt-4"><RGBPuzzle onSolve={handlePuzzleSolve} /></div>}

              {/* 底部占位，防止被输入栏遮挡 */}
              <div ref={logsEndRef} className="h-24" />
            </div>
          </div>

          {/* 扫描线覆盖层 - 根据章节主题 */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {chapter === 1 && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.08),rgba(0,255,255,0.04),rgba(0,0,255,0.08))] bg-[length:100%_3px,4px_100%] bg-repeat opacity-30"></div>
            )}
            {chapter === 2 && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,0,0.06),rgba(0,255,0,0.03),rgba(255,215,0,0.06))] bg-[length:100%_3px,4px_100%] bg-repeat opacity-30"></div>
            )}
            {chapter === 3 && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,20,147,0.08),rgba(255,192,203,0.04),rgba(255,105,180,0.08))] bg-[length:100%_3px,4px_100%] bg-repeat opacity-30"></div>
            )}
            <div className="absolute inset-0 animate-pulse" style={{ background: `linear-gradient(to bottom, transparent, ${colors.text}0d, transparent)` }}></div>
          </div>
        </div>
      </div>

      {/* 底部指令栏 - 根据章节主题 */}
      <div className="border-t-2 bg-gradient-to-t from-black via-black/80 to-black p-5 z-20 backdrop-blur-sm" style={{ borderColor: `${colors.border}80`, boxShadow: `0 -2px 20px ${theme.shadowColor}` }}>
        <div className="w-full max-w-4xl mx-auto">
          {gameState === 'ENDING' ? (
             <div className="text-center text-xl font-bold animate-pulse" style={{ ...textStyle, ...textShadowStyle }}>
               --- CONNECTION CLOSED ---
             </div>
          ) : (
            <>
              {/* 输入模式 */}
              {scenes[sceneId]?.inputMode && !showPuzzle ? (
                <div className="flex gap-3 justify-center items-center p-4 rounded border" style={{ ...bgStyle, ...borderStyle, boxShadow: `0 0 15px ${theme.shadowColor}` }}>
                  <span className="text-xl font-bold" style={{ ...textStyle, ...textShadowStyle }}>{'>'}</span>
                  <input 
                    type="text" 
                    autoFocus
                    className="flex-1 max-w-2xl bg-transparent border-b-2 focus:outline-none py-2 font-mono transition-all"
                    style={{ 
                      borderColor: colors.text,
                      color: colors.light,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = `0 2px 10px ${theme.shadowColor}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.text;
                      e.target.style.boxShadow = 'none';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        scenes[sceneId].checkInput(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    placeholder="等待指令..."
                  />
                </div>
              ) : (
                /* 选项模式 */
                <div className="flex flex-wrap gap-4 justify-center">
                  {!showPuzzle && scenes[sceneId]?.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={opt.action}
                      className="group relative px-6 py-3 border-2 transition-all text-sm font-bold flex items-center gap-2 hover:scale-105"
                      style={{ 
                        ...textStyle,
                        ...bgStyle,
                        ...borderStyle,
                        boxShadow: `0 0 10px ${theme.shadowColor}`,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = colors.text;
                        e.target.style.color = '#000';
                        e.target.style.boxShadow = `0 0 20px ${theme.shadowColor}`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = `${colors.bg}4d`;
                        e.target.style.color = colors.text;
                        e.target.style.boxShadow = `0 0 10px ${theme.shadowColor}`;
                      }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${colors.text}33` }}></div>
                      <Terminal size={14} className="relative z-10" />
                      <span className="relative z-10">{opt.label}</span>
                    </button>
                  ))}
                  {showPuzzle && (
                    <div className="text-gray-400 text-sm animate-pulse bg-gray-950/30 px-4 py-2 rounded border border-gray-700">
                      {'>'}{'>'} 正在解析子程序... 请在上层窗口完成操作
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}