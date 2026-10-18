import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import WishBuilder from './components/WishBuilder';
import ReceiverView from './components/ReceiverView';
import ShareModal from './components/ShareModal';
import AuthModal from './components/AuthModal';
import AmbientFloatingElements from './components/CelebrationEffects';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState({ view: 'home', wishId: null, data: null });
  const [createdWish, setCreatedWish] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [builderInitialTheme, setBuilderInitialTheme] = useState('cake3d');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('wishglow_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // Robust URL parser supporting both /w/:id and #/w/:id across all devices
  useEffect(() => {
    function parseRoute() {
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';
      const urlParams = new URLSearchParams(window.location.search);
      let queryData = urlParams.get('data') || urlParams.get('wdata');

      let targetId = null;

      if (hash.startsWith('#/w/')) {
        const raw = hash.replace('#/w/', '');
        const parts = raw.split('?');
        targetId = parts[0];
        const hashParams = new URLSearchParams(parts[1] || '');
        if (!queryData) queryData = hashParams.get('data') || hashParams.get('wdata');
      } else if (path.startsWith('/w/')) {
        const raw = path.replace('/w/', '');
        targetId = raw.split('?')[0].split('#')[0];
      }

      if (targetId) {
        // Clean ID (strip trailing slashes)
        const cleanId = targetId.replace(/\/$/, '').trim();
        setCurrentRoute({ view: 'receiver', wishId: cleanId, data: queryData });
      } else if (hash === '#/create') {
        setCurrentRoute({ view: 'create', wishId: null, data: null });
      } else {
        setCurrentRoute({ view: 'home', wishId: null, data: null });
      }
    }

    parseRoute();
    window.addEventListener('hashchange', parseRoute);
    window.addEventListener('popstate', parseRoute);
    return () => {
      window.removeEventListener('hashchange', parseRoute);
      window.removeEventListener('popstate', parseRoute);
    };
  }, []);

  const navigateTo = (view, wishId = null, data = null) => {
    if (view === 'receiver' && wishId) {
      window.location.hash = `#/w/${wishId}${data ? `?data=${data}` : ''}`;
    } else if (view === 'create') {
      window.location.hash = '#/create';
    } else {
      window.location.hash = '';
    }
    setCurrentRoute({ view, wishId, data });
  };

  const handleStartCreateWithTheme = (themeId = 'cake3d') => {
    setBuilderInitialTheme(themeId || 'cake3d');
    navigateTo('create');
  };

  const handleWishCreated = (wish) => {
    setCreatedWish(wish);
    setShowShareModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('wishglow_user');
    setCurrentUser(null);
  };

  // Receiver view
  if (currentRoute.view === 'receiver') {
    return (
      <ReceiverView
        wishId={currentRoute.wishId}
        queryData={currentRoute.data}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onGoHome={() => navigateTo('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-pink-500 selection:text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <AmbientFloatingElements theme="cake3d" />

      {/* Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onGoHome={() => navigateTo('home')}
        onStartCreate={() => handleStartCreateWithTheme('cake3d')}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {currentRoute.view === 'create' ? (
          <WishBuilder
            initialTheme={builderInitialTheme}
            currentUser={currentUser}
            onWishCreated={handleWishCreated}
            onCancel={() => navigateTo('home')}
          />
        ) : (
          <HomeHero
            onStartCreate={handleStartCreateWithTheme}
            onSelectWish={(id) => navigateTo('receiver', id)}
          />
        )}
      </main>

      {/* Auth Modal for 5-Day Memory Retention */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* Share Modal popup */}
      {showShareModal && createdWish && (
        <ShareModal
          wish={createdWish}
          onClose={() => setShowShareModal(false)}
          onPreviewReceiver={() => {
            setShowShareModal(false);
            navigateTo('receiver', createdWish.id);
          }}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-xs text-slate-500 border-t border-slate-800/60 mt-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>WishGlow · Interactive Celebrations & Digital Wishes</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>🎂 3D Cake</span>
            <span>🎁 Mystery Box</span>
            <span>💌 Wax Seal</span>
            <span>🎫 Scratch Card</span>
            <span>🎬 Video Reel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
