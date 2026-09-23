'use client';

import { useActiveProfile } from '@/components/providers/ProfileProvider';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { ReminderWatcher } from '@/components/notifications/ReminderWatcher';
import { DesktopNavLinks, MobileNavLinks } from './NavLinks';
import { SwitchProfileButton } from './SwitchProfileButton';

export function AppShell({ children }: { children: React.ReactNode }) {
  const profile = useActiveProfile();

  return (
    <div className="flex min-h-screen">
      <ReminderWatcher />
      <aside className="hidden w-64 shrink-0 flex-col border-r border-(--border) bg-(--surface) p-4 md:flex">
        <div className="mb-6 px-2">
          <p className="text-lg font-semibold text-(--foreground)">Edward &amp; Vale</p>
        </div>
        <DesktopNavLinks />
        <div className="mt-auto space-y-4 border-t border-(--border) pt-4">
          <ThemeToggle />
          <div className="space-y-1 px-1">
            <p className="text-xs text-(--muted)">Perfil actual</p>
            <p className="font-medium text-(--foreground)">{profile.displayName}</p>
            <SwitchProfileButton />
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-(--border) bg-(--surface) px-4 py-3 md:hidden">
          <p className="text-lg font-semibold text-(--foreground)">Edward &amp; Vale</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-(--muted)">{profile.displayName}</span>
            <SwitchProfileButton />
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        <MobileNavLinks />
      </div>
    </div>
  );
}
