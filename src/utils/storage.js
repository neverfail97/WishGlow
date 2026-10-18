// Storage & API synchronization with 48-hour expiration logic

const API_BASE = '/api';

// Helper for non-blocking fetch with timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 2500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export async function createWish(wishData) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/wishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wishData),
    }, 3000);

    if (res && res.ok) {
      const data = await res.json();
      saveToLocalHistory(data.wish);
      return data;
    }
  } catch (err) {
    console.warn('Backend API request timed out or unavailable, using fast local draft:', err);
  }

  // Fallback: Local synthesis & URL encode (guaranteed instant response)
  const now = Date.now();
  const expiryHours = Math.min(Math.max(Number(wishData.customExpiryHours) || 48, 1), 48);
  const expiresAt = new Date(now + expiryHours * 60 * 60 * 1000).toISOString();
  const id = 'w_' + Math.random().toString(36).substring(2, 9);

  const newWish = {
    ...wishData,
    id,
    createdAt: new Date(now).toISOString(),
    expiresAt,
    expiryHours,
    reactions: [],
  };

  saveToLocalHistory(newWish);

  // Encode for URL share
  const encoded = encodeWishData(newWish);
  return {
    success: true,
    id,
    wish: newWish,
    expiresAt,
    shareUrl: `/w/${id}?data=${encoded}`
  };
}

export async function getWish(id, queryData = null) {
  // If queryData is provided, check if valid
  if (queryData) {
    const decoded = decodeWishData(queryData);
    if (decoded) {
      const now = Date.now();
      const expireTime = new Date(decoded.expiresAt).getTime();
      const isExpired = now > expireTime;
      return {
        success: true,
        expired: isExpired,
        wish: decoded,
        remainingMs: Math.max(0, expireTime - now),
        recipientName: decoded.recipientName,
        senderName: decoded.senderName,
        occasion: decoded.occasion,
        expiredAt: decoded.expiresAt
      };
    }
  }

  // Try API with quick timeout
  try {
    const res = await fetchWithTimeout(`${API_BASE}/wishes/${id}`, {}, 2500);
    if (res && res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch from API, checking local storage', e);
  }

  // Check local history
  const localList = getLocalHistory();
  const found = localList.find(w => w.id === id);
  if (found) {
    const now = Date.now();
    const expireTime = new Date(found.expiresAt).getTime();
    const isExpired = now > expireTime;
    return {
      success: true,
      expired: isExpired,
      wish: found,
      remainingMs: Math.max(0, expireTime - now),
      recipientName: found.recipientName,
      senderName: found.senderName,
      occasion: found.occasion,
      expiredAt: found.expiresAt
    };
  }

  return { error: 'Wish not found or has expired' };
}

export async function sendReaction(wishId, reaction) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/wishes/${wishId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reaction),
    }, 2000);
    if (res && res.ok) return await res.json();
  } catch (err) {
    console.warn('Reaction offline fallback', err);
  }

  // Save to local wish if present
  const list = getLocalHistory();
  const wish = list.find(w => w.id === wishId);
  if (wish) {
    wish.reactions = wish.reactions || [];
    wish.reactions.push({
      id: 'lr_' + Date.now(),
      ...reaction,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wishglow_my_wishes', JSON.stringify(list));
  }
  return { success: true };
}

// Local history helpers
export function getLocalHistory() {
  try {
    const raw = localStorage.getItem('wishglow_my_wishes');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveToLocalHistory(wish) {
  try {
    const list = getLocalHistory();
    const existingIndex = list.findIndex(w => w.id === wish.id);
    if (existingIndex >= 0) {
      list[existingIndex] = wish;
    } else {
      list.unshift(wish);
    }
    localStorage.setItem('wishglow_my_wishes', JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.error('Error saving local wish', e);
  }
}

// Encode/decode wish data safely for share links without exceeding URL limits
export function encodeWishData(wish) {
  try {
    if (!wish) return '';
    // Strip giant base64 payloads (>30KB) from URL parameter to prevent browser freeze / URI Too Long
    const portableWish = { ...wish };
    if (Array.isArray(portableWish.photos)) {
      portableWish.photos = portableWish.photos.filter(p => typeof p === 'string' && (!p.startsWith('data:') || p.length < 30000));
    }
    if (typeof portableWish.photoUrl === 'string' && portableWish.photoUrl.startsWith('data:') && portableWish.photoUrl.length > 30000) {
      delete portableWish.photoUrl;
    }
    if (typeof portableWish.videoUrl === 'string' && portableWish.videoUrl.startsWith('data:')) {
      delete portableWish.videoUrl;
    }
    if (typeof portableWish.audioUrl === 'string' && portableWish.audioUrl.startsWith('data:') && portableWish.audioUrl.length > 50000) {
      delete portableWish.audioUrl;
    }

    const jsonStr = JSON.stringify(portableWish);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
  } catch (e) {
    console.warn('Encoding wish data error:', e);
    return '';
  }
}

export function decodeWishData(encodedStr) {
  try {
    if (!encodedStr) return null;
    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedStr))));
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

