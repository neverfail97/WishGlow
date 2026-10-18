import React, { useState } from 'react';
import { soundEngine } from '../../utils/soundEngine';
import { fireCelebrationConfetti } from '../CelebrationEffects';
import { Gift, Sparkles, Heart } from 'lucide-react';

export default function GiftBoxSurprise({ wish, onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenBox = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    soundEngine.playBoxOpen();

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      soundEngine.playCheer();
      fireCelebrationConfetti();
      if (onComplete) onComplete();
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-6">
      <div className="relative w-full glass-card p-8 rounded-3xl border border-purple-500/30 shadow-2xl text-center backdrop-blur-xl">
        
        {/* Helper Hint */}
        {!isOpen && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-medium mb-6 animate-pulse">
            <Gift size={15} className="text-purple-300" />
            <span>Tap the mystery box to unwrap your special gift!</span>
          </div>
        )}

        {/* 3D Gift Box Container */}
        <div className="relative flex flex-col items-center justify-center my-8 cursor-pointer select-none" onClick={handleOpenBox}>
          
          {/* Light rays when opened */}
          {isOpen && (
            <div className="absolute -inset-16 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/30 via-purple-500/20 to-transparent rounded-full animate-pulse-glow pointer-events-none" />
          )}

          {/* Ribbon Bow on Top */}
          <div className={`relative z-30 transition-all duration-500 ${isOpen ? '-translate-y-24 opacity-0 scale-75' : isOpening ? 'animate-bounce' : 'animate-wiggle'}`}>
            <div className="flex items-center justify-center -mb-2">
              <div className="w-10 h-10 rounded-full border-4 border-amber-300 bg-amber-400/90 shadow-lg rotate-45 transform origin-bottom-right" />
              <div className="w-10 h-10 rounded-full border-4 border-amber-300 bg-amber-400/90 shadow-lg -rotate-45 transform origin-bottom-left" />
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-300 shadow-md mx-auto -mt-3 z-40 border border-amber-200" />
          </div>

          {/* Gift Box Lid */}
          <div className={`relative z-20 w-52 sm:w-60 h-14 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 rounded-xl border-2 border-fuchsia-300/60 shadow-xl transition-all duration-700 flex items-center justify-center overflow-hidden ${
            isOpen ? '-translate-y-24 rotate-12 opacity-30 scale-90' : isOpening ? 'scale-105' : 'hover:scale-102'
          }`}>
            {/* Horizontal Gold Ribbon on Lid */}
            <div className="w-8 h-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-md" />
          </div>

          {/* Gift Box Base */}
          <div className={`relative z-10 w-48 sm:w-56 h-40 bg-gradient-to-b from-purple-800 via-purple-900 to-indigo-950 rounded-b-2xl border-x-2 border-b-2 border-fuchsia-400/50 shadow-2xl transition-all flex flex-col items-center justify-center overflow-hidden ${
            isOpen ? 'border-amber-400/60 shadow-amber-500/20' : 'hover:shadow-purple-500/30'
          }`}>
            {/* Center Vertical Gold Ribbon */}
            <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-md flex items-center justify-center">
              <Sparkles size={16} className="text-amber-800 animate-twinkle" />
            </div>

            {/* Recipient Tag attached */}
            <div className="relative z-10 px-4 py-1.5 rounded-lg bg-slate-900/90 border border-amber-300/70 shadow-lg text-amber-200 font-display text-sm font-semibold tracking-wide flex items-center gap-1.5 mt-8">
              <Heart size={13} className="text-rose-400 fill-rose-400" />
              <span>For: {wish?.recipientName || 'You'}</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        {!isOpen && (
          <button
            onClick={handleOpenBox}
            className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-xl shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            🎁 Tap to Unwrap Surprise
          </button>
        )}

      </div>
    </div>
  );
}
