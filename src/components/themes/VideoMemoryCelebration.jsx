import React, { useState } from 'react';
import { soundEngine } from '../../utils/soundEngine';
import { fireCelebrationConfetti } from '../CelebrationEffects';
import { Play, Pause, Film, Sparkles, Heart } from 'lucide-react';

export default function VideoMemoryCelebration({ wish, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const videoUrl = wish?.videoUrl || '';
  const photos = wish?.photos?.length > 0 ? wish.photos : (wish?.photoUrl ? [wish.photoUrl] : []);

  const handlePlayVideo = () => {
    setIsPlaying(true);
    soundEngine.playCheer();
    fireCelebrationConfetti();
    setTimeout(() => {
      setIsRevealed(true);
      if (onComplete) onComplete();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-6">
      <div className="relative w-full glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl text-center backdrop-blur-xl">
        
        {/* Helper Hint */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 text-xs sm:text-sm font-medium mb-6 animate-pulse">
          <Film size={15} className="text-indigo-300" />
          <span>Tap to start your personalized memory reel!</span>
        </div>

        {/* Video / Cinema Player Screen */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-400/50 shadow-2xl flex items-center justify-center my-4 group">
          
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay={isPlaying}
              className="w-full h-full object-cover"
              onPlay={() => {
                setIsPlaying(true);
                if (onComplete) onComplete();
              }}
            />
          ) : photos.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={photos[0]}
                alt={wish?.recipientName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-white font-cursive text-2xl font-bold">
                  {wish?.recipientName}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-indigo-300">
              <Film size={40} className="mb-2 opacity-80" />
              <span className="text-sm font-semibold">Special Memory Reel</span>
              <span className="text-xs text-slate-400 mt-1">Dedicated to {wish?.recipientName}</span>
            </div>
          )}

          {/* Overlay Play Button if not yet played */}
          {!isPlaying && (
            <div
              onClick={handlePlayVideo}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center cursor-pointer hover:bg-slate-950/40 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 active:scale-95 transition-all">
                <Play size={24} className="fill-white ml-1" />
              </div>
            </div>
          )}

        </div>

        {/* Action Button */}
        {!isRevealed && (
          <button
            onClick={handlePlayVideo}
            className="mt-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            🎬 Watch Celebration Clip
          </button>
        )}

      </div>
    </div>
  );
}
