import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, MessageSquare, ExternalLink, QrCode as QrIcon, X, Globe, Smartphone, Sparkles, AlertCircle } from 'lucide-react';
import { encodeWishData } from '../utils/storage';
import { fireCelebrationConfetti } from './CelebrationEffects';

export default function ShareModal({ wish, onClose, onPreviewReceiver }) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showQr, setShowQr] = useState(false);
  
  // Custom online domain input (e.g. https://wishglow.onrender.com)
  const currentOrigin = window.location.origin;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  const [customDomain, setCustomDomain] = useState(() => {
    return localStorage.getItem('wishglow_custom_domain') || (isLocalhost ? '' : currentOrigin);
  });
  const [usePortableData, setUsePortableData] = useState(true);

  // Escape key support to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Encode compressed data for universal cross-device offline/cross-network opening
  const encodedData = React.useMemo(() => {
    return encodeWishData(wish);
  }, [wish]);

  // Determine base URL: user custom domain (e.g. Render) > current origin
  const baseDomain = customDomain.trim() ? customDomain.trim().replace(/\/$/, '') : currentOrigin;
  
  // Universal share URL that opens on any device
  const wishUrl = usePortableData && encodedData
    ? `${baseDomain}/#/w/${wish.id}?data=${encodedData}`
    : `${baseDomain}/#/w/${wish.id}`;

  useEffect(() => {
    fireCelebrationConfetti();
    // Generate QR Code for scanning directly from mobile phone
    QRCode.toDataURL(wishUrl, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('QR generation error:', err);
    });
  }, [wishUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(wishUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = `🎁 Hey ${wish.recipientName}! I created a magical interactive celebration for you. Tap here to open your surprise with music, animation & video: ${wishUrl} ✨`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDomainChange = (val) => {
    setCustomDomain(val);
    localStorage.setItem('wishglow_custom_domain', val);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/40 shadow-2xl text-center my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
          Your Surprise is Active & Ready!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-6">
          Created for <strong className="text-pink-400">{wish.recipientName}</strong>. Send the link to let them experience the celebration on any phone, tablet, or computer!
        </p>

        {/* Cross-device link helper badge */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Globe size={13} className="text-pink-400" />
              <span>Universal Link Settings</span>
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
              ✓ Opens on Any Device
            </span>
          </div>

          {/* Render Domain input (if user deployed to Render) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400">
              Live Website Domain (Render / Production URL):
            </label>
            <input
              type="text"
              placeholder="e.g. https://wishglow.onrender.com"
              value={customDomain}
              onChange={(e) => handleDomainChange(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Copy Share Link Input Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-700/80 mb-4">
          <input
            type="text"
            readOnly
            value={wishUrl}
            className="flex-1 bg-transparent px-3 text-xs text-slate-200 truncate focus:outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-pink-600 hover:bg-pink-500 text-white shadow-md'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Direct Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleWhatsAppShare}
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <MessageSquare size={16} />
            <span>Send on WhatsApp</span>
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <QrIcon size={16} />
            <span>{showQr ? 'Hide QR' : 'Show QR Code'}</span>
          </button>
        </div>

        {/* QR Code Reveal for Mobile Phone Camera Scanning */}
        {showQr && qrDataUrl && (
          <div className="p-4 rounded-2xl bg-white/95 max-w-[220px] mx-auto mb-6 shadow-xl animate-in zoom-in-95 duration-150">
            <img src={qrDataUrl} alt="Scan QR Code" className="w-full h-auto rounded-lg mx-auto" />
            <span className="text-[10px] text-slate-700 font-bold block mt-2">
              Scan with any phone camera
            </span>
            <span className="text-[9px] text-slate-500 block">
              Opens instantly on iPhone & Android
            </span>
          </div>
        )}

        {/* Secondary Buttons */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={onPreviewReceiver}
            className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>Open Experience</span>
          </button>

          <span className="text-slate-600">·</span>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
