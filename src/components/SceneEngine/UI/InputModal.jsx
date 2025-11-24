import React, { useState, useRef, useEffect } from 'react';

export default function InputModal({ placeholder, checkInput }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = () => {
    if (!input.trim()) return;
    if (checkInput) {
      checkInput(input.trim());
    }
    setInput('');
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <div className="border-2 border-cyan-500 bg-black/40 rounded-lg p-6 font-mono text-cyan-300 shadow-[0_0_25px_rgba(0,255,255,0.35)] space-y-4">
      <div className="text-lg font-bold tracking-wide border-b border-cyan-500/40 pb-3">
        握手协议验证
      </div>
      <label className="block text-sm">
        {placeholder || '请输入'}
      </label>
      <div className="flex gap-3 items-center">
        <span className="text-cyan-400 font-bold text-xl">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-black/60 border-2 border-cyan-500 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
          placeholder="输入..."
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="px-6 py-2 border-2 border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500 hover:text-black transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          提交
        </button>
      </div>
    </div>
  );
}

