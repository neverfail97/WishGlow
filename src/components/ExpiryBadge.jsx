import React, { useState, useEffect } from 'react';
import { Clock, Info, ShieldAlert, Sparkles } from 'lucide-react';

export default function ExpiryBadge({ expiresAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    function calculateTime() {
      const target = new Date(expiresAt).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ expired: true, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        if (onExpire) onExpire();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        expired: false,
        hours,
        minutes,
        seconds,
        totalMs: diff,
        percentRemaining: Math.min(100, (diff / (48 * 60 * 60 * 1000)) * 100)
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!timeLeft) return null;

  if (timeLeft.expired) {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold backdrop-blur-md animate-pulse">
        <ShieldAlert size={14} className="text-rose-400" />
        <span>48h Window Expired</span>
      </div>
    );
  }

  // Format with leading zeroes
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="relative inline-block z-40">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-amber-400/40 hover:border-amber-400 text-amber-200 text-xs font-medium backdrop-blur-md shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
        title="Click to learn about 48-hour expiration"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <Clock size={13} className="text-amber-400" />
        <span className="tracking-wide">
          Expires in <strong className="font-mono text-amber-300 font-bold ml-1">{pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s</strong>
        </span>
        <Info size={12} className="text-slate-400 group-hover:text-amber-300 transition-colors" />
      </button>

      {/* Info popover */}
      {showInfo && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-3.5 rounded-xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl shadow-2xl text-left z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            48-Hour Ephemeral Wish
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            This personalized greeting has a <strong className="text-amber-300">48-hour limited lifespan</strong>.
            Just like blowing birthday candles, ephemeral wishes create a rare and cherished moment in time!
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Window: 48 Hours</span>
            <button
              onClick={(e) => { e.stopPropagation(); setShowInfo(false); }}
              className="text-amber-400 hover:underline font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
