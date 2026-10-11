import React, { useEffect, useRef } from 'react';

export const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Cosmic Dust & Blue Energy Particles
    const particleCount = Math.min(80, Math.floor(width / 18));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      speedY: -(Math.random() * 0.4 + 0.1), // Gentle upward drift like shadow monarchs
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.7 + 0.2,
      isCyan: Math.random() > 0.4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep void subtle gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        50,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      gradient.addColorStop(0, '#090D24');
      gradient.addColorStop(0.5, '#050510');
      gradient.addColorStop(1, '#020207');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render cosmic particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isCyan
          ? `rgba(0, 229, 255, ${p.alpha * 0.8})`
          : `rgba(77, 159, 255, ${p.alpha * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.isCyan ? '#00e5ff' : '#4d9fff';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
