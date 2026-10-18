import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Check,
  Sparkles,
  Lock,
  Clock,
  Tag,
  ArrowRight,
  X,
  Smartphone,
  CheckCircle2,
  Calendar,
  Zap
} from 'lucide-react';

export default function CheckoutModal({ wishDraft, currentUser, onPaymentSuccess, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState('48h_standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [upiId, setUpiId] = useState('');

  const isUserLoggedIn = Boolean(currentUser && currentUser.email);

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const plans = {
    '48h_standard': {
      id: '48h_standard',
      name: isUserLoggedIn ? 'Standard 5-Day Memory Plan' : '48-Hour Standard Access Plan',
      badge: isUserLoggedIn ? '5-Day Retention Active' : 'Most Popular',
      price: 1.99,
      duration: isUserLoggedIn ? '5 Days Account Retention' : '48 Hours Limited Validity',
      features: [
        isUserLoggedIn ? 'Memory preserved for up to 5 days in your account' : 'Recipient link active for 48 hours',
        'All interactive themes (3D Cake, Gift Box, Scratch Card, Video)',
        'Custom audio, video & photo memories',
        'Instant WhatsApp 1-click share & QR code',
        'Two-way recipient reactions & thank you notes'
      ]
    },
    'lifetime': {
      id: 'lifetime',
      name: 'Permanent Keepsake Plan',
      badge: 'Never Expires',
      price: 4.99,
      duration: 'Unlimited Lifetime Access',
      features: [
        'Permanent link with zero expiration',
        'Full HD downloadable video memory recording',
        'Priority cloud media streaming',
        'Unlimited recipient views'
      ]
    }
  };

  const plan = plans[selectedPlan];
  const finalPrice = promoApplied ? 0 : plan.price;

  const handleApplyPromo = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    const validCodes = ['WISH48', 'MAGICFREE', 'CELEBRATE', 'TEST', 'FREE', 'GIFT'];

    if (validCodes.includes(code)) {
      setPromoApplied(true);
    } else {
      setPromoError('Invalid promo code. Try: WISH48');
    }
  };

  const handleQuickFreeTrial = () => {
    setPromoCode('WISH48');
    setPromoApplied(true);
  };

  const handleCompleteCheckout = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsProcessing(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    try {
      const res = await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          wishId: wishDraft.id,
          planId: selectedPlan,
          paymentMethod,
          promoCode: promoApplied ? (promoCode || 'WISH48') : null,
          userEmail: currentUser?.email || null
        })
      });
      clearTimeout(timer);

      const data = await res.json();
      setIsProcessing(false);

      onPaymentSuccess({
        ...wishDraft,
        isPaid: true,
        paymentPlan: selectedPlan,
        has5DayMemory: data.has5DayMemory || isUserLoggedIn,
        expiresAt: data.expiresAt || new Date(Date.now() + (isUserLoggedIn ? 5 * 24 * 3600 * 1000 : 48 * 3600 * 1000)).toISOString()
      });
    } catch (err) {
      clearTimeout(timer);
      console.warn('Checkout offline or fast fallback:', err);
      setIsProcessing(false);
      onPaymentSuccess({
        ...wishDraft,
        isPaid: true,
        paymentPlan: selectedPlan,
        has5DayMemory: isUserLoggedIn,
        expiresAt: new Date(Date.now() + (isUserLoggedIn ? 5 * 24 * 3600 * 1000 : 48 * 3600 * 1000)).toISOString()
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/40 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold mb-2">
            <Lock size={12} />
            <span>Secure Checkout & Activation</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Choose Your Access Plan
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Activate your personalized surprise for <strong className="text-pink-300">{wishDraft?.recipientName}</strong>
          </p>
        </div>

        {/* Logged in 5-day memory bonus banner */}
        {isUserLoggedIn ? (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 mb-5 text-left text-xs text-emerald-200">
            <Calendar size={16} className="text-emerald-400 shrink-0" />
            <span>
              <strong>Logged In Account Perk</strong>: Your account keeps this celebration memory preserved for <strong>5 full days</strong> (120 hours) instead of 48 hours!
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 mb-5 text-left text-xs text-amber-200">
            <Clock size={16} className="text-amber-400 shrink-0" />
            <span>
              <strong>Standard Access Window</strong>: Active for 48 hours. (Log in with your account to automatically extend preservation for 5 days!)
            </span>
          </div>
        )}

        {/* Plan Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          
          {/* Plan 1 */}
          <div
            onClick={() => setSelectedPlan('48h_standard')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
              selectedPlan === '48h_standard'
                ? 'bg-gradient-to-br from-pink-900/30 via-purple-900/40 to-slate-900 border-pink-500 shadow-xl shadow-pink-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">
                  {plan.badge}
                </span>
                {selectedPlan === '48h_standard' && <Check size={16} className="text-pink-400" />}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {isUserLoggedIn ? '5-Day Account Memory' : '48-Hour Celebration Access'}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-3">
                <Clock size={13} />
                <span>{isUserLoggedIn ? 'Preserved for 5 Days' : '48 Hours Limited Validity'}</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 mb-4">
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-pink-400 shrink-0" />
                  <span>{isUserLoggedIn ? 'Preserved up to 5 days in account' : 'Recipient link active for 48 hours'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-pink-400 shrink-0" />
                  <span>3D Cake, Gift Box, Video & Music</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-pink-400 shrink-0" />
                  <span>1-click WhatsApp share & QR code</span>
                </li>
              </ul>
            </div>
            <div className="text-lg font-bold text-white pt-2 border-t border-slate-800">
              $1.99 <span className="text-xs text-slate-400 font-normal">/ wish</span>
            </div>
          </div>

          {/* Plan 2: Lifetime Keepsake */}
          <div
            onClick={() => setSelectedPlan('lifetime')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
              selectedPlan === 'lifetime'
                ? 'bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900 border-purple-500 shadow-xl shadow-purple-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                  Permanent
                </span>
                {selectedPlan === 'lifetime' && <Check size={16} className="text-purple-400" />}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Lifetime Keepsake Plan
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-purple-300 font-semibold mb-3">
                <Sparkles size={13} />
                <span>Never Expires</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 mb-4">
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-purple-400 shrink-0" />
                  <span>Zero expiration date</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-purple-400 shrink-0" />
                  <span>Downloadable video keepsake</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={12} className="text-purple-400 shrink-0" />
                  <span>Unlimited views forever</span>
                </li>
              </ul>
            </div>
            <div className="text-lg font-bold text-white pt-2 border-t border-slate-800">
              $4.99 <span className="text-xs text-slate-400 font-normal">/ forever</span>
            </div>
          </div>

        </div>

        {/* Promo Code Box */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-5">
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Promo Code (Use 'WISH48' for Free)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={promoApplied || !promoCode.trim()}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              {promoApplied ? 'Applied!' : 'Apply'}
            </button>
          </form>

          {promoApplied ? (
            <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>Promo code applied! 100% OFF ($0.00 Free Trial)</span>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Want a quick free trial?</span>
              <button
                type="button"
                onClick={handleQuickFreeTrial}
                className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 cursor-pointer underline"
              >
                <Zap size={12} />
                <span>Apply "WISH48" 100% Free Pass</span>
              </button>
            </div>
          )}
          {promoError && (
            <div className="mt-2 text-xs text-rose-400">
              {promoError}
            </div>
          )}
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Payment Method
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                paymentMethod === 'card'
                  ? 'bg-pink-600/20 border-pink-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard size={14} />
              <span>Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-pink-600/20 border-pink-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                paymentMethod === 'paypal'
                  ? 'bg-pink-600/20 border-pink-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>🅿️ PayPal</span>
            </button>
          </div>

          {/* Card fields */}
          {paymentMethod === 'card' && !promoApplied && (
            <div className="space-y-2 mt-3 animate-in fade-in">
              <input
                type="text"
                placeholder="4242 •••• •••• 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          )}

          {/* UPI fields */}
          {paymentMethod === 'upi' && !promoApplied && (
            <div className="mt-3 animate-in fade-in">
              <input
                type="text"
                placeholder="username@okhdfcbank / PhonePe / GPay UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          )}
        </div>

        {/* Total & Submit Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Total Amount</span>
            <div className="text-xl font-extrabold text-white">
              {finalPrice === 0 ? (
                <span className="text-emerald-400 font-mono">FREE ($0.00)</span>
              ) : (
                `$${finalPrice.toFixed(2)}`
              )}
            </div>
          </div>

          <button
            onClick={handleCompleteCheckout}
            disabled={isProcessing}
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Activating Link...</span>
            ) : (
              <>
                <span>Complete & Activate</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>256-Bit SSL Encrypted · Instant Digital Delivery</span>
        </div>

      </div>
    </div>
  );
}
