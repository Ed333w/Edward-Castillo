type ClassValue = string | number | null | undefined | false | Record<string, boolean | undefined>;

/** Tiny className joiner — avoids pulling in the `clsx` package for this. */
export function clsx(...values: ClassValue[]): string {
  const parts: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (typeof v === 'string' || typeof v === 'number') {
      parts.push(String(v));
    } else {
      for (const [key, on] of Object.entries(v)) {
        if (on) parts.push(key);
      }
    }
  }
  return parts.join(' ');
}
