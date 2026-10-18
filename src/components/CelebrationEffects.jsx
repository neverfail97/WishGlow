import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#a855f7', '#6366f1', '#3b82f6', '#fbbf24']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function fireSchoolPride() {
  const end = Date.now() + 2 * 1000;
  const colors = ['#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

export default function AmbientFloatingElements({ theme = 'cake3d' }) {
  // Generate random floating elements based on theme
  const items = React.useMemo(() => {
    let icons = ['✨', '⭐', '🎈', '💖', '🎉'];
    if (theme === 'envelope') icons = ['💖', '💌', '🌹', '✨', '💕', '🕊️'];
    if (theme === 'cake3d') icons = ['🎂', '✨', '🎈', '🎉', '🎁', '🍰'];
    if (theme === 'fireworks') icons = ['✨', '🎆', '⭐', '🎇', '💫', '🌟'];
    if (theme === 'balloons') icons = ['🎈', '🎈', '🎈', '✨', '🎉', '🎊'];

    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      left: Math.random() * 96 + '%',
      duration: 6 + Math.random() * 8 + 's',
      delay: Math.random() * 5 + 's',
      size: 16 + Math.random() * 22 + 'px',
      opacity: 0.2 + Math.random() * 0.5
    }));
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute select-none animate-float"
          style={{
            left: item.left,
            bottom: '-40px',
            fontSize: item.size,
            opacity: item.opacity,
            animationDuration: item.duration,
            animationDelay: item.delay,
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))'
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}
