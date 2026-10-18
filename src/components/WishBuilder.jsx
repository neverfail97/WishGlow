import React, { useState } from 'react';
import { createWish } from '../utils/storage';
import { soundEngine } from '../utils/soundEngine';
import MobileSimulator from './MobileSimulator';
import CheckoutModal from './CheckoutModal';
import {
  Sparkles,
  Cake,
  Gift,
  Mail,
  Flame,
  Music,
  Image as ImageIcon,
  ArrowRight,
  Eye,
  Check,
  Volume2,
  Trash2,
  Heart,
  Video,
  Mic,
  Smartphone,
  Upload,
  Plus,
  ArrowLeft,
  Scroll,
  PartyPopper
} from 'lucide-react';

const OCCASIONS = [
  { id: 'birthday', label: 'Birthday', icon: '🎂', defaultTheme: 'cake3d', desc: 'Candles & custom cake icing' },
  { id: 'anniversary', label: 'Anniversary', icon: '💍', defaultTheme: 'envelope', desc: 'Romantic love letter & wax seal' },
  { id: 'love', label: 'Love & Romance', icon: '💖', defaultTheme: 'envelope', desc: 'Sweet surprise with floating hearts' },
  { id: 'congrats', label: 'Congratulations', icon: '🏆', defaultTheme: 'fireworks', desc: 'Grand celebratory fireworks' },
  { id: 'festival', label: 'Festive Occasion', icon: '✨', defaultTheme: 'fireworks', desc: 'Holiday blessings & lights' },
  { id: 'friendship', label: 'Best Friends', icon: '🎉', defaultTheme: 'balloons', desc: 'Fun balloon popping game' },
];

const THEMES = [
  {
    id: 'cake3d',
    title: '3D Cake & Candle Blow',
    desc: 'Tiered 3D cake, custom flavor, personalized icing, tap candles to blow out with smoke & applause!',
    icon: Cake,
  },
  {
    id: 'gift',
    title: 'Surprise Gift Box',
    desc: '3D ribbon unwrapping, vibrating box lid that pops open with light rays & confetti.',
    icon: Gift,
  },
  {
    id: 'envelope',
    title: 'Royal Wax Seal Envelope',
    desc: 'Vintage envelope with golden wax seal to break, revealing an unfolding letter.',
    icon: Mail,
  },
  {
    id: 'scratchcard',
    title: 'Golden Scratch-Off Card',
    desc: 'Rub with finger to scratch off shimmering golden foil to unlock the secret message.',
    icon: Sparkles,
  },
  {
    id: 'videomemory',
    title: 'Video & Photo Memory Reel',
    desc: 'Showcase personal video clips, photo slideshows, and recorded voice greetings.',
    icon: Video,
  },
  {
    id: 'neonparty',
    title: 'Neon Disco Party Bash',
    desc: 'Cyberpunk neon glow, sound-reactive equalizer bars, and upbeat celebration tunes.',
    icon: Sparkles,
  },
  {
    id: 'balloons',
    title: 'Balloon Carnival Pop',
    desc: 'Interactive floating balloons to pop one-by-one with realistic snap sounds.',
    icon: Sparkles,
  },
  {
    id: 'fireworks',
    title: 'Starry Sky Fireworks',
    desc: 'Tap anywhere in the midnight sky to launch colorful bursting fireworks & sparkles.',
    icon: Flame,
  },
];

const OVERALL_THEMES = [
  { id: 'romantic', label: '💖 Romantic Blush (Pink & Rose Petals)', desc: 'Soft pink glow, floating hearts, love vibes' },
  { id: 'birthday', label: '🎉 Birthday Fiesta (Purple & Confetti)', desc: 'Party purple, streamers, colorful confetti' },
  { id: 'congrats', label: '👑 Imperial Gold (Champagne & Stars)', desc: 'Obsidian luxury, gold sparkles, fireworks' },
  { id: 'festival', label: '✨ Festive Radiance (Royal Indigo & Lights)', desc: 'Warm glowing lanterns, golden diyas' },
  { id: 'friendship', label: '🌊 Ocean Cyan (Vibrant & Sunny)', desc: 'Electric cyan, sunny yellow, cheerful party' },
];

const MESSAGE_THEMES = [
  { id: 'scroll', label: '📜 Royal Golden Scroll', desc: 'Ancient parchment with gold leaf border' },
  { id: 'love', label: '💖 Romantic Love Letter', desc: 'Scented rose paper with handwritten script' },
  { id: 'modern', label: '🌟 Frosted Glass Neon', desc: 'Modern glassmorphic crystal card' },
  { id: 'billboard', label: '🎆 Grand Billboard', desc: 'Festive spotlight announcement' },
];

const MUSIC_TRACKS = [
  { id: 'birthday', label: 'Happy Birthday Chimes 🎂', desc: 'Melodic glockenspiel' },
  { id: 'romantic', label: 'Romantic Piano Serenade 💖', desc: 'Gentle emotional piano' },
  { id: 'celebration', label: 'Celebration Fanfare 🎺', desc: 'Upbeat triumphal melody' },
  { id: 'ambient', label: 'Starlight Ambient Harp ✨', desc: 'Dreamy starry chimes' },
];

const PRESET_MESSAGES = {
  birthday: [
    "Wishing you another year filled with great adventures, boundless laughter, and dreams turned into reality! Happy Birthday!",
    "May your special day be as sweet, radiant, and wonderful as you are to everyone around you. Blow out the candles and make a wish!",
    "Cheers to the most incredible person! Thank you for bringing so much light and joy into the world."
  ],
  anniversary: [
    "Every love story is beautiful, but ours is my absolute favorite. Happy Anniversary, my heart and soul!",
    "To another wonderful year of holding hands, sharing dreams, and laughing through life together.",
    "Happy Anniversary! May the bond you share continue to grow deeper, sweeter, and stronger with each passing day."
  ],
  love: [
    "Just a reminder that you are the most special person in my universe. Sending you all my love today and forever!",
    "In a crowded room, my eyes will always search for you. You make every ordinary moment feel magical.",
    "You bring warmth to my coldest days and light to my darkest nights. Here is a little surprise just for you!"
  ],
  congrats: [
    "Huge congratulations on this huge milestone! Your hard work, grit, and passion made it happen.",
    "The sky is not the limit, it's just your starting point. So proud of you and cheering for your next victory!",
    "Celebrate your triumph today! You truly deserve every bit of this success."
  ],
  festival: [
    "Wishing you and your family abundant joy, light, prosperity, and peace this festive season!",
    "May this joyous celebration illuminate your home with warmth and fill your hearts with endless blessings.",
    "Sending festive cheer and radiant good vibes your way. Let the festivities begin!"
  ],
  friendship: [
    "To the friend who knows all my secrets and still loves me anyway! Thanks for being an absolute legend.",
    "Life is 1000x sweeter with you by my side. Cheers to our unbreakable bond and countless crazy memories!",
    "Just wanted to drop this little smile in your day. Thank you for always being you!"
  ]
};

export default function WishBuilder({ initialTheme = 'cake3d', currentUser, onWishCreated, onCancel }) {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [occasion, setOccasion] = useState('birthday');
  const [theme, setTheme] = useState(initialTheme);
  const [overallTheme, setOverallTheme] = useState('birthday');
  const [messageTheme, setMessageTheme] = useState('scroll');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Media states
  const [photos, setPhotos] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [voiceAudioUrl, setVoiceAudioUrl] = useState('');
  const [music, setMusic] = useState('birthday');

  // Customization options
  const [cakeFlavor, setCakeFlavor] = useState('strawberry');
  const [cakeTiers, setCakeTiers] = useState(2);
  const [cakeText, setCakeText] = useState('');
  const [candlesCount, setCandlesCount] = useState(3);
  const [candleColor, setCandleColor] = useState('gold');
  const [balloonsCount, setBalloonsCount] = useState(6);
  const [boxColor, setBoxColor] = useState('purple');
  const [waxSealIcon, setWaxSealIcon] = useState('heart');

  // Modals & Submitting
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [persistedWishDraft, setPersistedWishDraft] = useState(null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [previewTestingMusic, setPreviewTestingMusic] = useState(false);

  const handleSelectOccasion = (occ) => {
    setOccasion(occ.id);
    setTheme(occ.defaultTheme);
    if (occ.id === 'love' || occ.id === 'anniversary') {
      setOverallTheme('romantic');
      setMessageTheme('love');
    } else if (occ.id === 'congrats') {
      setOverallTheme('congrats');
    } else if (occ.id === 'festival') {
      setOverallTheme('festival');
    } else if (occ.id === 'friendship') {
      setOverallTheme('friendship');
    } else {
      setOverallTheme('birthday');
    }

    if (!message || PRESET_MESSAGES[occasion]?.includes(message)) {
      setMessage(PRESET_MESSAGES[occ.id][0]);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      if (file.size > 8 * 1024 * 1024) {
        alert('File is too large (max 8MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos(prev => [...prev, reader.result].slice(0, 6));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('Audio file too large (max 15MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCustomAudioUrl(reader.result);
        setMusic('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setVoiceAudioUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        alert('Video file too large (max 25MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setVideoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTestMusic = (trackId) => {
    if (previewTestingMusic === trackId) {
      soundEngine.stopBgm();
      setPreviewTestingMusic(false);
    } else {
      if (trackId === 'custom' && customAudioUrl) {
        soundEngine.playCustomAudio(customAudioUrl);
      } else {
        soundEngine.playBgm(trackId);
      }
      setPreviewTestingMusic(trackId);
      setTimeout(() => {
        soundEngine.stopBgm();
        setPreviewTestingMusic(false);
      }, 5000);
    }
  };

  const buildPayload = () => ({
    recipientName: recipientName.trim() || 'Special Someone',
    senderName: senderName.trim() || 'A caring friend',
    occasion,
    theme,
    overallTheme,
    messageTheme,
    title: title.trim() || `A Special Celebration For ${recipientName.trim()}!`,
    message: message.trim() || PRESET_MESSAGES[occasion]?.[0] || 'Wishing you the very best!',
    photos,
    photoUrl: photos[0] || '',
    videoUrl,
    audioUrl: voiceAudioUrl || customAudioUrl,
    music,
    userEmail: currentUser?.email || null,
    interactiveOptions: {
      cakeFlavor,
      cakeTiers,
      cakeText: cakeText.trim() || recipientName.trim(),
      candlesCount,
      candleColor,
      balloonsCount,
      boxColor,
      waxSealIcon,
      poppersEnabled: true,
      soundEnabled: true,
      showConfetti: true,
    }
  });

  const handleProceedToCheckout = async (e) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      alert('Please enter recipient name');
      return;
    }
    soundEngine.stopBgm();
    setIsCreatingDraft(true);

    try {
      const payload = buildPayload();
      const result = await createWish(payload);
      if (result && result.wish) {
        setPersistedWishDraft(result.wish);
        setShowCheckout(true);
      } else {
        // Guaranteed local draft fallback
        const fallbackWish = {
          ...payload,
          id: 'w_' + Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
          reactions: []
        };
        setPersistedWishDraft(fallbackWish);
        setShowCheckout(true);
      }
    } catch (err) {
      console.warn('Draft creation error, using instant fallback:', err);
      const fallbackWish = {
        ...buildPayload(),
        id: 'w_' + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        reactions: []
      };
      setPersistedWishDraft(fallbackWish);
      setShowCheckout(true);
    } finally {
      setIsCreatingDraft(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8">
      
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={() => setShowMobilePreview(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <Smartphone size={14} />
          <span>Live Mobile Preview</span>
        </button>
      </div>

      <form onSubmit={handleProceedToCheckout} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-700/80 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-left pb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold mb-2">
            <Sparkles size={12} />
            <span>Interactive Celebration Studio</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Customize Your Magical Wish
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Personalize the interactive ceremonies, candles, balloons, music, and romantic themes.
          </p>
        </div>

        {/* Section 1: Occasion */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            1. Select Occasion
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {OCCASIONS.map((occ) => {
              const isSelected = occasion === occ.id;
              return (
                <button
                  type="button"
                  key={occ.id}
                  onClick={() => handleSelectOccasion(occ)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-pink-600/20 border-pink-500 text-white shadow-lg shadow-pink-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{occ.icon}</span>
                    {isSelected && <Check size={14} className="text-pink-400" />}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold block text-slate-100">{occ.label}</span>
                    <span className="text-[11px] text-slate-400 block line-clamp-1">{occ.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Overall Visual Theme (Romantic pink, Gold, etc.) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            2. Overall Atmosphere Theme
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {OVERALL_THEMES.map((th) => {
              const isSelected = overallTheme === th.id;
              return (
                <div
                  key={th.id}
                  onClick={() => setOverallTheme(th.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-900/40 to-purple-900/30 border-pink-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{th.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{th.desc}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-pink-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Recipient & Sender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Recipient Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah, Alex, Mom"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Your Name / Sender Signature
            </label>
            <input
              type="text"
              placeholder="e.g. David, Your Bestie, Mom & Dad"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        {/* Section 4: Interactive Theme */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            3. Choose Interactive Experience
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map((th) => {
              const isSelected = theme === th.id;
              const IconComp = th.icon;
              return (
                <button
                  type="button"
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/30 border-pink-400 text-white shadow-xl shadow-pink-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400'} shrink-0`}>
                    <IconComp size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-slate-100">{th.title}</span>
                      {isSelected && <Check size={14} className="text-pink-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {th.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Theme-specific Customizations: Cake, Candles, Balloons, Poppers */}
          {theme === 'cake3d' && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-pink-500/30 space-y-3.5">
              <span className="text-xs font-bold text-pink-300 block uppercase tracking-wider">
                🎂 3D Cake & Candle Customization
              </span>

              {/* Flavor */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'strawberry', label: '🍓 Strawberry' },
                  { id: 'chocolate', label: '🍫 Royal Choc' },
                  { id: 'vanilla', label: '🍦 Vanilla Sky' },
                  { id: 'redvelvet', label: '🍰 Red Velvet' },
                ].map(flv => (
                  <button
                    type="button"
                    key={flv.id}
                    onClick={() => setCakeFlavor(flv.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                      cakeFlavor === flv.id
                        ? 'bg-pink-600 text-white border-pink-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {flv.label}
                  </button>
                ))}
              </div>

              {/* Cake Tiers */}
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <span>Cake Tiers:</span>
                <div className="flex gap-2">
                  {[2, 3].map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setCakeTiers(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        cakeTiers === t ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {t} Tiers
                    </button>
                  ))}
                </div>
              </div>

              {/* Candles Count & Color */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-300 gap-2 pt-1">
                <span>Candles to Blow on Cake:</span>
                <div className="flex items-center gap-2">
                  {[1, 3, 5, 7, 9].map(num => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setCandlesCount(num)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        candlesCount === num ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {num} 🕯️
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Text on Frosting */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Text Piped in Frosting:</label>
                <input
                  type="text"
                  placeholder={recipientName || 'Name on Cake'}
                  value={cakeText}
                  onChange={(e) => setCakeText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          )}

          {/* Balloon & Popper Customization */}
          {theme === 'balloons' && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between text-xs text-slate-300">
              <span>Number of Balloons to Pop:</span>
              <div className="flex gap-2">
                {[3, 6, 9].map(num => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setBalloonsCount(num)}
                    className={`px-3 py-1 rounded-lg font-bold ${
                      balloonsCount === num ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {num} 🎈
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Message Card Styling */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            4. Message Card Theme
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {MESSAGE_THEMES.map((mt) => {
              const isSelected = messageTheme === mt.id;
              return (
                <div
                  key={mt.id}
                  onClick={() => setMessageTheme(mt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-pink-500 shadow-md text-white'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{mt.label}</span>
                    <span className="text-[10px] text-slate-400 block">{mt.desc}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-pink-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 6: Music & Audio Upload */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            5. Background Music & Sound
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {MUSIC_TRACKS.map((track) => {
              const isSelected = music === track.id;
              const isPlaying = previewTestingMusic === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => setMusic(track.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-pink-500 shadow-md'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Music size={16} className={isSelected ? 'text-pink-400' : 'text-slate-400'} />
                    <div className="truncate">
                      <span className="text-xs font-semibold block text-slate-200 truncate">{track.label}</span>
                      <span className="text-[10px] text-slate-400 block">{track.desc}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestMusic(track.id);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white shrink-0 ml-2"
                  >
                    <Volume2 size={13} className={isPlaying ? 'text-pink-400 animate-pulse' : ''} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upload Custom MP3 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Upload size={18} className="text-pink-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Upload Your Own Song / MP3</span>
                <span className="text-[10px] text-slate-400">Attach their favorite track or romantic background song</span>
              </div>
            </div>

            <label className="px-3.5 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-semibold cursor-pointer transition-colors shrink-0">
              <span>{customAudioUrl ? 'Audio Uploaded ✓' : 'Choose Audio File'}</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 7: Media (Photos, Video, Voice) */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            6. Personal Media: Photos, Video & Voice Greeting
          </label>

          {/* Photo Gallery Uploader */}
          <div>
            <span className="text-xs text-slate-400 mb-2 block">Photo Memories (Upload up to 6 photos):</span>
            <div className="flex flex-wrap gap-3">
              {photos.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-pink-500/50 shadow-md">
                  <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}

              {photos.length < 6 && (
                <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-700 hover:border-pink-500 flex flex-col items-center justify-center text-slate-400 hover:text-pink-300 bg-slate-900/50 cursor-pointer transition-all">
                  <Plus size={20} />
                  <span className="text-[10px] font-medium mt-1">Add Photo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Video Greeting */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Video size={18} className="text-indigo-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Upload Video Greeting Clip</span>
                <span className="text-[10px] text-slate-400">MP4 or WebM video memory compilation</span>
              </div>
            </div>

            <label className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold cursor-pointer transition-colors shrink-0">
              <span>{videoUrl ? 'Video Attached ✓' : 'Upload Video File'}</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Voice Greeting */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Mic size={18} className="text-pink-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Personal Voice Message</span>
                <span className="text-[10px] text-slate-400">Attach a spoken audio message</span>
              </div>
            </div>

            <label className="px-3.5 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-semibold cursor-pointer transition-colors shrink-0">
              <span>{voiceAudioUrl ? 'Voice Note Attached ✓' : 'Upload Voice Note'}</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleVoiceUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 8: Personal Message */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              7. Personal Heartfelt Message
            </label>
            <span className="text-[11px] text-slate-400">
              {message.length} characters
            </span>
          </div>

          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your sweet personal message here..."
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors leading-relaxed"
          />

          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-medium block">
              💡 Or click a pre-written message to insert:
            </span>
            <div className="flex flex-col gap-1.5">
              {PRESET_MESSAGES[occasion]?.map((preset, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setMessage(preset)}
                  className="text-left text-xs text-slate-300 hover:text-pink-300 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-colors truncate"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setShowMobilePreview(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-pink-500/40 text-pink-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Smartphone size={16} />
            <span>Preview in Mobile Mockup</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isCreatingDraft}
              className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isCreatingDraft ? (
                <span>Generating Wish Link...</span>
              ) : (
                <>
                  <span>Generate Wish Link & Review</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Mobile Simulator Modal */}
      {showMobilePreview && (
        <MobileSimulator
          wish={buildPayload()}
          onClose={() => setShowMobilePreview(false)}
        />
      )}

      {/* Checkout Modal (The ONLY place where 48 hours is presented!) */}
      {showCheckout && persistedWishDraft && (
        <CheckoutModal
          wishDraft={persistedWishDraft}
          currentUser={currentUser}
          onPaymentSuccess={(finalWish) => {
            setShowCheckout(false);
            onWishCreated(finalWish);
          }}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
