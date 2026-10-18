import React, { useRef, useState, useEffect } from 'react';
import { soundEngine } from '../../utils/soundEngine';
import { fireCelebrationConfetti } from '../CelebrationEffects';
import { Sparkles, Award } from 'lucide-react';

export default function ScratchCardCelebration({ wish, onComplete }) {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [percent, setPercent] = useState(0);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Draw shimmering gold foil background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.3, '#fbbf24');
    grad.addColorStop(0.5, '#fef08a');
    grad.addColorStop(0.7, '#f59e0b');
    grad.addColorStop(1, '#d97706');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add pattern & prompt text on the foil
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE TO REVEAL ✨', width / 2, height / 2 - 8);

    ctx.fillStyle = '#92400e';
    ctx.font = '12px "Outfit", sans-serif';
    ctx.fillText('Rub with your finger or mouse', width / 2, height / 2 + 16);
  }, []);

  const scratch = (clientX, clientY) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    soundEngine.playScratch();

    // Calculate scratched percentage roughly
    setPercent(prev => {
      const next = prev + 3;
      if (next >= 45 && !isScratched) {
        setIsScratched(true);
        setTimeout(() => {
          soundEngine.playCheer();
          fireCelebrationConfetti();
          if (onComplete) onComplete();
        }, 300);
      }
      return Math.min(100, next);
    });
  };

  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handleRevealAll = () => {
    setIsScratched(true);
    setPercent(100);
    soundEngine.playCheer();
    fireCelebrationConfetti();
    if (onComplete) onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-6">
      <div className="relative w-full glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl text-center backdrop-blur-xl">
        
        {/* Helper Hint */}
        {!isScratched ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-medium mb-6 animate-pulse">
            <Award size={15} className="text-amber-300" />
            <span>Scratch the golden ticket to unlock your surprise ({percent}%)!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-medium mb-6 animate-bounce">
            <Sparkles size={15} className="text-emerald-300" />
            <span>Winner! Your surprise has been revealed!</span>
          </div>
        )}

        {/* Scratch Card Frame */}
        <div className="relative w-72 sm:w-80 h-52 mx-auto rounded-2xl overflow-hidden border-4 border-amber-300/80 shadow-2xl select-none">
          
          {/* Hidden Content Beneath Foil */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-950 p-4 flex flex-col items-center justify-center text-center">
            <div className="text-3xl mb-1">🎁</div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Exclusive Greeting For
            </span>
            <span className="text-2xl sm:text-3xl font-cursive font-bold text-pink-200 glow-text-pink truncate max-w-full">
              {wish?.recipientName || 'Special Someone'}
            </span>
            <p className="text-[11px] text-slate-200 mt-2 italic px-2 line-clamp-2">
              "{wish?.message || 'Wishing you the happiest celebration!'}"
            </p>
          </div>

          {/* Golden Scratch Foil Canvas */}
          {!isScratched && (
            <canvas
              ref={canvasRef}
              width={320}
              height={208}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onTouchStart={(e) => {
                isDrawingRef.current = true;
                if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={() => { isDrawingRef.current = false; }}
              className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
            />
          )}

        </div>

        {/* Action Button: Auto Reveal */}
        {!isScratched && (
          <div className="mt-5">
            <button
              onClick={handleRevealAll}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/30 text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Sparkles size={14} />
              <span>Scratch Instantly ✨</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
