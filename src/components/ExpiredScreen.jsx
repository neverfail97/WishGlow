import React from 'react';
import { Sparkles, Hourglass, Heart, ArrowRight, PlusCircle, User, Calendar } from 'lucide-react';

export default function ExpiredScreen({ recipientName, senderName, occasion, onOpenAuth, onCreateNew }) {
  const occasionLabels = {
    birthday: 'Birthday Celebration',
    anniversary: 'Anniversary Memory',
    love: 'Love Greeting',
    congrats: 'Congratulations Moment',
    festival: 'Festive Blessing',
    friendship: 'Friendship Note'
  };

  const label = occasionLabels[occasion] || 'Celebration';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/40 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center glass-panel p-8 sm:p-10 rounded-3xl border border-slate-700/60 shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Hourglass size={32} className="animate-spin-slow" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-300 text-xs font-semibold mb-4">
          <Sparkles size={13} />
          <span>Viewing Window Concluded</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-3">
          This Moment Was Cherished
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          This greeting was crafted with love for <strong className="text-pink-300">{recipientName || 'a special soul'}</strong> by <span className="text-purple-300">{senderName || 'a loved one'}</span> for their {label.toLowerCase()}.
        </p>

        {/* 5-Day Memory login invitation */}
        {onOpenAuth && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-slate-900 border border-pink-500/40 mb-6 text-left">
            <div className="flex items-center gap-2 text-pink-300 font-bold text-xs mb-1">
              <Calendar size={14} className="text-pink-400" />
              <span>Want to preserve this memory for up to 5 days?</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Log in or create a free account to unlock <strong>5-Day Memory Retention</strong> and keep this celebration active!
            </p>
            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User size={13} />
              <span>Log In to Unlock 5-Day Memory</span>
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Create a New Wish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
