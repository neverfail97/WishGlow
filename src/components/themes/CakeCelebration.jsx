import React, { useState } from 'react';
import { soundEngine } from '../../utils/soundEngine';
import { fireCelebrationConfetti, fireSchoolPride } from '../CelebrationEffects';
import { Sparkles, Wind, Cake as CakeIcon, Flame, PartyPopper } from 'lucide-react';

export default function CakeCelebration({ wish, onComplete }) {
  const candlesCount = wish?.interactiveOptions?.candlesCount || 3;
  const cakeFlavor = wish?.interactiveOptions?.cakeFlavor || 'strawberry';
  const customIcingText = wish?.interactiveOptions?.cakeText || wish?.recipientName || 'Dear One';
  const cakeTiers = wish?.interactiveOptions?.cakeTiers || 2;
  const candleColor = wish?.interactiveOptions?.candleColor || 'gold';

  // Flavor styling
  const flavorStyles = {
    strawberry: {
      top: 'from-amber-100 via-pink-100 to-amber-100 border-pink-300/80',
      drips: 'bg-pink-300',
      middle: 'from-rose-400 via-pink-500 to-rose-400 border-pink-300',
      base: 'from-pink-600 via-rose-600 to-pink-700 border-pink-400',
      glow: 'glow-text-pink',
      textColor: 'text-white',
      accent: 'text-pink-100'
    },
    chocolate: {
      top: 'from-amber-900 via-yellow-950 to-amber-950 border-amber-600/80',
      drips: 'bg-amber-800',
      middle: 'from-amber-950 via-stone-900 to-amber-950 border-amber-500/60',
      base: 'from-yellow-950 via-amber-950 to-stone-950 border-amber-600',
      glow: 'glow-text-gold',
      textColor: 'text-amber-200',
      accent: 'text-amber-300'
    },
    vanilla: {
      top: 'from-sky-50 via-blue-100 to-sky-50 border-sky-300/80',
      drips: 'bg-sky-200',
      middle: 'from-sky-400 via-blue-500 to-sky-400 border-sky-300',
      base: 'from-blue-600 via-indigo-600 to-blue-700 border-sky-400',
      glow: 'glow-text-gold',
      textColor: 'text-white',
      accent: 'text-sky-100'
    },
    redvelvet: {
      top: 'from-red-100 via-rose-100 to-red-100 border-red-300/80',
      drips: 'bg-red-200',
      middle: 'from-red-700 via-rose-800 to-red-700 border-red-400',
      base: 'from-red-900 via-rose-950 to-red-900 border-red-500',
      glow: 'glow-text-pink',
      textColor: 'text-white',
      accent: 'text-red-100'
    }
  };

  const style = flavorStyles[cakeFlavor] || flavorStyles.strawberry;

  const [candles, setCandles] = useState(() => Array(Math.min(candlesCount, 9)).fill(false));
  const [poppersPopped, setPoppersPopped] = useState({ left: false, right: false });
  const [isRevealed, setIsRevealed] = useState(false);

  const blownCount = candles.filter(Boolean).length;
  const allBlown = blownCount === candles.length;

  const handleBlowCandle = (index) => {
    if (candles[index]) return;
    soundEngine.playCandleBlow();

    const next = [...candles];
    next[index] = true;
    setCandles(next);

    if (next.every(Boolean)) {
      triggerReveal();
    }
  };

  const handleBlowAll = () => {
    soundEngine.playCandleBlow();
    setCandles(Array(candles.length).fill(true));
    triggerReveal();
  };

  const handlePopperClick = (side) => {
    soundEngine.playPop();
    fireCelebrationConfetti();
    setPoppersPopped(prev => ({ ...prev, [side]: true }));
  };

  const triggerReveal = () => {
    setTimeout(() => {
      soundEngine.playCheer();
      fireCelebrationConfetti();
      fireSchoolPride();
      setIsRevealed(true);
      if (onComplete) onComplete();
    }, 400);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-6">
      <div className="relative w-full glass-card p-6 sm:p-8 rounded-3xl border border-pink-500/30 shadow-2xl shadow-pink-500/10 text-center backdrop-blur-xl">
        
        {/* Helper Hint */}
        {!allBlown ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-200 text-xs sm:text-sm font-medium mb-6 animate-pulse">
            <Wind size={15} className="text-pink-300" />
            <span>Tap candles to blow them out ({candles.length - blownCount} left)!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-medium mb-6 animate-bounce">
            <Sparkles size={15} className="text-amber-300" />
            <span>🎉 Make a Wish! Your dreams are set in motion!</span>
          </div>
        )}

        {/* Cake Container with Side Party Poppers */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-4 my-6 select-none">
          
          {/* Left Interactive Party Popper Cannon */}
          <div className="hidden sm:flex flex-col items-center">
            <button
              onClick={() => handlePopperClick('left')}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer transform hover:scale-110 active:scale-90 ${
                poppersPopped.left
                  ? 'bg-slate-800 border-slate-700 opacity-60'
                  : 'bg-gradient-to-tr from-pink-600 to-amber-500 border-pink-300 shadow-lg animate-wiggle'
              }`}
              title="Click to fire confetti popper!"
            >
              <PartyPopper size={22} className="text-white" />
            </button>
            <span className="text-[10px] text-pink-300 font-bold mt-1">
              {poppersPopped.left ? 'Popped! ✨' : 'Pop! 🎉'}
            </span>
          </div>

          {/* 3D Tiered Cake */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Candles Row */}
            <div className="flex items-end justify-center gap-3 sm:gap-5 z-20 mb-[-6px]">
              {candles.map((blown, idx) => (
                <div
                  key={idx}
                  onClick={() => handleBlowCandle(idx)}
                  className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
                  title={blown ? "Candle extinguished" : "Tap to blow candle"}
                >
                  <div className="h-9 flex items-center justify-center">
                    {!blown ? (
                      <div className={`w-4 h-7 rounded-full bg-gradient-to-t ${
                        candleColor === 'neon'
                          ? 'from-blue-500 via-cyan-300 to-white'
                          : 'from-orange-500 via-amber-300 to-yellow-100'
                      } animate-flame drop-shadow-[0_0_10px_#f59e0b]`} />
                    ) : (
                      <div className="text-slate-400 text-sm font-mono animate-smoke">
                        ☁️
                      </div>
                    )}
                  </div>

                  <div className={`w-3.5 h-12 rounded-t-sm shadow-md transition-all ${
                    idx % 2 === 0
                      ? 'bg-gradient-to-b from-pink-300 via-pink-400 to-rose-500'
                      : 'bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-500'
                  } border-t border-white/60`} />
                </div>
              ))}
            </div>

            {/* Top Tier */}
            <div className={`relative w-44 sm:w-52 h-14 rounded-t-2xl bg-gradient-to-r ${style.top} border-2 shadow-inner flex items-center justify-center z-15`}>
              <div className="absolute -bottom-2 inset-x-0 flex justify-around">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`w-3.5 h-3 ${style.drips} rounded-b-full shadow-sm`} />
                ))}
              </div>
              <span className="text-xs text-pink-900 font-bold tracking-widest uppercase">
                ✨ Happy Celebration ✨
              </span>
            </div>

            {/* Middle Main Tier with Custom Name */}
            <div className={`relative w-60 sm:w-68 h-20 rounded-t-xl bg-gradient-to-r ${style.middle} border-2 shadow-xl flex flex-col items-center justify-center px-4 overflow-hidden z-10`}>
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
              <span className={`${style.textColor} font-cursive text-2xl sm:text-3xl font-bold tracking-wide ${style.glow} drop-shadow-md truncate max-w-full z-10 px-2`}>
                {customIcingText}
              </span>
              <span className={`${style.accent} text-[10px] uppercase tracking-wider font-semibold z-10`}>
                Made with Love
              </span>
            </div>

            {/* Optional 3rd Grand Base Tier */}
            {cakeTiers >= 3 && (
              <div className={`relative w-72 sm:w-80 h-16 rounded-t-xl bg-gradient-to-r ${style.base} border-2 shadow-2xl flex items-center justify-around px-4 z-5`}>
                <span className="text-sm">🍓</span>
                <span className="text-xs text-amber-200 font-bold uppercase tracking-widest">★ VIP Special ★</span>
                <span className="text-sm">🍓</span>
              </div>
            )}

            {/* Cake Plate Stand */}
            <div className="w-72 sm:w-84 h-5 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 rounded-full border border-amber-300 shadow-xl" />
            <div className="w-28 h-4 bg-amber-300/80 rounded-b-md mx-auto" />
          </div>

          {/* Right Interactive Party Popper Cannon */}
          <div className="hidden sm:flex flex-col items-center">
            <button
              onClick={() => handlePopperClick('right')}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer transform hover:scale-110 active:scale-90 ${
                poppersPopped.right
                  ? 'bg-slate-800 border-slate-700 opacity-60'
                  : 'bg-gradient-to-tr from-purple-600 to-pink-500 border-pink-300 shadow-lg animate-wiggle'
              }`}
              title="Click to fire confetti popper!"
            >
              <PartyPopper size={22} className="text-white" />
            </button>
            <span className="text-[10px] text-purple-300 font-bold mt-1">
              {poppersPopped.right ? 'Popped! ✨' : 'Pop! 🎉'}
            </span>
          </div>

        </div>

        {/* Action Button: Blow All Candles */}
        {!allBlown && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleBlowAll}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-200 border border-pink-500/30 text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Wind size={15} />
              <span>Blow Out All Candles 💨</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
