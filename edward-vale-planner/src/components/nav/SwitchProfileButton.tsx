'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SwitchProfileButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function switchProfile() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={switchProfile}
      disabled={loading}
      className={className ?? 'text-sm text-(--muted) hover:text-(--foreground) disabled:opacity-60'}
    >
      {loading ? 'Saliendo…' : 'Cambiar perfil'}
    </button>
  );
}
