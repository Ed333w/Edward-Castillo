'use client';

import { useState } from 'react';

export function QuickAddTask({ onAdd }: { onAdd: (title: string) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || busy) return;

    setBusy(true);
    setError(null);
    try {
      await onAdd(trimmed);
      setTitle('');
    } catch {
      setError('No se pudo crear la tarea. Tu texto sigue aquí, intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-1">
      <div className="flex items-center gap-2 rounded-lg border border-(--border) bg-(--surface) px-3 py-2 focus-within:outline-2 focus-within:outline-(--focus-ring)">
        <span aria-hidden="true" className="text-(--muted)">
          +
        </span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea — escribe y presiona Enter"
          aria-label="Nueva tarea"
          disabled={busy}
          className="w-full bg-transparent text-sm text-(--foreground) placeholder:text-(--muted) focus:outline-none"
        />
      </div>
      {error && (
        <p role="alert" className="text-xs text-(--danger)">
          {error}
        </p>
      )}
    </form>
  );
}
