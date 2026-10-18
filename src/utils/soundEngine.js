// Web Audio API Synthesizer & Sound FX Engine + Custom Audio File Support

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.currentTrack = null;
    this.isPlayingBgm = false;
    this.masterGain = null;
    this.customAudioEl = null;
    this.bgmTimeout = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(mute ? 0 : 0.7, this.ctx.currentTime);
    }
    if (this.customAudioEl) {
      this.customAudioEl.muted = mute;
    }
  }

  // Play custom uploaded audio file (Data URL or HTTP URL)
  playCustomAudio(url) {
    this.stopBgm();
    if (!url) return;
    try {
      if (!this.customAudioEl) {
        this.customAudioEl = new Audio();
      }
      this.customAudioEl.src = url;
      this.customAudioEl.loop = true;
      this.customAudioEl.muted = this.isMuted;
      this.customAudioEl.play().catch(e => console.log('Custom audio autoplay prevented:', e));
      this.isPlayingBgm = true;
      this.currentTrack = 'custom';
    } catch (e) {
      console.warn('Could not play custom audio:', e);
    }
  }

  // --- Sound Effects ---

  // Scratch card sound
  playScratch() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Balloon Pop
  playPop() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Candle Blow: gentle wind whoosh + extinguish sparkle
  playCandleBlow() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * (i / bufferSize));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);

    setTimeout(() => {
      this.playNote(880, 0.25, 'sine', 0.2);
    }, 200);
  }

  // Crowd cheer / fanfare sparkle
  playCheer() {
    if (this.isMuted) return;
    this.init();
    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 0.6, 'triangle', 0.25);
      }, idx * 90);
    });
  }

  // Box Open: ribbon shimmer
  playBoxOpen() {
    if (this.isMuted) return;
    this.init();
    const notes = [392, 523, 659, 784, 1046];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playNote(freq, 0.35, 'sine', 0.18);
      }, i * 60);
    });
  }

  // Wax Seal Break: snap sound
  playSealBreak() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Firework launch + boom
  playFirework() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(300, now);
    whistle.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
    whistleGain.gain.setValueAtTime(0.2, now);
    whistleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    whistle.connect(whistleGain);
    whistleGain.connect(this.masterGain);
    whistle.start(now);
    whistle.stop(now + 0.32);

    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const bNow = this.ctx.currentTime;
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'triangle';
      boom.frequency.setValueAtTime(120, bNow);
      boom.frequency.exponentialRampToValueAtTime(30, bNow + 0.5);
      boomGain.gain.setValueAtTime(0.6, bNow);
      boomGain.gain.exponentialRampToValueAtTime(0.01, bNow + 0.5);
      boom.connect(boomGain);
      boomGain.connect(this.masterGain);
      boom.start(bNow);
      boom.stop(bNow + 0.52);
    }, 280);
  }

  // Single note helper
  playNote(frequency, duration = 0.3, type = 'sine', volume = 0.2) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration);
  }

  // --- Background Melodies ---
  playBgm(trackName = 'birthday', customAudioUrl = null) {
    this.stopBgm();

    if (trackName === 'custom' && customAudioUrl) {
      this.playCustomAudio(customAudioUrl);
      return;
    }

    this.init();
    this.isPlayingBgm = true;
    this.currentTrack = trackName;

    let melody = [];
    let tempo = 280;

    if (trackName === 'birthday') {
      melody = [
        { f: 261.6, d: 1 }, { f: 261.6, d: 1 }, { f: 293.7, d: 2 }, { f: 261.6, d: 2 }, { f: 349.2, d: 2 }, { f: 329.6, d: 4 },
        { f: 261.6, d: 1 }, { f: 261.6, d: 1 }, { f: 293.7, d: 2 }, { f: 261.6, d: 2 }, { f: 392.0, d: 2 }, { f: 349.2, d: 4 },
        { f: 261.6, d: 1 }, { f: 261.6, d: 1 }, { f: 523.3, d: 2 }, { f: 440.0, d: 2 }, { f: 349.2, d: 2 }, { f: 329.6, d: 2 }, { f: 293.7, d: 3 },
        { f: 466.2, d: 1 }, { f: 466.2, d: 1 }, { f: 440.0, d: 2 }, { f: 349.2, d: 2 }, { f: 392.0, d: 2 }, { f: 349.2, d: 4 }
      ];
      tempo = 240;
    } else if (trackName === 'romantic') {
      melody = [
        { f: 261.6, d: 2 }, { f: 329.6, d: 2 }, { f: 392.0, d: 2 }, { f: 523.3, d: 3 },
        { f: 220.0, d: 2 }, { f: 261.6, d: 2 }, { f: 329.6, d: 2 }, { f: 440.0, d: 3 },
        { f: 174.6, d: 2 }, { f: 220.0, d: 2 }, { f: 261.6, d: 2 }, { f: 349.2, d: 3 },
        { f: 196.0, d: 2 }, { f: 246.9, d: 2 }, { f: 293.7, d: 2 }, { f: 392.0, d: 4 }
      ];
      tempo = 280;
    } else if (trackName === 'celebration' || trackName === 'neon') {
      melody = [
        { f: 392.0, d: 1 }, { f: 523.3, d: 1 }, { f: 659.3, d: 1 }, { f: 784.0, d: 3 },
        { f: 659.3, d: 1 }, { f: 784.0, d: 4 },
        { f: 523.3, d: 1 }, { f: 659.3, d: 1 }, { f: 784.0, d: 1 }, { f: 1046.5, d: 4 }
      ];
      tempo = 220;
    } else {
      melody = [
        { f: 440.0, d: 3 }, { f: 554.4, d: 2 }, { f: 659.3, d: 2 }, { f: 880.0, d: 4 },
        { f: 659.3, d: 2 }, { f: 554.4, d: 2 }, { f: 440.0, d: 4 }
      ];
      tempo = 320;
    }

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isPlayingBgm) return;
      const note = melody[noteIdx];
      this.playNote(note.f, (note.d * tempo) / 1000 * 1.2, 'sine', 0.15);
      const waitTime = note.d * tempo;
      noteIdx = (noteIdx + 1) % melody.length;
      this.bgmTimeout = setTimeout(playNext, waitTime);
    };

    playNext();
  }

  stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
    if (this.customAudioEl) {
      try {
        this.customAudioEl.pause();
        this.customAudioEl.currentTime = 0;
      } catch (e) {}
    }
  }
}

export const soundEngine = new SoundEngine();
