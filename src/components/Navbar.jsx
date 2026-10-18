import React from 'react';
import { Sparkles, Plus, User, LogOut } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAuth, onLogout, onGoHome, onStartCreate }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 p-0.5 shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles size={18} className="text-pink-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white tracking-tight block">
              WishGlow
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:block">
              Magical Interactive Celebrations
            </span>
          </div>
        </button>

        {/* User Auth & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200">{currentUser.name}</span>
                <span className="text-[10px] text-pink-400 font-semibold">5-Day Memory Active ✨</span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all cursor-pointer shadow-md"
            >
              <User size={13} className="text-pink-400" />
              <span>Log In / Sign Up</span>
            </button>
          )}

          <button
            onClick={onStartCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-pink-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Wish</span>
          </button>
        </div>

      </div>
    </header>
  );
}
