import React, { useState } from 'react';
import { sendReaction } from '../utils/storage';
import { Heart, Sparkles, MessageCircle, Send, Check } from 'lucide-react';
import { fireCelebrationConfetti } from './CelebrationEffects';

const REACTION_BUTTONS = [
  { type: 'heart', label: 'Love it!', emoji: '❤️' },
  { type: 'cheer', label: 'Cheers!', emoji: '🥂' },
  { type: 'hug', label: 'Big Hug', emoji: '🤗' },
  { type: 'star', label: 'Made my day', emoji: '✨' },
];

export default function ReactionsBar({ wishId, initialReactions = [] }) {
  const [reactions, setReactions] = useState(initialReactions);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [senderName, setSenderName] = useState('');
  const [hasSent, setHasSent] = useState(false);

  const handleSendReaction = async (type, note = '') => {
    fireCelebrationConfetti();
    const newReaction = {
      type,
      senderName: senderName.trim() || 'Recipient',
      note: note.trim(),
      timestamp: new Date().toISOString()
    };

    setReactions(prev => [...prev, newReaction]);
    setHasSent(true);
    await sendReaction(wishId, newReaction);
  };

  const handleSubmitNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    handleSendReaction('message', noteText);
    setNoteText('');
    setShowNoteInput(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-4 sm:p-5 rounded-2xl glass-panel border border-slate-700/60 shadow-xl backdrop-blur-xl text-center">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Heart size={14} className="text-rose-400" />
          <span>Send Love Back to Sender</span>
        </span>
        {reactions.length > 0 && (
          <span className="text-xs text-pink-400 font-medium">
            {reactions.length} love received ✨
          </span>
        )}
      </div>

      {/* Quick reaction buttons */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3">
        {REACTION_BUTTONS.map((btn) => (
          <button
            key={btn.type}
            onClick={() => handleSendReaction(btn.type)}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-pink-500/50 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          >
            <span className="text-2xl mb-1">{btn.emoji}</span>
            <span className="text-[11px] font-medium text-slate-300">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Write a personalized Thank You Note toggle */}
      {!showNoteInput ? (
        <button
          onClick={() => setShowNoteInput(true)}
          className="text-xs text-pink-400 hover:text-pink-300 inline-flex items-center gap-1.5 font-medium transition-colors"
        >
          <MessageCircle size={13} />
          <span>Write a Thank You Note to Sender</span>
        </button>
      ) : (
        <form onSubmit={handleSubmitNote} className="mt-3 text-left">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Your Name (e.g., Sarah)"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a sweet reply..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md transition-colors"
              >
                <Send size={12} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Success alert */}
      {hasSent && (
        <div className="mt-3 text-xs text-emerald-400 flex items-center justify-center gap-1.5 animate-in fade-in">
          <Check size={14} />
          <span>Your love and gratitude was sent to the sender!</span>
        </div>
      )}

      {/* Recent note feed */}
      {reactions.filter(r => r.note).length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800 text-left space-y-2">
          {reactions.filter(r => r.note).slice(-3).map((r, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
              <span className="font-semibold text-pink-300">{r.senderName}: </span>
              <span className="text-slate-300 italic">"{r.note}"</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
