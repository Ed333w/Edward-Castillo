import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * "Full level" reminders (spec §17): push notifications that arrive even
 * when the app is closed. Requires:
 *   1. This PWA registered as a Service Worker (see public/sw.js).
 *   2. A VAPID key pair (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY).
 *   3. The `send-reminders` Supabase Edge Function running on a schedule
 *      (pg_cron) — see supabase/functions/send-reminders.
 * None of that is optional infrastructure; without it these functions still
 * register a subscription, but no push will ever actually be sent.
 */

export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPush(supabase: SupabaseClient<Database>, profileId: string): Promise<void> {
  if (!isPushSupported()) throw new Error('Este navegador no soporta notificaciones push.');

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) throw new Error('Falta configurar NEXT_PUBLIC_VAPID_PUBLIC_KEY.');

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
  });

  const json = subscription.toJSON();
  const { error } = await supabase.from('push_subscriptions').insert({
    profile_id: profileId,
    endpoint: json.endpoint!,
    p256dh: json.keys!.p256dh,
    auth_key: json.keys!.auth,
  });
  if (error && error.code !== '23505') throw error; // ignore "already subscribed" conflicts
}

export async function unsubscribeFromPush(supabase: SupabaseClient<Database>): Promise<void> {
  if (!isPushSupported()) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();
  await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}
