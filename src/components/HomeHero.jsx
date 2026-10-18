import React, { useState } from 'react';
import { getLocalHistory } from '../utils/storage';
import {
  Sparkles,
  Cake,
  Gift,
  Mail,
  Flame,
  Music,
  PlusCircle,
  Copy,
  Check,
  ChevronRight,
  Film,
  Zap,
  Award,
  Video,
  Heart,
  Calendar
} from 'lucide-react';

export default function HomeHero({ onStartCreate, onSelectWish }) {
  const [history, setHistory] = useState(() => getLocalHistory());
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (wish, e) => {
    e.stopPropagation();
    const origin = window.location.origin;
    const url = `${origin}/#/w/${wish.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(wish.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const THEMES = [
    {
      id: 'cake3d',
      title: '3D Cake & Candle Blow',
      occasionTag: 'Birthday Special',
      icon: '🎂',
      border: 'border-pink-500/30 hover:border-pink-500',
      badgeBg: 'bg-pink-500/10 text-pink-400',
      desc: 'Tiered 3D cake with custom name piped on frosting, tap candles to blow out with realistic smoke puffs & applause!'
    },
    {
      id: 'gift',
      title: 'Surprise Gift Box Reveal',
      occasionTag: 'Surprise & Milestones',
      icon: '🎁',
      border: 'border-purple-500/30 hover:border-purple-500',
      badgeBg: 'bg-purple-500/10 text-purple-400',
      desc: 'Wrapped 3D luxury box with shiny golden ribbon. Untie ribbon and watch lid shake and pop open with light rays & confetti!'
    },
    {
      id: 'envelope',
      title: 'Royal Wax Seal Love Letter',
      occasionTag: 'Romance & Anniversary',
      icon: '💌',
      border: 'border-rose-500/30 hover:border-rose-500',
      badgeBg: 'bg-rose-500/10 text-rose-400',
      desc: 'Vintage envelope sealed in crimson wax. Tap to break the wax seal with snap audio, unfolding an emotional handwritten letter with floating hearts.'
    },
    {
      id: 'scratchcard',
      title: 'Golden Scratch Card',
      occasionTag: 'Interactive Game',
      icon: '🎫',
      border: 'border-amber-500/30 hover:border-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-400',
      desc: 'Rub with finger or mouse to scratch off shimmering golden lottery foil, uncovering the secret reward and message!'
    },
    {
      id: 'videomemory',
      title: 'Video & Photo Memory Reel',
      occasionTag: 'Multimedia Story',
      icon: '🎬',
      border: 'border-indigo-500/30 hover:border-indigo-500',
      badgeBg: 'bg-indigo-500/10 text-indigo-400',
      desc: 'Projector cinema reel with uploaded video greetings, photo slideshow, and personal voice note playback.'
    },
    {
      id: 'neonparty',
      title: 'Neon Disco Party Bash',
      occasionTag: 'Celebration Night',
      icon: '⚡',
      border: 'border-fuchsia-500/30 hover:border-fuchsia-500',
      badgeBg: 'bg-fuchsia-500/10 text-fuchsia-400',
      desc: 'Cyberpunk neon glow, sound-reactive animated equalizer waves, disco lights, and upbeat party tracks.'
    },
    {
      id: 'balloons',
      title: 'Carnival Balloon Poppers',
      occasionTag: 'Fun & Friendship',
      icon: '🎈',
      border: 'border-cyan-500/30 hover:border-cyan-500',
      badgeBg: 'bg-cyan-500/10 text-cyan-400',
      desc: 'Bobbing helium balloons with fun mini-game popping sounds. Pop all balloons to unlock the hidden greeting!'
    },
    {
      id: 'fireworks',
      title: 'Midnight Sky Fireworks',
      occasionTag: 'Festive & Success',
      icon: '🎆',
      border: 'border-amber-500/30 hover:border-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-400',
      desc: 'Interactive canvas night sky. Tap anywhere to fire multicolored bursting fireworks, illuminating golden celebratory typography.'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center">
      
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-pink-500/40 text-pink-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-lg shadow-pink-500/10">
        <Sparkles size={15} className="text-pink-400" />
        <span>Next-Gen Interactive Digital Celebrations & Wishes</span>
      </div>

      {/* Main Hero Title */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl">
        Send <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">Magical Interactive Celebrations</span> Made Just For Them
      </h1>

      {/* Subtitle */}
      <p className="text-slate-300 text-base sm:text-xl max-w-2xl leading-relaxed mb-8">
        Personalize 3D cake candle blowouts with custom icing, unwrappable gift boxes, wax-sealed love letters, scratch cards, and video memories with custom music and voice greetings.
      </p>

      {/* Hero Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <button
          onClick={() => onStartCreate()}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-base sm:text-lg shadow-2xl shadow-pink-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
        >
          <PlusCircle size={20} />
          <span>Create an Interactive Wish</span>
        </button>

        <a
          href="#interactive-themes"
          className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm sm:text-base transition-colors"
        >
          Explore Interactive Themes ↓
        </a>
      </div>

      {/* Interactive Themes Showcase */}
      <div id="interactive-themes" className="w-full mb-16 text-left">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Explore 8 Interactive Themes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any theme to customize and build your celebration with it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {THEMES.map((th) => (
            <div
              key={th.id}
              onClick={() => onStartCreate(th.id)}
              className={`group glass-card p-5 rounded-3xl border ${th.border} transition-all cursor-pointer hover:shadow-2xl flex flex-col justify-between`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {th.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                  <span>{th.title}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${th.badgeBg}`}>
                    {th.occasionTag}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {th.desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-pink-400 font-semibold pt-3 border-t border-slate-800/80 group-hover:text-pink-300">
                <span>Use This Theme</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User's Created Wishes Tracker (if any) */}
      {history.length > 0 && (
        <div className="w-full text-left pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              <Sparkles size={18} className="text-pink-400" />
              <span>Your Sent Celebrations</span>
            </h2>
            <span className="text-xs text-slate-400">{history.length} active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((w) => (
              <div
                key={w.id}
                onClick={() => onSelectWish(w.id)}
                className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 flex flex-col justify-between cursor-pointer transition-all hover:bg-slate-900/70"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-pink-300 truncate">
                    To: {w.recipientName}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1 italic mb-3">
                  "{w.message}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 capitalize">{w.occasion}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopy(w, e)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Copy link"
                    >
                      {copiedId === w.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                    <span className="text-pink-400 font-medium">View →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
