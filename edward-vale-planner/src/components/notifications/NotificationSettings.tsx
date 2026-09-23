'use client';

import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { isPushSupported, requestNotificationPermission, subscribeToPush } from '@/lib/notifications/push';

interface NotificationSettingsProps {
  supabase: SupabaseClient<Database>;
  profileId: string;
}

/**
 * Spec §16: never request notification permission on page load — only after
 * an explicit click on this button.
 */
export function NotificationSettings({ supabase, profileId }: NotificationSettingsProps) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function activate() {
    setBusy(true);
    setMessage(null);
    try {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result !== 'granted') {
        setMessage('No se concedió el permiso. Puedes activarlo luego desde la configuración del navegador.');
        return;
      }
      if (isPushSupported()) {
        await subscribeToPush(supabase, profileId);
        setMessage('Notificaciones activadas en este dispositivo.');
      } else {
        setMessage('Notificaciones activadas mientras la app esté abierta en esta pestaña.');
      }
    } catch {
      setMessage('No se pudo activar. Verifica la conexión e inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  if (permission === 'granted') {
    return <p className="text-sm text-(--muted)">Notificaciones activadas.</p>;
  }

  if (permission === 'unsupported') {
    return <p className="text-sm text-(--muted)">Este navegador no soporta notificaciones.</p>;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={activate}
        disabled={busy || permission === 'denied'}
        className="rounded-lg border border-(--border) bg-(--surface) px-3 py-1.5 text-sm font-medium text-(--foreground) hover:bg-(--surface-hover) disabled:opacity-60"
      >
        {permission === 'denied' ? 'Notificaciones bloqueadas' : busy ? 'Activando…' : 'Activar notificaciones'}
      </button>
      {message && <p className="text-xs text-(--muted)">{message}</p>}
    </div>
  );
}
