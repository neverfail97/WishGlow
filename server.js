import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Graceful JSON parse error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next();
});

// Supabase backend client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log('Connected to Supabase PostgreSQL database');
} else {
  console.log('Running in local JSON file mode (Supabase credentials not detected)');
}

// Ensure local data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'wishes.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
}

function readLocalWishes() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    return {};
  }
}

function writeLocalWishes(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function readLocalUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (e) {
    return {};
  }
}

function writeLocalUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// Time constants
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000; // 5 days memory retention for logged in users

// Occasion presets
const OCCASION_PRESETS = {
  birthday: {
    title: "Birthday Bash",
    icon: "🎂",
    defaultTheme: "cake3d",
    bgStyle: "from-pink-900/60 via-purple-950/80 to-slate-950",
    defaultMessages: [
      "Wishing you another year filled with great adventures, boundless laughter, and dreams turned into reality!",
      "Happy Birthday! May your day be as sparkling, radiant, and wonderful as you are to everyone around you.",
      "Cheers to you! Blow out the candles and make the biggest wish of your life today."
    ]
  },
  anniversary: {
    title: "Love & Anniversary",
    icon: "💍",
    defaultTheme: "envelope",
    bgStyle: "from-rose-950/90 via-pink-950/80 to-slate-950",
    defaultMessages: [
      "Every love story is beautiful, but ours is my absolute favorite. Happy Anniversary, my heart!",
      "To another incredible year of making unforgettable memories, holding hands, and growing together in love.",
      "Happy Anniversary! May the love you share keep blooming sweeter and stronger with every passing season."
    ]
  },
  love: {
    title: "Romantic Surprise",
    icon: "💖",
    defaultTheme: "envelope",
    bgStyle: "from-rose-950/90 via-fuchsia-950/80 to-slate-950",
    defaultMessages: [
      "Just a reminder that you are the most special person in my universe. Sending you all my love today and forever!",
      "In a sea of people, my eyes will always search for you. You brighten every single day.",
      "You make my world infinitely warmer, happier, and brighter. Here's a little surprise just for you!"
    ]
  },
  congrats: {
    title: "Congratulations & Success",
    icon: "🏆",
    defaultTheme: "fireworks",
    bgStyle: "from-amber-950/80 via-yellow-950/60 to-slate-950",
    defaultMessages: [
      "Huge congratulations on this huge milestone! Your hard work, grit, and passion made it happen.",
      "The sky is not the limit, it's just your starting point. So proud of you and cheering for your next victory!",
      "Celebrate your triumph! You truly deserve every bit of this success."
    ]
  },
  festival: {
    title: "Festive Celebration",
    icon: "✨",
    defaultTheme: "fireworks",
    bgStyle: "from-indigo-950/80 via-purple-950/60 to-slate-950",
    defaultMessages: [
      "Wishing you and your family abundant joy, light, prosperity, and peace this festive season!",
      "May this auspicious celebration illuminate your home with warmth and fill your hearts with endless blessings.",
      "Sending festive cheer and radiant good vibes your way. Let the celebrations begin!"
    ]
  },
  friendship: {
    title: "Best Friend / Gratitude",
    icon: "🎉",
    defaultTheme: "balloons",
    bgStyle: "from-cyan-950/80 via-blue-950/60 to-slate-950",
    defaultMessages: [
      "To the friend who knows all my secrets and still loves me anyway! Thanks for being an absolute legend.",
      "Life is 1000x sweeter with you by my side. Cheers to our unbreakable bond and countless crazy memories!",
      "Just wanted to drop this little smile in your day. Thank you for always being you!"
    ]
  }
};

app.get('/api/presets', (req, res) => {
  res.json({ success: true, presets: OCCASION_PRESETS });
});

// ================= AUTHENTICATION ENDPOINTS ================= //

// POST Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readLocalUsers();

    if (users[cleanEmail]) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const userId = 'u_' + crypto.randomBytes(6).toString('hex');
    const newUser = {
      id: userId,
      name: name ? name.trim() : cleanEmail.split('@')[0],
      email: cleanEmail,
      password: password || 'default123',
      savedMemories: [],
      createdAt: new Date().toISOString()
    };

    users[cleanEmail] = newUser;
    writeLocalUsers(users);

    // Sync to Supabase if available
    if (supabase) {
      try {
        await supabase.from('users').upsert({
          id: userId,
          name: newUser.name,
          email: cleanEmail,
          password_hash: newUser.password,
          created_at: newUser.createdAt
        });
      } catch (err) {
        console.warn('Supabase auth sync warning:', err);
      }
    }

    res.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        has5DayMemory: true
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readLocalUsers();
    let user = users[cleanEmail];

    // Check Supabase if not found locally
    if (!user && supabase) {
      const { data } = await supabase.from('users').select('*').eq('email', cleanEmail).single();
      if (data) {
        user = {
          id: data.id,
          name: data.name,
          email: data.email,
          password: data.password_hash || '',
          savedMemories: [],
          createdAt: data.created_at
        };
        users[cleanEmail] = user;
        writeLocalUsers(users);
      }
    }

    if (!user) {
      // Auto-register convenience for seamless user experience
      const userId = 'u_' + crypto.randomBytes(6).toString('hex');
      user = {
        id: userId,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        password: password || 'default123',
        savedMemories: [],
        createdAt: new Date().toISOString()
      };
      users[cleanEmail] = user;
      writeLocalUsers(users);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        has5DayMemory: true
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ================= WISHES & MEMORIES ENDPOINTS ================= //

// POST create wish
app.post('/api/wishes', async (req, res) => {
  try {
    const {
      recipientName,
      senderName,
      occasion = 'birthday',
      theme = 'cake3d',
      message = '',
      title = '',
      photoUrl = '',
      photos = [],
      videoUrl = '',
      audioUrl = '',
      music = 'birthday',
      interactiveOptions = {},
      customOptions = {},
      overallTheme = '',
      messageTheme = 'scroll',
      userEmail = null
    } = req.body;

    if (!recipientName || !recipientName.trim()) {
      return res.status(400).json({ error: 'Recipient name is required' });
    }

    const id = 'w_' + crypto.randomBytes(6).toString('hex');
    const now = Date.now();
    
    // If user is logged in, grant 5-day memory retention (120 hours) instead of 48 hours
    const isUserLoggedIn = Boolean(userEmail && userEmail.trim());
    const retentionMs = isUserLoggedIn ? FIVE_DAYS_MS : FORTY_EIGHT_HOURS_MS;
    const expiresAt = new Date(now + retentionMs).toISOString();

    const photoList = photos && photos.length > 0 ? photos : (photoUrl ? [photoUrl] : []);

    const newWish = {
      id,
      recipientName: recipientName.trim(),
      senderName: senderName ? senderName.trim() : 'Someone special',
      occasion,
      theme,
      overallTheme: overallTheme || occasion,
      messageTheme: messageTheme || 'scroll',
      message,
      title: title.trim() || `A Special Surprise For ${recipientName.trim()}!`,
      photoUrl: photoList[0] || '',
      photos: photoList,
      videoUrl: videoUrl || '',
      audioUrl: audioUrl || '',
      music: music || 'birthday',
      interactiveOptions: {
        candlesCount: interactiveOptions.candlesCount || 3,
        candleColor: interactiveOptions.candleColor || 'gold',
        balloonsCount: interactiveOptions.balloonsCount || 6,
        cakeFlavor: interactiveOptions.cakeFlavor || 'strawberry',
        cakeTiers: interactiveOptions.cakeTiers || 2,
        cakeText: interactiveOptions.cakeText || recipientName.trim(),
        boxColor: interactiveOptions.boxColor || 'purple',
        waxSealIcon: interactiveOptions.waxSealIcon || 'heart',
        poppersEnabled: interactiveOptions.poppersEnabled !== false,
        showConfetti: interactiveOptions.showConfetti !== false,
        soundEnabled: interactiveOptions.soundEnabled !== false,
        ...customOptions
      },
      reactions: [],
      isPaid: true,
      has5DayMemory: isUserLoggedIn,
      userEmail: cleanOrNull(userEmail),
      createdAt: new Date(now).toISOString(),
      expiresAt,
      viewsCount: 0
    };

    // Save to local JSON
    const localData = readLocalWishes();
    localData[id] = newWish;
    writeLocalWishes(localData);

    // Sync to Supabase
    if (supabase) {
      try {
        await supabase.from('wishes').upsert({
          id: newWish.id,
          recipient_name: newWish.recipientName,
          sender_name: newWish.senderName,
          occasion: newWish.occasion,
          theme: newWish.theme,
          title: newWish.title,
          message: newWish.message,
          photos: newWish.photos,
          video_url: newWish.videoUrl,
          audio_url: newWish.audioUrl,
          music_track: newWish.music,
          custom_options: newWish.interactiveOptions,
          is_paid: true,
          payment_plan: isUserLoggedIn ? '5day_memory' : '48h_standard',
          created_at: newWish.createdAt,
          expires_at: newWish.expiresAt
        });
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      }
    }

    res.json({
      success: true,
      id,
      wish: newWish,
      expiresAt,
      shareUrl: `/w/${id}`
    });
  } catch (err) {
    console.error('Error creating wish:', err);
    res.status(500).json({ error: 'Failed to create wish' });
  }
});

// POST Checkout & Payment Verification
app.post('/api/checkout/verify', async (req, res) => {
  try {
    const { wishId, planId, paymentMethod, promoCode, userEmail } = req.body;
    const cleanId = cleanWishId(wishId);
    let wish = null;

    const localData = readLocalWishes();
    if (localData[cleanId]) {
      wish = localData[cleanId];
    }

    if (!wish && supabase) {
      const { data } = await supabase.from('wishes').select('*').eq('id', cleanId).single();
      if (data) wish = data;
    }

    if (!wish) {
      return res.status(404).json({ error: 'Wish not found' });
    }

    const now = Date.now();
    const is5DayUser = Boolean(userEmail && userEmail.trim()) || planId === 'lifetime' || wish.has5DayMemory;
    const retentionMs = is5DayUser ? FIVE_DAYS_MS : FORTY_EIGHT_HOURS_MS;
    const expiresAt = new Date(now + retentionMs).toISOString();

    if (localData[cleanId]) {
      localData[cleanId].isPaid = true;
      localData[cleanId].paymentPlan = planId || '48h_standard';
      localData[cleanId].has5DayMemory = is5DayUser;
      localData[cleanId].createdAt = new Date(now).toISOString();
      localData[cleanId].expiresAt = expiresAt;
      writeLocalWishes(localData);
    }

    if (supabase) {
      try {
        await supabase.from('wishes').update({
          is_paid: true,
          payment_plan: planId || '48h_standard',
          created_at: new Date(now).toISOString(),
          expires_at: expiresAt
        }).eq('id', cleanId);
      } catch (e) {
        console.warn('Supabase payment update warning:', e);
      }
    }

    res.json({
      success: true,
      paid: true,
      wishId: cleanId,
      expiresAt,
      has5DayMemory: is5DayUser,
      message: 'Payment completed. Link active!'
    });
  } catch (e) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// POST Claim / Preserve Memory with Login (Extends to 5 Days!)
app.post('/api/wishes/:id/claim-memory', async (req, res) => {
  try {
    const cleanId = cleanWishId(req.params.id);
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const localData = readLocalWishes();
    const wish = localData[cleanId];

    if (!wish) {
      return res.status(404).json({ error: 'Wish not found' });
    }

    // Extend to 5 days from creation
    const createdTime = new Date(wish.createdAt).getTime();
    const newExpiresAt = new Date(createdTime + FIVE_DAYS_MS).toISOString();

    wish.has5DayMemory = true;
    wish.expiresAt = newExpiresAt;
    writeLocalWishes(localData);

    // Also record in user's savedMemories
    const users = readLocalUsers();
    const cleanEmail = email.trim().toLowerCase();
    if (users[cleanEmail]) {
      users[cleanEmail].savedMemories = users[cleanEmail].savedMemories || [];
      if (!users[cleanEmail].savedMemories.includes(cleanId)) {
        users[cleanEmail].savedMemories.push(cleanId);
      }
      writeLocalUsers(users);
    }

    res.json({
      success: true,
      message: 'Memory extended for 5 days in your account!',
      expiresAt: newExpiresAt,
      has5DayMemory: true
    });
  } catch (e) {
    res.status(500).json({ error: 'Could not preserve memory' });
  }
});

// GET wish by ID
app.get('/api/wishes/:id', async (req, res) => {
  try {
    const cleanId = cleanWishId(req.params.id);
    let wish = null;

    // Try local JSON first
    const localData = readLocalWishes();
    if (localData[cleanId]) {
      wish = localData[cleanId];
    }

    // If not found locally, fetch from Supabase
    if (!wish && supabase) {
      const { data, error } = await supabase.from('wishes').select('*').eq('id', cleanId).single();
      if (data && !error) {
        wish = {
          id: data.id,
          recipientName: data.recipient_name,
          senderName: data.sender_name,
          occasion: data.occasion,
          theme: data.theme,
          title: data.title,
          message: data.message,
          photos: data.photos || [],
          photoUrl: (data.photos && data.photos[0]) || '',
          videoUrl: data.video_url || '',
          audioUrl: data.audio_url || '',
          music: data.music_track || 'birthday',
          interactiveOptions: data.custom_options || {},
          isPaid: data.is_paid,
          createdAt: data.created_at,
          expiresAt: data.expires_at,
          viewsCount: data.views_count
        };
      }
    }

    if (!wish) {
      return res.status(404).json({ error: 'Wish not found or has been removed' });
    }

    const now = Date.now();
    const expireTime = new Date(wish.expiresAt).getTime();
    const isExpired = now > expireTime;

    if (isExpired) {
      return res.json({
        success: true,
        expired: true,
        recipientName: wish.recipientName,
        senderName: wish.senderName,
        occasion: wish.occasion,
        createdAt: wish.createdAt,
        expiredAt: wish.expiresAt,
        has5DayMemory: wish.has5DayMemory || false,
        message: 'This celebration has concluded its active period.'
      });
    }

    wish.viewsCount = (wish.viewsCount || 0) + 1;
    if (localData[cleanId]) {
      localData[cleanId].viewsCount = wish.viewsCount;
      writeLocalWishes(localData);
    }

    const remainingMs = Math.max(0, expireTime - now);

    res.json({
      success: true,
      expired: false,
      wish,
      remainingMs,
      has5DayMemory: wish.has5DayMemory || false
    });
  } catch (err) {
    console.error('Error fetching wish:', err);
    res.status(500).json({ error: 'Failed to retrieve wish' });
  }
});

// POST reaction
app.post('/api/wishes/:id/reactions', async (req, res) => {
  try {
    const cleanId = cleanWishId(req.params.id);
    const { type = 'heart', senderName = 'Recipient', note = '' } = req.body;

    const reaction = {
      id: 'r_' + crypto.randomBytes(4).toString('hex'),
      type,
      senderName,
      note,
      timestamp: new Date().toISOString()
    };

    const localData = readLocalWishes();
    if (localData[cleanId]) {
      localData[cleanId].reactions = localData[cleanId].reactions || [];
      localData[cleanId].reactions.push(reaction);
      writeLocalWishes(localData);
    }

    if (supabase) {
      try {
        await supabase.from('reactions').insert({
          id: reaction.id,
          wish_id: cleanId,
          reaction_type: type,
          sender_name: senderName,
          note: note
        });
      } catch (e) {
        console.warn('Supabase reaction sync error:', e);
      }
    }

    res.json({ success: true, reaction });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post reaction' });
  }
});

// Helper functions
function cleanWishId(rawId) {
  if (!rawId) return '';
  return String(rawId).replace(/^\/w\//, '').replace(/\/$/, '').split('?')[0].split('#')[0].trim();
}

function cleanOrNull(str) {
  return str && str.trim() ? str.trim().toLowerCase() : null;
}

// Serve static frontend in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Bind to 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`WishGlow server running on http://0.0.0.0:${PORT}`);
});
