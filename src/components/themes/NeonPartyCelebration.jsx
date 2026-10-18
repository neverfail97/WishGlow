import React, { useState } from 'react';
import { soundEngine } from '../../utils/soundEngine';
import { fireCelebrationConfetti } from '../CelebrationEffects';
import { Disc, Music2, Sparkles, Zap } from 'lucide-react';

export default function NeonPartyCelebration({ wish, onComplete }) {
  const [isPartying, setIsPartying] = useState(false);

  const handleStartParty = () => {
    setIsPartying(true);
    soundEngine.playBgm('celebration');
    soundEngine.playCheer();
    fireCelebrationConfetti();
    if (onComplete) onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-6">
      <div className="relative w-full glass-card p-6 sm:p-8 rounded-3xl border border-fuchsia-500/40 shadow-2xl text-center backdrop-blur-xl">
        
        {/* Helper Hint */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-200 text-xs sm:text-sm font-medium mb-6 animate-pulse">
          <Zap size={15} className="text-fuchsia-300" />
          <span>Tap to launch the Neon Celebration Bash!</span>
        </div>

        {/* Disco Party Centerpiece */}
        <div className="relative my-6 flex flex-col items-center justify-center select-none">
          
          {/* Pulsing neon rings */}
          <div className="relative w-48 h-48 rounded-full border-4 border-fuchsia-500 flex items-center justify-center shadow-[0_0_40px_#d946ef] animate-pulse">
            <div className="w-36 h-36 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_30px_#22d3ee]">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Disc size={44} className={`text-white ${isPartying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>

          {/* Equalizer Wave bars */}
          <div className="flex items-end justify-center gap-1.5 h-12 mt-6">
            {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50].map((h, i) => (
              <div
                key={i}
                className={`w-2.5 rounded-t bg-gradient-to-t from-fuchsia-500 to-cyan-400 transition-all duration-300 ${
                  isPartying ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{
                  height: isPartying ? `${h}%` : '20%',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Recipient Party Tag */}
          <div className="mt-5">
            <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold block mb-1">
              VIP Party Guest of Honor
            </span>
            <span className="text-3xl sm:text-4xl font-display font-extrabold text-white glow-text-pink">
              {wish?.recipientName || 'Party Star'}
            </span>
          </div>

        </div>

        {/* Action Button */}
        {!isPartying && (
          <button
            onClick={handleStartParty}
            className="mt-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-fuchsia-500/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <Music2 size={16} />
            <span>Turn Up The Music & Party! 🎉</span>
          </button>
        )}

      </div>
    </div>
  );
}
