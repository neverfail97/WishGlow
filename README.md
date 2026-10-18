# ✨ WishGlow — 48-Hour Interactive Wishes & Celebrations Platform

**WishGlow** is a modern, interactive greetings and wishes web application that empowers users to craft personalized, high-aesthetic celebrations (Birthday, Anniversary, Romance, Success/Congratulations, Festivals, Friendship) that can be sent to recipients with a **strict 48-hour limited lifespan**.

Inspired by:
- [bdaycake.com/classy-puff-49](https://bdaycake.com/classy-puff-49) (Interactive cake with custom recipient name piped onto frosting, glowing candles with tap-to-blowout physics, smoke puffs & cheering)
- [wishprise.online](https://wishprise.online/) (3D gift boxes that shake and unwrap with ribbon untying, balloon popping challenges, and suspense reveals)
- [2-luv.com](https://www.2-luv.com/en/create/birthday) & [sendwishonline.com](https://sendwishonline.com/en/group-cards/happy-birthday-cards) (Wax-sealed love envelopes, emotional handwritten typography, and greeting cards)
- [wishhappybdayto.me](https://www.wishhappybdayto.me/) (Dynamic particle confetti, audio synthesizer melodies, and personalized photo frames)

---

## 🌟 Key Features

### 1. ⏱️ 48-Hour Ephemeral Lifespan Guarantee
- **Time-Capped Validity**: Every greeting link is created with an automatic 48-hour expiration timestamp (`expiresAt = createdAt + 48 hours`).
- **Live Countdown Badge**: Recipients see a sleek real-time countdown timer (`47h 59m 12s remaining`) with progress tracking.
- **Graceful Expired State**: When opened after 48 hours, the link cleanly transforms into an **Expired Keepsake Screen**, respectfully preserving the memory while keeping the fleeting charm of the celebration intact.

### 2. 🎨 5 Immersive Interactive Themes
1. **🎂 3D Cake & Candle Blowout**:
   - Recipient's name iced onto the cake frosting in calligraphy.
   - Flickering candle flames with interactive tap-to-blow physics.
   - Realistic smoke particles and ascending crowd applause sound upon extinguishing all candles!
2. **🎁 3D Mystery Gift Box**:
   - Luxury wrapped gift box with golden ribbon and bow.
   - "Tap to unwrap" ribbon untie animation, shaking box lid, light rays and confetti blast reveal.
3. **💌 Royal Wax Seal & Love Envelope**:
   - Vintage paper stationery sealed with royal crimson wax.
   - Tap wax seal to break with crisp snap sound, revealing unfolding letter and floating heart particles.
4. **🎈 Carnival Balloon Popping**:
   - 6 bobbing colorful helium balloons floating on screen.
   - Tap each balloon to POP it with realistic balloon pop audio synthesis.
   - Unlocks the secret greeting card when all are popped.
5. **🎆 Midnight Sky Fireworks**:
   - Interactive night sky canvas. Tap anywhere to launch multicolored exploding fireworks and golden sparklers.

### 3. 🎵 Built-In Web Audio Melodic Synthesizer
- **Zero External Audio Dependencies**: 100% self-contained audio synthesizer that plays reliably offline without broken CDN audio links.
- **Melodies**:
  - *Happy Birthday Chimes* (polyphonic music box)
  - *Romantic Piano Serenade* (emotional arpeggio chords)
  - *Grand Celebration Fanfare* (upbeat triumphal brass)
  - *Starlight Ambient Harp* (dreamy celestial chimes)
- **Sound Effects (SFX)**:
  - Balloon pop sound
  - Candle blow wind whoosh + extinguish sparkle
  - Ribbon unwrap shimmer
  - Wax seal snap
  - Whistling fireworks boom
  - Confetti cracker burst

### 4. 💌 Two-Way Instant Love & Reactions
- Recipients can instantly send love back with 1-click reaction buttons (❤️ Love it, 🥂 Cheers, 🤗 Big Hug, ✨ Made my day).
- Recipients can write a quick thank-you note that the sender sees in real time!

### 5. 🚀 Easy Multi-Channel Sharing
- **1-Click Copy Link**: Share directly via chat or email.
- **1-Click WhatsApp Share**: Pre-fills a festive message with recipient's name and link.
- **Dynamic QR Code**: Generates scannable QR code for phone cameras.
- **Preview Mode**: Sender can preview the exact receiver ceremony before sending.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, QRCode, Web Audio API.
- **Backend API**: Express server with 48h expiration validator, persistent JSON/SQLite store, and static file delivery.
- **Resilient Fallback**: Includes Base64 compressed payload encoding fallback so wishes can be viewed across different devices and networks.

---

## 🚀 Running WishGlow

### Quick Start:
```bash
# Navigate to the project directory
cd C:\Users\Admin\.gemini\antigravity\scratch\wishglow

# Run the full-stack server (Port 3001)
npm run start

# Or run Vite dev server with hot reload (Port 5173)
npm run dev
```

### URLs:
- **Web App**: [http://localhost:5173](http://localhost:5173) or [http://localhost:3001](http://localhost:3001)
- **API Health**: `http://localhost:3001/api/presets`
