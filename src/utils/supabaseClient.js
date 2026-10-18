import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to save wish to Supabase
export async function saveWishToSupabase(wish) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('wishes')
      .upsert({
        id: wish.id,
        recipient_name: wish.recipientName,
        sender_name: wish.senderName,
        occasion: wish.occasion,
        theme: wish.theme,
        title: wish.title,
        message: wish.message,
        photos: wish.photos || (wish.photoUrl ? [wish.photoUrl] : []),
        video_url: wish.videoUrl || '',
        audio_url: wish.audioUrl || '',
        music_track: wish.music || 'birthday',
        custom_options: wish.customOptions || wish.interactiveOptions || {},
        is_paid: wish.isPaid || false,
        payment_plan: wish.paymentPlan || '48h_standard',
        expires_at: wish.expiresAt,
        created_at: wish.createdAt || new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase upsert wish error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase connection error:', err);
    return null;
  }
}

// Helper to fetch wish from Supabase
export async function fetchWishFromSupabase(id) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    // Map snake_case to camelCase
    return {
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
      paymentPlan: data.payment_plan,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      viewsCount: data.views_count
    };
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

// Helper to record payment in Supabase
export async function recordPaymentInSupabase(payment) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        id: payment.id,
        wish_id: payment.wishId,
        plan_id: payment.planId,
        amount: payment.amount,
        currency: payment.currency || 'USD',
        status: payment.status || 'completed',
        payment_method: payment.paymentMethod,
        promo_code: payment.promoCode || null,
        created_at: new Date().toISOString()
      });

    return !error;
  } catch (e) {
    return false;
  }
}
