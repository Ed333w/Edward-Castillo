import type { Profile } from '@/types/domain';

export function resolveProfileName(profiles: Profile[], id: string | null | undefined): string {
  if (!id) return '—';
  return profiles.find((p) => p.id === id)?.displayName ?? '—';
}

export function resolveCategory<T extends { id: string }>(categories: T[], id: string | null): T | undefined {
  if (!id) return undefined;
  return categories.find((c) => c.id === id);
}
