import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/soundEngine';
import { fireCelebrationConfetti, fireSchoolPride } from '../CelebrationEffects';
import { Sparkles, Flame } from 'lucide-react';

export default function FireworksCelebration({ wish, onComplete }) {
  const [blastsCount, setBlastsCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef(null);

  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.alpha -= 0.015;
        p.radius *= 0.98;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('ALPHA', p.alpha);
        ctx.fill();

        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1);
        }
      });

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const spawnFirework = (x, y) => {
    soundEngine.playFirework();
    const colors = [
      'rgba(244, 63, 94, ALPHA)',
      'rgba(234, 179, 8, ALPHA)',
      'rgba(168, 85, 247, ALPHA)',
      'rgba(56, 189, 248, ALPHA)',
      'rgba(52, 211, 153, ALPHA)'
    ];
    const baseColor = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2.5,
        alpha: 1,
        color: baseColor
      });
    }

    setBlastsCount(prev => {
      const next = prev + 1;
      if (next >= 3 && !revealed) {
        setRevealed(true);
        setTimeout(() => {
          soundEngine.playCheer();
          fireSchoolPride();
          if (onComplete) onComplete();
        }, 500);
      }
      return next;
    });
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnFirework(x, y);
  };

  const handleLaunchGrand = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    [0.3, 0.5, 0.7].forEach((ratio, idx) => {
      setTimeout(() => {
        spawnFirework(w * ratio, h * (0.3 + Math.random() * 0.3));
      }, idx * 250);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-6">
      <div className="relative w-full glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl text-center backdrop-blur-xl">
        
        {/* Helper Hint */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-medium mb-4 animate-pulse">
          <Flame size={15} className="text-amber-400" />
          <span>Tap the night sky to launch fireworks ({Math.max(0, 3 - blastsCount)} needed for reveal)!</span>
        </div>

        {/* Interactive Fireworks Canvas */}
        <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 cursor-crosshair my-4">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full block"
          />

          {/* Golden Center Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
            <span className="text-xs uppercase tracking-widest text-amber-400/80 font-bold mb-1">
              Festive Splendor
            </span>
            <span className="text-3xl sm:text-4xl font-display font-bold text-amber-200 glow-text-gold">
              {wish?.recipientName || 'Congratulations'}
            </span>
            <span className="text-xs text-amber-100/70 mt-1">
              ✨ Tap anywhere to sparkle ✨
            </span>
          </div>
        </div>

        {/* Action Button: Grand Show */}
        <div className="mt-2">
          <button
            onClick={handleLaunchGrand}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs sm:text-sm transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Sparkles size={16} />
            <span>Launch Grand Fireworks 🎆</span>
          </button>
        </div>

      </div>
    </div>
  );
}
