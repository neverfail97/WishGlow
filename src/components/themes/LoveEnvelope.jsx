import React, { useState } from 'react';
import { soundEngine } from '../../utils/soundEngine';
import { fireCelebrationConfetti } from '../CelebrationEffects';
import { Mail, Heart, Sparkles } from 'lucide-react';

export default function LoveEnvelope({ wish, onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCracking, setIsCracking] = useState(false);

  const handleBreakSeal = () => {
    if (isOpen || isCracking) return;
    setIsCracking(true);
    soundEngine.playSealBreak();

    setTimeout(() => {
      setIsOpen(true);
      setIsCracking(false);
      soundEngine.playCheer();
      fireCelebrationConfetti();
      if (onComplete) onComplete();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-6">
      <div className="relative w-full glass-card p-6 sm:p-8 rounded-3xl border border-rose-500/30 shadow-2xl text-center backdrop-blur-xl">
        
        {/* Helper Hint */}
        {!isOpen && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-medium mb-6 animate-pulse">
            <Mail size={15} className="text-rose-300" />
            <span>Tap the wax seal to open your private letter!</span>
          </div>
        )}

        {/* Vintage Envelope Presentation */}
        <div className="relative flex flex-col items-center justify-center my-6 select-none cursor-pointer" onClick={handleBreakSeal}>
          
          {/* Main Envelope Body */}
          <div className="relative w-72 sm:w-84 h-48 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 rounded-2xl border-2 border-amber-300/80 shadow-2xl overflow-hidden flex items-center justify-center">
            
            {/* Envelope Fold Pattern */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-30" viewBox="0 0 100 65" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="50" y2="35" stroke="#991b1b" strokeWidth="1" />
                <line x1="100" y1="0" x2="50" y2="35" stroke="#991b1b" strokeWidth="1" />
                <line x1="0" y1="65" x2="40" y2="30" stroke="#991b1b" strokeWidth="0.8" />
                <line x1="100" y1="65" x2="60" y2="30" stroke="#991b1b" strokeWidth="0.8" />
              </svg>
            </div>

            {/* Recipient Script on Envelope */}
            <div className="relative z-10 flex flex-col items-center px-4">
              <span className="text-[11px] font-semibold text-rose-900/60 uppercase tracking-widest mb-1">
                Special Delivery For
              </span>
              <span className="text-3xl sm:text-4xl font-script text-rose-950 font-bold drop-shadow-sm truncate max-w-full">
                {wish?.recipientName || 'My Dearest'}
              </span>
              <span className="text-xs text-rose-800/80 font-medium mt-1">
                From: {wish?.senderName || 'A Secret Admirer'}
              </span>
            </div>

            {/* The Wax Seal in the Center */}
            <div
              className={`absolute z-30 transition-all duration-500 ${
                isOpen
                  ? 'scale-150 opacity-0 pointer-events-none'
                  : isCracking
                  ? 'scale-90 rotate-12'
                  : 'hover:scale-110 active:scale-95 animate-pulse-glow'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border-2 border-amber-400 shadow-xl flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-amber-400/60 flex items-center justify-center">
                  <Heart size={20} className="text-amber-200 fill-amber-300" />
                </div>
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tracking-wider text-rose-300 uppercase bg-slate-950/80 px-2 py-0.5 rounded-full border border-rose-500/30">
                Tap Seal
              </span>
            </div>

          </div>

          {/* Letter Peeking out when Opened */}
          {isOpen && (
            <div className="mt-4 animate-in slide-in-from-bottom-8 duration-700">
              <div className="p-4 rounded-xl bg-amber-50/90 text-rose-950 text-xs font-serif shadow-lg border border-amber-200">
                ✨ Letter Unsealed with Love ✨
              </div>
            </div>
          )}

        </div>

        {/* Action Button */}
        {!isOpen && (
          <button
            onClick={handleBreakSeal}
            className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm shadow-xl shadow-rose-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            💌 Break Seal & Read Letter
          </button>
        )}

      </div>
    </div>
  );
}
