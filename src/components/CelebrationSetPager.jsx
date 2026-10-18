import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Heart,
  RotateCcw,
  Film,
  Mic,
  Camera,
  Cake,
  Gift,
  Mail,
  UserCheck,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { fireCelebrationConfetti } from './CelebrationEffects';
import CakeCelebration from './themes/CakeCelebration';
import GiftBoxSurprise from './themes/GiftBoxSurprise';
import LoveEnvelope from './themes/LoveEnvelope';
import BalloonPopCelebration from './themes/BalloonPopCelebration';
import FireworksCelebration from './themes/FireworksCelebration';
import ScratchCardCelebration from './themes/ScratchCardCelebration';
import VideoMemoryCelebration from './themes/VideoMemoryCelebration';
import NeonPartyCelebration from './themes/NeonPartyCelebration';
import ReactionsBar from './ReactionsBar';

export default function CelebrationSetPager({
  wish,
  isMobile = false,
  onExit = null,
  onInteractionComplete = null
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const themeKey = wish?.theme || 'cake3d';
  const overallTheme = wish?.overallTheme || wish?.occasion || 'birthday';
  const isRomantic = overallTheme === 'love' || overallTheme === 'anniversary' || overallTheme === 'romantic';
  const messageTheme = wish?.messageTheme || 'scroll';

  const photos = wish?.photos?.length > 0 ? wish.photos : (wish?.photoUrl ? [wish.photoUrl] : []);
  const videoUrl = wish?.videoUrl || '';
  const audioUrl = wish?.audioUrl || '';
  const hasMedia = photos.length > 0 || Boolean(videoUrl) || Boolean(audioUrl);

  const steps = [
    { id: 0, title: 'Surprise', icon: '🎁', label: 'Interactive Activity' },
    { id: 1, title: 'Message', icon: '💌', label: 'Heartfelt Message' },
    { id: 2, title: 'Memories', icon: '📸', label: 'Photo & Video' },
    { id: 3, title: 'Reactions', icon: '💖', label: 'Send Love & Reply' }
  ];

  const handleCeremonyComplete = () => {
    setHasInteracted(true);
    fireCelebrationConfetti();
    if (onInteractionComplete) onInteractionComplete();
  };

  const goToNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      fireCelebrationConfetti();
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetToStart = () => {
    setCurrentStep(0);
    fireCelebrationConfetti();
  };

  // Card background styling based on overall theme
  const overallStyles = {
    love: 'from-rose-950/90 via-pink-950/80 to-slate-950 border-rose-500/50 shadow-rose-500/20',
    anniversary: 'from-rose-950/90 via-red-950/70 to-slate-950 border-rose-400/50 shadow-rose-500/20',
    romantic: 'from-pink-950/90 via-fuchsia-950/80 to-slate-950 border-pink-500/50 shadow-pink-500/20',
    birthday: 'from-purple-950/80 via-pink-950/60 to-slate-950 border-pink-500/40 shadow-purple-500/20',
    congrats: 'from-amber-950/80 via-yellow-950/60 to-slate-950 border-amber-500/40 shadow-amber-500/20',
    festival: 'from-indigo-950/80 via-purple-950/60 to-slate-950 border-purple-500/40 shadow-purple-500/20',
    friendship: 'from-cyan-950/80 via-blue-950/60 to-slate-950 border-cyan-500/40 shadow-cyan-500/20',
  };

  const currentThemeStyle = overallStyles[overallTheme] || overallStyles.birthday;

  // Message Card styling
  const messageCardStyles = {
    scroll: 'bg-gradient-to-br from-amber-50/95 via-yellow-100/90 to-amber-100/95 text-amber-950 border-2 border-amber-400/80 font-serif shadow-2xl rounded-2xl',
    love: 'bg-gradient-to-br from-rose-50/95 via-pink-100/90 to-rose-100/95 text-rose-950 border-2 border-rose-400/80 font-cursive text-lg sm:text-xl shadow-2xl rounded-2xl',
    modern: 'bg-slate-900/85 backdrop-blur-xl text-slate-100 border border-pink-500/40 font-outfit shadow-2xl rounded-2xl',
    billboard: 'bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-indigo-900/90 text-white border-2 border-yellow-400 font-display text-lg shadow-2xl rounded-2xl'
  };

  const messageStyle = messageCardStyles[messageTheme] || messageCardStyles.scroll;

  return (
    <div className={`w-full flex flex-col items-center ${isMobile ? 'max-w-full px-1' : 'max-w-2xl mx-auto px-4'}`}>
      
      {/* Set Step Indicator Bar (Navigation Header) */}
      <div className="w-full mb-3 select-none">
        <div className="flex items-center justify-between gap-1 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg backdrop-blur-md">
          {steps.map((st) => {
            const isActive = currentStep === st.id;
            const isCompleted = currentStep > st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setCurrentStep(st.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                    : isCompleted
                    ? 'bg-pink-950/40 text-pink-300 hover:bg-pink-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xs">{st.icon}</span>
                <span className={`truncate ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                  {st.title}
                </span>
                {isCompleted && <CheckCircle2 size={11} className="text-pink-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Set Stage Card */}
      <div className="w-full flex flex-col items-center min-h-[380px] justify-between">
        
        {/* ================= SET 1: Interactive Ceremony ================= */}
        {currentStep === 0 && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-2">
              <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full">
                Set 1 of 4: Surprise Ceremony
              </span>
              <h3 className="text-base font-display font-bold text-white mt-1">
                {wish?.title || `Special Wish For ${wish?.recipientName}`}
              </h3>
            </div>

            {/* Render selected Interactive Theme */}
            <div className={`w-full ${isMobile ? 'transform scale-[0.98] origin-top' : ''}`}>
              {themeKey === 'cake3d' && (
                <CakeCelebration wish={wish} onComplete={handleCeremonyComplete} />
              )}
              {themeKey === 'gift' && (
                <GiftBoxSurprise wish={wish} onComplete={handleCeremonyComplete} />
              )}
              {themeKey === 'envelope' && (
                <LoveEnvelope wish={wish} onComplete={handleCeremonyComplete} />
              )}
              {themeKey === 'balloons' && (
                <BalloonPopCelebration wish={wish} onComplete={handleCeremonyComplete} />
              )}
              {themeKey === 'fireworks' && (
                <FireworksCelebration wish={wish} onComplete={handleCeremonyComplete} />
              )}
              {themeKey === 'scratchcard' && (
                <ScratchCardCelebration wish={wish} onComplete={handleCeremonyComplete} />
              )}
              {themeKey === 'videomemory' && (
                <VideoMemoryCelebration wish={wish} onComplete={handleCeremonyComplete} />
              )}
              {themeKey === 'neonparty' && (
                <NeonPartyCelebration wish={wish} onComplete={handleCeremonyComplete} />
              )}
            </div>

            {/* Next Step Action Button */}
            <div className="w-full pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-end">
              <button
                type="button"
                onClick={goToNext}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-pink-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                <span>Next: Read Heartfelt Message</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ================= SET 2: Heartfelt Message ================= */}
        {currentStep === 1 && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-3">
              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full">
                Set 2 of 4: Heartfelt Message
              </span>
            </div>

            <div className={`relative w-full glass-panel bg-gradient-to-br ${currentThemeStyle} p-5 sm:p-7 rounded-3xl shadow-2xl border backdrop-blur-2xl text-center overflow-hidden`}>
              
              {/* Corner sparkles */}
              <div className="absolute top-3 left-3 text-amber-300/40 text-sm">✨</div>
              <div className="absolute top-3 right-3 text-pink-300/40 text-sm">✨</div>

              {/* Tag */}
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-amber-300 text-[11px] font-semibold mb-2">
                <Sparkles size={11} className="text-amber-400" />
                <span className="uppercase tracking-wider">{wish?.occasion || 'Special Celebration'}</span>
              </div>

              {/* Recipient name */}
              <div className={`text-2xl sm:text-3xl font-cursive font-bold mb-3 ${isRomantic ? 'text-pink-300 glow-text-pink' : 'text-amber-300 glow-text-gold'}`}>
                Dearest {wish?.recipientName}
              </div>

              {/* Message styled card */}
              <div className={`p-4 sm:p-6 ${messageStyle} leading-relaxed text-left shadow-xl mb-4 relative`}>
                <div className="italic text-sm sm:text-base">
                  "{wish?.message || "Wishing you infinite joy, laughter, and magical moments on this extraordinary day!"}"
                </div>
              </div>

              {/* Sender signature */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400 gap-1.5">
                <div className="flex items-center gap-1.5">
                  <UserCheck size={13} className="text-purple-400" />
                  <span>Sent with love by <strong className="text-purple-300">{wish?.senderName || 'Someone Special'}</strong></span>
                </div>

                {wish?.has5DayMemory && (
                  <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Clock size={11} />
                    <span>5-Day Memory Active</span>
                  </div>
                )}
              </div>

            </div>

            {/* Navigation buttons: Prev and Next */}
            <div className="w-full pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPrev}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Previous: Activity</span>
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-pink-500/20 cursor-pointer transition-all"
              >
                <span>Next: Memories</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ================= SET 3: Photos & Video Memories ================= */}
        {currentStep === 2 && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-3">
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full">
                Set 3 of 4: Photo & Video Memories
              </span>
              <h3 className="text-sm font-bold text-white mt-1">
                Moments & Greetings
              </h3>
            </div>

            <div className={`w-full glass-panel bg-gradient-to-br ${currentThemeStyle} p-4 sm:p-6 rounded-3xl shadow-2xl border text-center`}>
              
              {/* Video Greeting (if attached) */}
              {videoUrl ? (
                <div className="mb-4 rounded-2xl overflow-hidden border-2 border-pink-400/60 shadow-xl bg-black">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full max-h-56 object-contain"
                  />
                </div>
              ) : null}

              {/* Photo Slideshow */}
              {photos.length > 0 ? (
                <div className="relative mx-auto mb-4 w-40 h-40 sm:w-48 sm:h-48 p-1.5 bg-white/10 rounded-2xl border-2 border-pink-400/60 shadow-xl shadow-pink-500/20">
                  <img
                    src={photos[photoIndex]}
                    alt={wish?.recipientName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  
                  {photos.length > 1 && (
                    <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-20">
                      {photos.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPhotoIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                            i === photoIndex ? 'bg-pink-400 w-4' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="absolute -bottom-1.5 -right-1.5 bg-pink-600 text-white p-1 rounded-full shadow-md border border-white/50">
                    <Heart size={12} className="fill-white" />
                  </div>
                </div>
              ) : !videoUrl && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center mb-4">
                  <div className="text-3xl mb-2">📸</div>
                  <h4 className="text-sm font-bold text-white mb-1">Celebration Keepsake</h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    A special digital token crafted especially for <strong className="text-pink-400">{wish?.recipientName}</strong> with boundless wishes and joyful moments.
                  </p>
                </div>
              )}

              {/* Personal Voice Note Audio (if attached) */}
              {audioUrl && (
                <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-pink-500/40 flex items-center justify-between text-left mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-pink-600/20 text-pink-400">
                      <Mic size={14} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Recorded Voice Note</span>
                      <span className="text-[10px] text-slate-400">Audio message for you</span>
                    </div>
                  </div>
                  <audio src={audioUrl} controls className="h-7 max-w-[140px]" />
                </div>
              )}

            </div>

            {/* Navigation buttons: Prev and Next */}
            <div className="w-full pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPrev}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Previous: Message</span>
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-pink-500/20 cursor-pointer transition-all"
              >
                <span>Next: Send Love & Reply</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ================= SET 4: Reactions & Reply ================= */}
        {currentStep === 3 && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-2">
              <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                Set 4 of 4: Reactions & Reply
              </span>
              <h3 className="text-sm font-bold text-white mt-1">
                Share the Love
              </h3>
            </div>

            <div className="w-full">
              <ReactionsBar wishId={wish?.id || 'preview_id'} initialReactions={wish?.reactions || []} />
            </div>

            {/* Completed badge */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center w-full mt-2">
              ✨ You have completed all sets of this celebration!
            </div>

            {/* Navigation: Prev, Replay, Exit */}
            <div className="w-full pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPrev}
                className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Memories</span>
              </button>

              <button
                type="button"
                onClick={resetToStart}
                className="py-2.5 px-3.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw size={13} />
                <span>Replay from Start</span>
              </button>

              {onExit && (
                <button
                  type="button"
                  onClick={onExit}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-rose-600 border border-slate-700 hover:border-rose-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <X size={13} />
                  <span>Exit Preview</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
