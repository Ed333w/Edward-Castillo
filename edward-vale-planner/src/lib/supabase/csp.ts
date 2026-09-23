/**
 * Content-Security-Policy (spec §33). script-src uses a per-request nonce
 * (no 'unsafe-inline') — Next.js automatically applies this nonce to the
 * scripts/styles it injects for hydration when it finds it in this header.
 * style-src keeps 'unsafe-inline' because this app sets a handful of
 * inline `style` attributes for user-picked category colors (validated as
 * strict #rrggbb hex before storage — see lib/utils/sanitize.ts), which is
 * far lower risk than allowing inline scripts.
 */
export function buildCsp(nonce: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  let supabaseHost = '';
  try {
    supabaseHost = new URL(supabaseUrl).host;
  } catch {
    // NEXT_PUBLIC_SUPABASE_URL not set yet (e.g. during local scaffolding) —
    // connect-src just falls back to 'self' only until it's configured.
  }

  const connectSrc = ["'self'"];
  if (supabaseHost) {
    connectSrc.push(`https://${supabaseHost}`, `wss://${supabaseHost}`);
  }

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connectSrc.join(' ')}`,
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}
