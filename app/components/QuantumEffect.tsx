'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

interface QuantumEffectProps {
  targetX: number;
  targetY: number;
}

export default function QuantumEffect({ targetX, targetY }: QuantumEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 春节风中国风配色
    const colors = [
      '#E60000', // 红色 - 春节主色
      '#FFD700', // 金色 - 财富
      '#FFFFFF', // 白色 - 纯洁
      '#FF6B6B', // 浅红
      '#FFA500', // 橙色 - 活力
      '#C9A961', // 古铜金 - 中国传统
    ];

    // 创建粒子
    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: Math.random() * 4 + 2,
        color,
      };
    };

    // 动画循环
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 20, 40, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制量子波动背景
      const time = Date.now() * 0.001;
      for (let i = 0; i < 3; i++) {
        const radius = 100 + i * 50 + Math.sin(time * 2 + i) * 30;
        ctx.beginPath();
        ctx.arc(targetX, targetY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.1 - i * 0.03})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 生成新粒子
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 30;
        particlesRef.current.push(
          createParticle(
            targetX + Math.cos(angle) * dist,
            targetY + Math.sin(angle) * dist
          )
        );
      }

      // 更新和绘制粒子
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.size *= 0.98;

        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();

        // 绘制粒子间的连线
        particlesRef.current.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 * (1 - dist / 80)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        return true;
      });

      ctx.globalAlpha = 1;

      // 绘制中心量子光晕
      const gradient = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 80);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
      gradient.addColorStop(0.5, 'rgba(230, 0, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 80, 0, Math.PI * 2);
      ctx.fill();

      // 绘制中心光点
      ctx.beginPath();
      ctx.arc(targetX, targetY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetX, targetY]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
