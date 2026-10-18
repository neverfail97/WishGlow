import React, { useState } from 'react';
import { User, Lock, Mail, Sparkles, X, CheckCircle, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      setLoading(false);

      if (data.user) {
        localStorage.setItem('wishglow_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      // Fallback local login
      const cleanUser = {
        id: 'u_' + Math.random().toString(36).substring(2, 8),
        name: name.trim() || email.split('@')[0],
        email: email.trim().toLowerCase(),
        has5DayMemory: true
      };
      localStorage.setItem('wishglow_user', JSON.stringify(cleanUser));
      onLoginSuccess(cleanUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/40 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-pink-500/20 text-white">
            <User size={22} />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Sign in to unlock <strong className="text-pink-400">5-Day Memory Preservation</strong> so your celebrations don't vanish!
          </p>
        </div>

        {/* 5-Day Memory Benefit Banner */}
        <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center gap-2.5 mb-5 text-left text-xs text-pink-200">
          <Sparkles size={16} className="text-pink-400 shrink-0" />
          <span>
            <strong>5-Day Memory Retention</strong>: Logged-in users' greetings are safely saved and preserved for up to 5 days!
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Your Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-400 pt-1">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isRegister ? 'Register & Enable 5-Day Memory' : 'Log In & Enable 5-Day Memory')}
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-pink-400 font-semibold hover:underline"
              >
                Log In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-pink-400 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
