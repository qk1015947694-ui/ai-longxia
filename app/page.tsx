'use client';

import { useState, useEffect } from 'react';
import QuantumEffect from './components/QuantumEffect';
import HandTracker from './components/HandTracker';

export default function Home() {
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [isUsingHand, setIsUsingHand] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHandPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    // 3秒后隐藏欢迎信息
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 3秒后隐藏欢迎信息
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleHandMove = (x: number, y: number) => {
    setIsUsingHand(true);
    setHandPosition({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isUsingHand) {
      setHandPosition({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 relative overflow-hidden">
      {/* 量子动效背景 */}
      <QuantumEffect targetX={handPosition.x} targetY={handPosition.y} />

      {/* 手势追踪 */}
      <HandTracker onHandMove={handleHandMove} />

      {/* 鼠标事件监听 */}
      <div
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
        onClick={() => setIsUsingHand(false)}
      />

      {/* 欢迎信息 */}
      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="text-center animate-pulse">
            <h1 className="text-6xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
              🏮 量子动效 🏮
            </h1>
            <p className="text-xl text-red-300">
              移动鼠标或使用手势控制
            </p>
            <p className="text-lg text-yellow-200 mt-2">
              ✨ 春节快乐 ✨
            </p>
          </div>
        </div>
      )}

      {/* 标题 */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
          量子动效
        </h1>
        <p className="text-xl text-yellow-200 mt-2 drop-shadow-lg">
          手势控制 · 春节中国风
        </p>
      </div>

      {/* 控制说明 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 text-center">
        <div className="bg-black/60 backdrop-blur-md border-2 border-yellow-500/50 rounded-xl px-8 py-4 shadow-2xl">
          <p className="text-yellow-300 text-lg mb-2 font-bold">
            🎯 控制方式
          </p>
          <p className="text-white text-sm">
            {isUsingHand ? (
              <span className="text-green-400">✅ 手势追踪中 - 移动手部控制</span>
            ) : (
              <span>移动鼠标控制 · 点击切换到手势模式</span>
            )}
          </p>
        </div>
      </div>

      {/* 装饰元素 - 春节灯笼 */}
      <div className="fixed top-4 left-4 z-10 animate-bounce">
        <div className="text-6xl">🏮</div>
      </div>
      <div className="fixed top-4 right-4 z-10 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <div className="text-6xl">🧧</div>
      </div>

      {/* 底部装饰 */}
      <div className="fixed bottom-4 left-4 z-10">
        <div className="text-4xl">🎊</div>
      </div>
      <div className="fixed bottom-4 right-4 z-10">
        <div className="text-4xl">🎇</div>
      </div>

      {/* 位置指示器 */}
      <div
        className="fixed z-10 pointer-events-none"
        style={{
          left: handPosition.x,
          top: handPosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          {/* 外圈 */}
          <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75" />
          {/* 主圈 */}
          <div className="relative w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full border-4 border-yellow-300 shadow-2xl flex items-center justify-center">
            <div className="text-2xl">✨</div>
          </div>
        </div>
      </div>
    </main>
  );
}
