'use client';

import { useEffect, useRef, useState } from 'react';

interface HandTrackerProps {
  onHandMove: (x: number, y: number) => void;
}

export default function HandTracker({ onHandMove }: HandTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let hands: any = null;
    let camera: any = null;

    const loadHandTracking = async () => {
      try {
        // 动态导入 MediaPipe
        const { Hands } = await import('@mediapipe/hands');
        const { Camera } = await import('@mediapipe/camera_utils');
        const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils');

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 初始化手部识别
        hands = new Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          // 清空画布
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            // 绘制手部骨架
            drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, {
              color: '#FFD700',
              lineWidth: 2,
            });
            drawLandmarks(ctx, landmarks, {
              color: '#E60000',
              lineWidth: 1,
              radius: 3,
            });

            // 获取手心位置（使用手腕和中指根部的平均值）
            const wrist = landmarks[0];
            const middleFingerMCP = landmarks[9];

            const x = (wrist.x + middleFingerMCP.x) / 2;
            const y = (wrist.y + middleFingerMCP.y) / 2;

            // 反转 x 坐标（镜像效果）
            const mirroredX = 1 - x;

            // 将归一化坐标转换为画布坐标
            const canvasX = mirroredX * canvas.width;
            const canvasY = y * canvas.height;

            // 回调父组件
            onHandMove(canvasX, canvasY);

            // 绘制跟踪点
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 15, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.fill();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });

        // 设置摄像头
        camera = new Camera(video, {
          onFrame: async () => {
            await hands.send({ image: video });
          },
          width: 640,
          height: 480,
        });

        await camera.start();
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading hand tracking:', err);
        setError('加载手势识别失败，请检查摄像头权限');
      }
    };

    loadHandTracking();

    return () => {
      if (camera) {
        camera.stop();
      }
      if (hands) {
        hands.close();
      }
    };
  }, [onHandMove]);

  if (error) {
    return (
      <div className="fixed top-4 left-4 right-4 bg-red-900/80 backdrop-blur-sm text-white px-6 py-4 rounded-lg border-2 border-red-500 shadow-lg z-50">
        <p className="font-bold">⚠️ {error}</p>
        <p className="text-sm mt-2">请允许摄像头访问权限，然后刷新页面。</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="relative w-64 h-48 bg-black/50 rounded-xl overflow-hidden border-2 border-yellow-500/50 backdrop-blur-sm shadow-2xl">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
          playsInline
          style={{ display: 'none' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          width={640}
          height={480}
        />

        {/* 加载状态 */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-2"></div>
              <p className="text-yellow-400 text-sm">正在加载手势识别...</p>
            </div>
          </div>
        )}

        {/* 标签 */}
        <div className="absolute top-2 left-2 bg-red-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
          🎥 手势追踪
        </div>
      </div>
    </div>
  );
}
