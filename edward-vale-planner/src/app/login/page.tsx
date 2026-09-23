'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Step = 'pick' | 'email' | 'sent';

function LoginForm() {
  const params = useSearchParams();
  const callbackError = params.get('error');

  const [step, setStep] = useState<Step>('pick');
  const [selected, setSelected] = useState<'Edward' | 'Vale' | null>(null);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError === 'not_allowed' ? 'Ese correo no tiene acceso a esta aplicación.' : null,
  );

  function pick(name: 'Edward' | 'Vale') {
    setSelected(name);
    setStep('email');
    setError(null);
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setSending(false);
    if (authError) {
      // Deliberately generic: don't reveal whether an email is allow-listed.
      setError('No se pudo enviar el enlace. Verifica el correo e inténtalo de nuevo.');
      return;
    }
    setStep('sent');
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-(--foreground)">Edward &amp; Vale</h1>
          <p className="text-sm text-(--muted)">Calendario y tareas privados</p>
        </div>

        {step === 'pick' && (
          <div className="space-y-4">
            <p className="text-center text-sm text-(--muted)">¿Quién está usando la aplicación?</p>
            <div className="grid grid-cols-2 gap-4">
              {(['Edward', 'Vale'] as const).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => pick(name)}
                  className="rounded-xl border border-(--border) bg-(--surface) py-8 text-lg font-medium text-(--foreground) transition hover:bg-(--surface-hover) hover:border-(--primary) focus-visible:outline-2 focus-visible:outline-(--focus-ring)"
                >
                  {name}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-(--muted)">
              Esto solo identifica quién usa el dispositivo. El acceso real se verifica por correo.
            </p>
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={sendMagicLink} className="space-y-4">
            <p className="text-center text-sm text-(--muted)">
              Continuar como <span className="font-medium text-(--foreground)">{selected}</span>
            </p>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-(--foreground)">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-(--foreground) focus-visible:outline-2 focus-visible:outline-(--focus-ring)"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-(--danger)">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-(--primary) py-2 font-medium text-(--primary-foreground) transition disabled:opacity-60"
            >
              {sending ? 'Enviando…' : 'Enviar enlace mágico'}
            </button>
            <button
              type="button"
              onClick={() => setStep('pick')}
              className="w-full text-center text-sm text-(--muted) hover:text-(--foreground)"
            >
              ← Cambiar perfil
            </button>
          </form>
        )}

        {step === 'sent' && (
          <div className="space-y-3 text-center">
            <p className="text-(--foreground)">Revisa tu correo</p>
            <p className="text-sm text-(--muted)">
              Enviamos un enlace de acceso a <span className="font-medium">{email}</span>. Ábrelo desde este
              dispositivo para entrar.
            </p>
            <button
              type="button"
              onClick={() => setStep('pick')}
              className="text-sm text-(--primary) hover:underline"
            >
              ← Volver
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
