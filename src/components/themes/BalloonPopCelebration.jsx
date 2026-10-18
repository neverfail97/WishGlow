import React, { useState } from 'react';
import { soundEngine } from '../../utils/soundEngine';
import { fireCelebrationConfetti } from '../CelebrationEffects';
import { Sparkles, Trophy } from 'lucide-react';

const BALLOON_COLORS = [
  { bg: 'from-pink-500 to-rose-600', border: 'border-pink-300' },
  { bg: 'from-purple-500 to-indigo-600', border: 'border-purple-300' },
  { bg: 'from-amber-400 to-orange-500', border: 'border-amber-200' },
  { bg: 'from-emerald-400 to-teal-600', border: 'border-emerald-200' },
  { bg: 'from-cyan-400 to-blue-600', border: 'border-cyan-200' },
  { bg: 'from-fuchsia-400 to-pink-600', border: 'border-fuchsia-200' },
];

export default function BalloonPopCelebration({ wish, onComplete }) {
  const count = wish?.interactiveOptions?.balloonsCount || 6;
  
  // Track popped balloons
  const [popped, setPopped] = useState(() => Array(count).fill(false));
  const [isRevealed, setIsRevealed] = useState(false);

  const poppedCount = popped.filter(Boolean).length;
  const remaining = count - poppedCount;

  const handlePop = (idx) => {
    if (popped[idx]) return;

    soundEngine.playPop();

    const next = [...popped];
    next[idx] = true;
    setPopped(next);

    if (next.every(Boolean)) {
      setTimeout(() => {
        soundEngine.playCheer();
        fireCelebrationConfetti();
        setIsRevealed(true);
        if (onComplete) onComplete();
      }, 400);
    }
  };

  const handlePopAll = () => {
    soundEngine.playPop();
    setPopped(Array(count).fill(true));
    setTimeout(() => {
      soundEngine.playCheer();
      fireCelebrationConfetti();
      setIsRevealed(true);
      if (onComplete) onComplete();
    }, 400);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-6">
      <div className="relative w-full glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl text-center backdrop-blur-xl">
        
        {/* Helper Hint */}
        {remaining > 0 ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-medium mb-6 animate-pulse">
            <span>🎈 Tap each balloon to POP it! ({remaining} left)</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-medium mb-6 animate-bounce">
            <Trophy size={15} className="text-amber-300" />
            <span>All balloons popped! Your greeting is unlocked!</span>
          </div>
        )}

        {/* Balloons Floating Grid */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 my-6 max-w-sm mx-auto select-none">
          {popped.map((isPopped, idx) => {
            const style = BALLOON_COLORS[idx % BALLOON_COLORS.length];
            return (
              <div key={idx} className="flex flex-col items-center justify-center h-28 relative">
                {!isPopped ? (
                  <button
                    onClick={() => handlePop(idx)}
                    className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-110 active:scale-90"
                    title="Tap to pop balloon!"
                  >
                    {/* Balloon Body */}
                    <div className={`relative w-16 h-20 rounded-full bg-gradient-to-t ${style.bg} border-2 ${style.border} shadow-lg shadow-pink-500/20 flex items-center justify-center animate-balloon`}
                         style={{ animationDelay: `${(idx * 0.4)}s` }}>
                      {/* Highlight reflection */}
                      <div className="absolute top-2 left-2.5 w-3 h-5 rounded-full bg-white/40 -rotate-25" />
                      <span className="text-xs font-bold text-white drop-shadow">
                        {idx + 1}
                      </span>
                    </div>
                    {/* Balloon Knot & String */}
                    <div className="w-2 h-1.5 bg-amber-400 rounded-b -mt-0.5" />
                    <div className="w-0.5 h-6 bg-slate-400/50" />
                  </button>
                ) : (
                  <div className="w-16 h-20 flex items-center justify-center">
                    <span className="text-2xl animate-ping opacity-60">💥</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button: Pop all */}
        {remaining > 0 && (
          <button
            onClick={handlePopAll}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-cyan-500/30 text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Pop All Balloons 💥</span>
          </button>
        )}

      </div>
    </div>
  );
}
