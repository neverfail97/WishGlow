import React, { useState, useEffect } from 'react';
import { getWish } from '../utils/storage';
import { soundEngine } from '../utils/soundEngine';
import AmbientFloatingElements, { fireCelebrationConfetti } from './CelebrationEffects';
import ExpiredScreen from './ExpiredScreen';
import CelebrationSetPager from './CelebrationSetPager';
import MusicPlayer from './MusicPlayer';
import { Sparkles, Play, ArrowLeft, AlertCircle, Heart } from 'lucide-react';

export default function ReceiverView({ wishId, queryData, currentUser, onOpenAuth, onGoHome }) {
  const [loading, setLoading] = useState(true);
  const [wish, setWish] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWish() {
      setLoading(true);
      setError(null);

      const res = await getWish(wishId, queryData);
      setLoading(false);

      if (res.error) {
        setError(res.error);
        return;
      }

      if (res.expired) {
        // If user is logged in, attempt to claim 5-day memory extension!
        if (currentUser?.email) {
          try {
            const claimRes = await fetch(`/api/wishes/${wishId}/claim-memory`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: currentUser.email })
            });
            const claimData = await claimRes.json();
            if (claimData.success) {
              setIsExpired(false);
              setWish({ ...res.wish, expiresAt: claimData.expiresAt, has5DayMemory: true });
              return;
            }
          } catch (e) {}
        }

        setIsExpired(true);
        setWish(res);
        return;
      }

      setWish(res.wish);
    }

    if (wishId || queryData) {
      fetchWish();
    }
  }, [wishId, queryData, currentUser]);

  const handleStartExperience = () => {
    setHasStarted(true);
    fireCelebrationConfetti();
    if (wish?.audioUrl) {
      soundEngine.playCustomAudio(wish.audioUrl);
    } else {
      soundEngine.playBgm(wish?.music || 'birthday');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin mb-4" />
        <span className="text-slate-300 text-sm font-medium animate-pulse">
          Opening your celebration...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Greeting Unavailable</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">{error}</p>
        <button
          onClick={onGoHome}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (isExpired) {
    return (
      <ExpiredScreen
        recipientName={wish?.recipientName}
        senderName={wish?.senderName}
        occasion={wish?.occasion}
        onOpenAuth={onOpenAuth}
        onCreateNew={onGoHome}
      />
    );
  }

  const themeKey = wish?.theme || 'cake3d';
  const overallTheme = wish?.overallTheme || wish?.occasion || 'birthday';
  const isRomantic = overallTheme === 'love' || overallTheme === 'anniversary' || overallTheme === 'romantic';

  // Overall page gradient based on chosen occasion
  const bgGradients = {
    romantic: 'from-rose-950/80 via-pink-950/70 to-slate-950',
    love: 'from-rose-950/80 via-pink-950/70 to-slate-950',
    anniversary: 'from-rose-950/80 via-red-950/60 to-slate-950',
    birthday: 'from-purple-950/70 via-pink-950/50 to-slate-950',
    congrats: 'from-amber-950/70 via-yellow-950/50 to-slate-950',
    festival: 'from-indigo-950/70 via-purple-950/50 to-slate-950',
    friendship: 'from-cyan-950/70 via-blue-950/50 to-slate-950'
  };

  const currentBg = bgGradients[overallTheme] || bgGradients.birthday;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative flex flex-col items-center justify-between overflow-x-hidden selection:bg-pink-500 selection:text-white">
      
      {/* 1. FIXED FLOATING EXIT BUTTON - ALWAYS VISIBLE */}
      <button
        type="button"
        onClick={onGoHome}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-xs shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-105"
        title="Leave Preview / Return to Home"
      >
        <ArrowLeft size={14} />
        <span>Back to Home</span>
      </button>

      {/* Dynamic Themed Background */}
      <div className={`fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${currentBg} pointer-events-none transition-colors duration-1000`} />

      {/* Floating particles */}
      <AmbientFloatingElements theme={isRomantic ? 'envelope' : themeKey} />

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 w-full max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between backdrop-blur-md pl-36">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold backdrop-blur-md shadow-md ml-auto">
          {isRomantic ? <Heart size={12} className="fill-pink-400 text-pink-400" /> : <Sparkles size={12} className="text-pink-400" />}
          <span>A Special Celebration Just For You</span>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="relative z-20 w-full flex-1 flex flex-col items-center justify-center px-4 py-4">
        
        {/* Intro Teaser Card */}
        {!hasStarted ? (
          <div className="w-full max-w-md text-center glass-panel p-8 sm:p-10 rounded-3xl border border-pink-500/30 shadow-2xl animate-in zoom-in-95 duration-500 my-auto">
            <div className="text-5xl mb-4 animate-bounce">
              {isRomantic ? '💖' : '🎁'}
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold mb-4">
              <Sparkles size={13} />
              <span>A Special Surprise Has Arrived</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
              For <span className="text-pink-400 font-cursive text-4xl block mt-1">{wish?.recipientName}</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              <strong className="text-purple-300">{wish?.senderName}</strong> has prepared an interactive celebration greeting just for you!
            </p>

            <button
              onClick={handleStartExperience}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-base shadow-xl shadow-pink-500/30 transition-all transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play size={18} className="fill-white" />
              <span>Tap to Open Surprise & Sound 🎵</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Paginated Set-by-Set Celebration Player ("Next" navigation) */}
            <CelebrationSetPager
              wish={wish}
              isMobile={false}
              onExit={onGoHome}
            />
          </div>
        )}

      </main>

      {/* Background Music Player */}
      {hasStarted && (
        <MusicPlayer track={wish?.music || 'birthday'} autoPlay={true} />
      )}

      {/* Footer */}
      <footer className="relative z-20 w-full py-4 text-center text-xs text-slate-500">
        <span>WishGlow · Interactive Digital Celebration</span>
      </footer>
    </div>
  );
}
