import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function MusicPlayer({ track = 'birthday', autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const trackLabels = {
    birthday: 'Happy Birthday Melodic Chimes',
    romantic: 'Romantic Serenade Piano',
    celebration: 'Grand Celebration Fanfare',
    ambient: 'Starlight Ambient Harp'
  };

  useEffect(() => {
    if (autoPlay) {
      soundEngine.playBgm(track);
      setIsPlaying(true);
    }
    return () => {
      soundEngine.stopBgm();
    };
  }, [track, autoPlay]);

  const togglePlay = () => {
    if (isPlaying) {
      soundEngine.stopBgm();
      setIsPlaying(false);
    } else {
      soundEngine.playBgm(track);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundEngine.setMute(nextMute);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 p-1.5 sm:p-2 rounded-full glass-panel border border-slate-700/80 shadow-2xl backdrop-blur-xl">
      {/* Vinyl record spinning indicator */}
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-pink-400 cursor-pointer transition-transform ${
          isPlaying ? 'animate-spin' : ''
        }`}
        style={{ animationDuration: '4s' }}
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        <Music size={16} />
      </button>

      {/* Track info pill */}
      <div className="hidden sm:flex flex-col text-left pr-2">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          {isPlaying ? 'Playing Melody' : 'Music Paused'}
        </span>
        <span className="text-xs text-slate-200 font-medium truncate max-w-[140px]">
          {trackLabels[track] || 'Festive Music'}
        </span>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={togglePlay}
          className="w-7 h-7 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          onClick={toggleMute}
          className="w-7 h-7 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} />}
        </button>
      </div>
    </div>
  );
}
