import React, { useEffect } from 'react';
import { Smartphone, X, Wifi, Battery, Signal, Sparkles, LogOut } from 'lucide-react';
import CelebrationSetPager from './CelebrationSetPager';

export default function MobileSimulator({ wish, onClose }) {
  // Support Escape key to exit preview
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 1. FIXED FLOATING EXIT BUTTON - ALWAYS VISIBLE AT ALL SCREEN RESOLUTIONS */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/95 hover:bg-rose-600 border border-slate-700 hover:border-rose-500 text-white font-bold text-xs sm:text-sm shadow-2xl backdrop-blur-md transition-all cursor-pointer ring-2 ring-white/10"
        title="Leave Preview"
      >
        <X size={16} />
        <span>Leave Preview / Back</span>
      </button>

      <div className="relative flex flex-col items-center my-auto py-4">
        
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between w-full max-w-[360px] mb-2 px-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Smartphone size={15} className="text-pink-400" />
            <span>Interactive Mobile Mockup</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-600/30 hover:bg-rose-600 border border-rose-500/50 text-rose-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <X size={13} />
            <span>Close Preview</span>
          </button>
        </div>

        {/* Realistic Smartphone Mockup Frame */}
        <div className="relative w-[340px] sm:w-[360px] h-[720px] bg-slate-900 rounded-[50px] p-3 shadow-[0_0_60px_rgba(236,72,153,0.3)] border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col">
          
          {/* Dynamic Island / Camera Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
            <div className="w-2 h-2 rounded-full bg-indigo-950 border border-indigo-900" />
          </div>

          {/* Internal Mobile Screen */}
          <div className="relative w-full h-full bg-slate-950 rounded-[40px] overflow-y-auto overflow-x-hidden flex flex-col scrollbar-none border border-slate-800">
            
            {/* Mobile Status Bar */}
            <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] text-slate-400 font-medium select-none z-30">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={13} className="text-emerald-400" />
              </div>
            </div>

            {/* Quick Sticky Leave Button Inside Phone Top Bar */}
            <div className="px-3 py-1 flex items-center justify-between bg-slate-900/80 border-b border-slate-800/80 z-20">
              <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">
                Preview Mode
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] text-slate-300 hover:text-rose-400 flex items-center gap-1 cursor-pointer font-semibold"
              >
                <X size={11} />
                <span>Exit Preview</span>
              </button>
            </div>

            {/* Simulated Receiver Content via Set-by-Set Navigation */}
            <div className="flex-1 flex flex-col items-center justify-start p-2 pb-8">
              <CelebrationSetPager
                wish={wish}
                isMobile={true}
                onExit={onClose}
              />
            </div>

            {/* Mobile Home Bar indicator */}
            <div className="sticky bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600 rounded-full z-40 my-1 mx-auto" />

          </div>

        </div>

        {/* Bottom Helper Hint */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[11px] text-slate-400">
            ✨ Tap candles, boxes or poppers, then click <strong>Next ➔</strong> to move through each set!
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-pink-400 hover:underline font-semibold cursor-pointer"
          >
            Leave Preview
          </button>
        </div>

      </div>
    </div>
  );
}
