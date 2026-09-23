'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { clsx } from '@/lib/utils/clsx';

const OPTIONS = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Sistema' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Tema de la aplicación" className="flex gap-1 rounded-lg bg-(--surface-hover) p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={theme === opt.value}
          onClick={() => setTheme(opt.value)}
          className={clsx(
            'flex-1 rounded-md px-2 py-1 text-xs font-medium transition',
            theme === opt.value ? 'bg-(--surface) text-(--foreground) shadow-sm' : 'text-(--muted)',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
