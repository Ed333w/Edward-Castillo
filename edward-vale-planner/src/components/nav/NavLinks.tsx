'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from '@/lib/utils/clsx';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'home' },
  { href: '/calendar', label: 'Calendario', icon: 'calendar' },
  { href: '/tasks', label: 'Tareas', icon: 'check' },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z"
    />
  ),
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
    />
  ),
  check: <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />,
};

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function DesktopNavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegación principal" className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
              active
                ? 'bg-(--primary) text-(--primary-foreground)'
                : 'text-(--foreground) hover:bg-(--surface-hover)',
            )}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNavLinks() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-(--border) bg-(--surface) pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium',
              active ? 'text-(--primary)' : 'text-(--muted)',
            )}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
