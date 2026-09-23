# Edward & Vale

Aplicación privada de productividad (calendario + tareas) para dos personas.
Next.js 16 (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres,
Auth, Realtime) + PWA con Web Push.

## Índice

1. [Instalación](#instalación)
2. [Variables de entorno](#variables-de-entorno)
3. [Base de datos (Supabase)](#base-de-datos-supabase)
4. [Ejecutar en local](#ejecutar-en-local)
5. [Pruebas](#pruebas)
6. [Despliegue](#despliegue)
7. [Autenticación y el sistema Edward/Vale](#autenticación-y-el-sistema-edwardvale)
8. [Notificaciones](#notificaciones)
9. [Sincronización entre dispositivos](#sincronización-entre-dispositivos)
10. [Seguridad](#seguridad)
11. [Estructura del proyecto](#estructura-del-proyecto)
12. [Limitaciones conocidas](#limitaciones-conocidas)
13. [Recomendaciones para v2](#recomendaciones-para-v2)

---

## Instalación

Requisitos: Node.js 20+ (probado con Node 24) y una cuenta de [Supabase](https://supabase.com) (plan gratuito es suficiente).

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env.local` y complétalo:

```bash
cp .env.example .env.local
```

| Variable | Dónde se usa | Secreta |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente y servidor | No (pública) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente y servidor | No (protegida por RLS, no por secretismo) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Cliente (suscripción push) | No |
| `VAPID_PRIVATE_KEY` | Solo el Edge Function `send-reminders` | **Sí — nunca en este proyecto Next.js** |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo el Edge Function `send-reminders` | **Sí — nunca en este proyecto Next.js** |

La service role key y la VAPID private key se configuran como *secrets* del
Edge Function en el dashboard de Supabase (Project Settings → Edge Functions),
nunca en `.env.local` de esta app. Ver más abajo.

## Base de datos (Supabase)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **Authentication → Providers**, deja solo **Email** activo y en
   **Authentication → Settings** desactiva "Allow new users to sign up" si tu
   plan lo permite (control adicional; el control real ya está en el paso 4).
3. En el **SQL Editor**, ejecuta en orden:
   - `supabase/schema.sql`
   - `supabase/seed.sql` (edítalo primero con los correos reales de Edward y Vale)
4. Copia **Project Settings → API → Project URL** y **anon public key** a tu `.env.local`.
5. (Opcional, para notificaciones con la app cerrada) despliega el Edge
   Function:
   ```bash
   npx supabase functions deploy send-reminders
   npx supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:tu@correo.com
   ```
   Genera el par de claves VAPID una vez con `npx web-push generate-vapid-keys`.
   Luego programa su ejecución cada minuto (SQL Editor):
   ```sql
   select cron.schedule(
     'send-reminders-every-minute', '* * * * *',
     $$ select net.http_post(
       url := 'https://<project-ref>.functions.supabase.co/send-reminders',
       headers := jsonb_build_object('Authorization', 'Bearer <SERVICE_ROLE_KEY>')
     ); $$
   );
   ```
   (Requiere las extensiones `pg_cron` y `pg_net`, activables en
   **Database → Extensions**.)

## Ejecutar en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La primera vez verás el
selector Edward/Vale → introduces el correo real → revisas tu bandeja de
entrada → abres el enlace mágico.

## Pruebas

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run test        # Vitest — 29 pruebas unitarias, ejecutadas y en verde
npm run test:e2e    # Playwright
```

**Resultado en este entorno:** `typecheck`, `lint`, `build` y `test` (Vitest)
se ejecutaron y pasan limpio. De Playwright, las 3 pruebas que no requieren
backend (selector de perfil, redirección sin sesión) se ejecutaron en un
Chromium real y pasan; las 2 que ejercitan datos reales (atribución de
tareas, sincronización tarea↔calendario) están escritas pero se **saltan**
automáticamente porque este entorno no tiene un proyecto Supabase real
configurado — ver `tests/e2e/README.md` para correrlas contra un proyecto de
prueba.

## Despliegue

Recomendado: [Vercel](https://vercel.com) (integración nativa con Next.js).

1. Importa el repo en Vercel, con **Root Directory** = `edward-vale-planner`.
2. Define las variables de entorno de la tabla de arriba (las `NEXT_PUBLIC_*`)
   en Project Settings → Environment Variables.
3. Despliega. Vercel sirve todo sobre HTTPS automáticamente (spec §30).
4. El Edge Function y el cron viven en Supabase, no en Vercel — se despliegan
   como se explicó arriba, independientemente del hosting del frontend.

## Autenticación y el sistema Edward/Vale

Dos conceptos separados a propósito (spec §2):

- **Selector de perfil** (`/login`): solo identifica quién usa el
  dispositivo ahora mismo. Es UX, no seguridad.
- **Autorización real**: Supabase Auth con **magic link por correo**,
  restringido a una lista de exactamente dos correos (`allowed_emails` en la
  base de datos). Un trigger (`on_auth_user_created` en `supabase/schema.sql`)
  **rechaza la creación de cualquier cuenta cuyo correo no esté en esa
  lista** — esto ocurre en la base de datos, no se puede saltar manipulando
  el frontend.

`createdBy` / `updatedBy` en tareas y eventos **nunca se aceptan del
cliente**: un trigger (`set_audit_fields`) los sobreescribe siempre con
`auth.uid()` de la sesión verificada en el servidor (spec §3/§26). Esto
significa que aunque alguien edite la petición HTTP a mano, no puede
atribuirse una acción a nombre de la otra persona.

El botón "Cambiar perfil" cierra la sesión de Supabase y vuelve a
`/login` — no hay ninguna cookie o header que diga "soy Edward" que el
cliente controle; la próxima carga de página vuelve a resolver el perfil
activo desde la sesión real (`app/(app)/layout.tsx`, Server Component).

## Notificaciones

Dos niveles, tal como pide la especificación — no se simula uno como si
fuera el otro (spec §17):

- **Básico** (pestaña abierta): `src/lib/notifications/reminders.ts` revisa
  cada 30s las tareas/eventos con recordatorio configurado y dispara
  `Notification` del navegador. Deja de funcionar si cierras la pestaña.
- **Completo** (app cerrada): Service Worker (`public/sw.js`) + Web Push
  (VAPID) + tabla `push_subscriptions` + Edge Function
  `supabase/functions/send-reminders` programado con `pg_cron` cada minuto.
  Este nivel requiere que completes el paso 5 de la sección de base de
  datos; sin eso desplegado, las suscripciones se guardan pero nadie las
  despacha.

El permiso del navegador **nunca** se pide solo; solo tras pulsar
"Activar notificaciones" en el dashboard (spec §16).

## Sincronización entre dispositivos

Postgres (Supabase) es la única fuente de verdad — no hay lógica que
dependa de `localStorage` para datos compartidos (`localStorage` solo
guarda preferencia de tema). `usePlannerData` (`src/hooks/usePlannerData.ts`)
carga todo al montar y además se suscribe a **Supabase Realtime** sobre
`tasks`, `calendar_events` y `categories`, así que un cambio hecho desde el
celular de Vale aparece en la laptop de Edward sin recargar la página.
Realtime respeta Row Level Security: solo se retransmiten cambios a
sesiones autorizadas.

## Seguridad

**Modelo de amenazas (resumen).** Protegemos: los datos de tareas/eventos
privados de la pareja y la integridad de "quién hizo qué". Atacantes
plausibles: bots que escanean URLs públicas en internet, alguien con el
link de la app pero sin invitación, un dispositivo compartido o perdido.
Puntos de entrada: formularios de texto libre, la API pública de Supabase
(anon key, visible en cualquier bundle de cliente), tokens de sesión.

**Medidas implementadas:**

- **Autenticación**: magic link, sin contraseñas que gestionar o filtrar.
- **Autorización de dos capas**: (1) el trigger de base de datos rechaza
  cuentas no autorizadas; (2) cada tabla tiene Row Level Security exigiendo
  una fila en `profiles` — sin eso, cero acceso a datos, sin importar qué
  pida el cliente.
- **Sin confianza en el cliente** (spec §26): `created_by`/`updated_by`
  forzados por trigger; toda regla de negocio real vive en constraints y
  RLS de Postgres, no solo en la UI.
- **Validación y sanitización** (spec §27): esquemas Zod en la capa de
  servicios (`src/lib/services/schemas.ts`) + `sanitizeText` que despoja
  etiquetas y caracteres de control antes de guardar + `CHECK` constraints
  en la base de datos como última línea de defensa. React escapa todo el
  texto por defecto; el proyecto no usa `dangerouslySetInnerHTML` salvo un
  único script estático (sin datos de usuario) para aplicar el tema antes
  de la hidratación, protegido con nonce de CSP.
- **Secretos**: la service role key y la clave privada VAPID solo existen
  como secrets del Edge Function en Supabase — nunca en el bundle de esta
  app Next.js ni en el repositorio (`.env.example` no tiene valores reales;
  `.gitignore` excluye `.env*`).
- **HTTPS**: en producción vía Vercel (redirección automática) +
  `Strict-Transport-Security` con preload.
- **Cookies de sesión**: gestionadas por `@supabase/ssr`, `HttpOnly` y
  `Secure` en producción.
- **CSRF**: la app no usa cookies de sesión para autorizar mutaciones de
  datos (esas van firmadas por el JWT que Supabase valida por Authorization
  header vía `supabase-js`, no por cookie ambiental), así que el vector CSRF
  clásico no aplica a las operaciones de tareas/eventos.
- **Content-Security-Policy** con nonce por request, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
  restrictivo (`src/lib/supabase/csp.ts`, `next.config.ts`).
- **Rate limiting de login**: heredado del throttling nativo de Supabase Auth
  para `signInWithOtp` — no se añadió una capa propia porque duplicaría
  protección ya provista por el proveedor y sería fácil desincronizar.
- **Privacidad**: cero analytics, trackers o servicios de terceros.
- **Dependencias**: lista deliberadamente corta (ver `package.json`); antes
  de desplegar corre `npm audit`.

## Estructura del proyecto

```
src/
  app/                    rutas (App Router)
    (app)/                grupo protegido: dashboard, calendar, tasks
    login/, auth/callback/
  components/
    calendar/ tasks/ dashboard/ nav/ notifications/ common/ providers/
  lib/
    supabase/             clientes browser/server + middleware + CSP
    services/             CRUD contra Supabase (tasks, events, categories…)
    notifications/        recordatorios in-app + Web Push
    utils/                fechas, fusión tarea↔calendario, filtros, sanitizado
  hooks/                  usePlannerData (fetch + Realtime)
  types/                  Database (espejo del esquema) y tipos de dominio
supabase/
  schema.sql seed.sql functions/send-reminders/
tests/
  unit/ (Vitest)  e2e/ (Playwright)
public/
  manifest.webmanifest sw.js icons/
```

## Limitaciones conocidas

- Los recordatorios push "completo" (app cerrada) solo se disparan para
  tareas/eventos que tienen **fecha y hora** — uno solo con fecha (todo el
  día) no tiene un instante preciso del que restar minutos, así que no
  genera push (sí sigue visible en el dashboard/calendario).
- No hay eliminación de cuenta ni exportación/portabilidad de datos propia
  todavía (spec §41 cubierto para tareas/eventos individuales; gestión de
  cuenta completa queda para v2).
- El Content-Security-Policy permite `style-src 'unsafe-inline'` porque un
  puñado de componentes fija `style` en línea para colores de categoría
  (validados como `#rrggbb` antes de guardar). `script-src` sí usa nonce
  estricto, sin `unsafe-inline`.
- Las pruebas E2E que dependen de datos reales no se pudieron ejecutar en
  este entorno de construcción por no existir un proyecto Supabase de
  prueba; están escritas y se saltan automáticamente (ver arriba).
- No se probó manualmente en un dispositivo iOS/Android físico durante esta
  construcción — la responsividad se hizo con Tailwind mobile-first y se
  verificó por inspección de layout, no en hardware real.

## Recomendaciones para v2

- Tareas recurrentes.
- Búsqueda y estadísticas simples (tareas completadas por semana, etc.).
- Exportar/importar (backup manual) además del backup automático de Supabase.
- Passkeys como alternativa al magic link para entrar más rápido en móvil.
- Adjuntar archivos a tareas/eventos (requiere Supabase Storage + políticas).
