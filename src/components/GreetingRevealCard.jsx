import React, { useState } from 'react';
import { Sparkles, Heart, Camera, UserCheck, Play, Pause, ChevronLeft, ChevronRight, Film, Mic, Scroll, Award, Clock } from 'lucide-react';
import { fireCelebrationConfetti } from './CelebrationEffects';

export default function GreetingRevealCard({ wish }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = wish?.photos?.length > 0 ? wish.photos : (wish?.photoUrl ? [wish.photoUrl] : []);
  const videoUrl = wish?.videoUrl || '';
  const audioUrl = wish?.audioUrl || '';
  const messageTheme = wish?.messageTheme || 'scroll';
  const overallTheme = wish?.overallTheme || wish?.occasion || 'birthday';
  const isRomantic = overallTheme === 'love' || overallTheme === 'anniversary' || overallTheme === 'romantic';

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
    <div className="w-full max-w-xl mx-auto my-6 px-4 animate-in fade-in zoom-in-95 duration-700">
      <div className={`relative glass-panel bg-gradient-to-br ${currentThemeStyle} p-6 sm:p-8 rounded-3xl shadow-2xl border backdrop-blur-2xl text-center overflow-hidden`}>
        
        {/* Floating background particles for romantic overall theme */}
        {isRomantic && (
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500 via-transparent to-transparent animate-pulse-glow" />
        )}

        {/* Decorative corner sparkles */}
        <div className="absolute top-3 left-3 text-amber-300/40 text-lg">✨</div>
        <div className="absolute top-3 right-3 text-pink-300/40 text-lg">✨</div>
        <div className="absolute bottom-3 left-3 text-purple-300/40 text-lg">✨</div>
        <div className="absolute bottom-3 right-3 text-amber-300/40 text-lg">✨</div>

        {/* Video Greeting (if attached) */}
        {videoUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border-2 border-pink-400/60 shadow-xl bg-black">
            <video
              src={videoUrl}
              controls
              className="w-full max-h-72 object-contain"
            />
          </div>
        )}

        {/* Recipient Photo Gallery (if attached) */}
        {photos.length > 0 && !videoUrl && (
          <div className="relative mx-auto mb-6 w-44 h-44 sm:w-52 sm:h-52 p-2 bg-white/10 rounded-2xl border-2 border-pink-400/60 shadow-2xl shadow-pink-500/20">
            <img
              src={photos[photoIndex]}
              alt={wish.recipientName}
              className="w-full h-full object-cover rounded-xl"
            />
            
            {photos.length > 1 && (
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === photoIndex ? 'bg-pink-400 w-4' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="absolute -bottom-2 -right-2 bg-pink-600 text-white p-1.5 rounded-full shadow-lg border border-white/50">
              <Heart size={14} className="fill-white" />
            </div>
          </div>
        )}

        {/* Custom Voice Note Audio Greeting (if attached) */}
        {audioUrl && (
          <div className="mb-5 p-3 rounded-2xl bg-slate-900/80 border border-pink-500/40 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-600/20 text-pink-400">
                <Mic size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Personal Voice Message</span>
                <span className="text-[10px] text-slate-400">Recorded for {wish?.recipientName}</span>
              </div>
            </div>
            <audio src={audioUrl} controls className="h-8 max-w-[160px]" />
          </div>
        )}

        {/* Occasion Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-amber-300 text-xs font-semibold mb-3">
          <Sparkles size={12} className="text-amber-400" />
          <span className="uppercase tracking-widest">{wish?.occasion || 'Special Celebration'}</span>
        </div>

        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 leading-snug">
          {wish?.title || `Happy ${wish?.occasion || 'Celebration'}, ${wish?.recipientName}!`}
        </h2>

        {/* Recipient Highlight */}
        <div className={`text-3xl sm:text-4xl font-cursive font-bold mb-5 ${isRomantic ? 'text-pink-300 glow-text-pink' : 'text-amber-300 glow-text-gold'}`}>
          Dearest {wish?.recipientName}
        </div>

        {/* Styled Message Theme Card */}
        <div className={`p-5 sm:p-7 ${messageStyle} leading-relaxed text-left shadow-2xl mb-6 relative`}>
          <div className="italic text-base sm:text-lg">
            "{wish?.message || "Wishing you infinite joy, sparkling laughter, and love that knows no bounds on this extraordinary day!"}"
          </div>
        </div>

        {/* Sender Signature & 5-Day Memory Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/80 pt-4 text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <UserCheck size={14} className="text-purple-400" />
            <span>Sent with love by <strong className="text-purple-300">{wish?.senderName || 'Someone Special'}</strong></span>
          </div>

          {wish?.has5DayMemory && (
            <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <Clock size={12} />
              <span>5-Day Memory Active</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
