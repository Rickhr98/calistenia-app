# Migración de Sala de Skills a React + Vite + Supabase

## Contexto

La app "Sala de Skills" (tracker de calistenia: plan de rutina, selección de equipo, cronómetro/reps, progreso de skills) hoy vive entera en un único `index.html` con HTML/CSS/JS inline. Los datos (registros, equipo, modo rápido) se persisten en `localStorage` vía un shim `window.storage`.

Objetivo: migrar a una estructura de proyecto mantenible (React + Vite + TypeScript), desplegable en GitHub Pages, con una base de datos real (Supabase) para que los registros de progreso dejen de depender del navegador local y, a futuro, distintas personas puedan tener su propia cuenta con acceso simple (sin formulario de registro).

## Alcance

- Migrar toda la funcionalidad actual (equipo, día activo, modo rápido, cronómetro de holds, registro de reps, "cómo hacerlo", progreso de skills) a componentes React.
- Reemplazar `localStorage` por Supabase (Postgres + Auth) para registros (`logs`) y preferencias (`user_settings`).
- Auth por magic link (email, sin contraseña ni registro formal).
- Los datos de la rutina (ejercicios, equipo disponible, skills, presets) se quedan como configuración TypeScript versionada en el repo — no en la base de datos.
- Estilos migrados a Tailwind CSS + componentes shadcn/ui, preservando la identidad visual actual (fuentes Space Grotesk/Inter/Space Mono, paleta índigo/lima).
- Despliegue estático a GitHub Pages vía GitHub Actions.
- Fuera de alcance: importar el historial actual de localStorage (se empieza de cero), panel de administración para editar rutinas desde UI, allowlist de emails para auth (se deja para el futuro).

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui (componentes copiados al repo, no dependencia de caja negra)
- Supabase: Postgres + Auth (magic link) + cliente JS
- GitHub Actions → GitHub Pages (`vite.config.ts` con `base: '/calistenia-app/'`)

## Estructura de carpetas

```
calistenia-app/
├─ .github/workflows/deploy.yml
├─ index.html
├─ vite.config.ts
├─ tailwind.config.ts
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ data/
│  │  ├─ types.ts
│  │  ├─ days.ts
│  │  ├─ equipment.ts
│  │  ├─ skills.ts
│  │  └─ presets.ts
│  ├─ lib/
│  │  ├─ supabaseClient.ts
│  │  └─ utils.ts
│  ├─ hooks/
│  │  ├─ useAuth.ts
│  │  ├─ useLogs.ts
│  │  └─ useSettings.ts
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ Header.tsx
│  │  ├─ EquipmentSheet.tsx
│  │  ├─ DayNav.tsx
│  │  ├─ DayView.tsx
│  │  ├─ ExerciseCard.tsx
│  │  ├─ HowToSheet.tsx
│  │  ├─ TimerSheet.tsx
│  │  ├─ RepsSheet.tsx
│  │  ├─ ProgressView.tsx
│  │  └─ Login.tsx
│  └─ styles/globals.css
```

Lógica pura (`resolve`, `has`, `sameSet`, `bestFor`, `equipLabel`, `fmt`) vive en `lib/utils.ts`, sin dependencias de UI, testeable de forma aislada.

Estado compartido (día activo, equipo, modo rápido, sesión de auth) vive en `App.tsx` vía Context + hooks — sin librería de estado adicional.

## Esquema de datos (Supabase)

```sql
create table logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null default auth.uid(),
  ex_id text not null,
  skill text,
  type text not null check (type in ('hold','reps')),
  value numeric not null,
  created_at timestamptz not null default now()
);

create table user_settings (
  user_id uuid primary key references auth.users default auth.uid(),
  equip_set text[] not null default '{floor}',
  quick_mode boolean not null default false
);

alter table logs enable row level security;
alter table user_settings enable row level security;

create policy "own logs" on logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own settings" on user_settings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## Auth

- `supabase.auth.signInWithOtp({ email })` desde una pantalla simple (`Login.tsx`): input de email + botón "Enviar link".
- Al volver del email, Supabase restaura la sesión automáticamente (`redirectTo` configurado a la URL de GitHub Pages).
- Riesgo aceptado: al ser sitio estático + magic link abierto, cualquiera que encuentre la URL puede crear su propia cuenta escribiendo su email — pero RLS garantiza que cada quien solo ve sus propios datos. Un allowlist de emails vía trigger de Postgres queda como mejora futura, no incluida en este alcance.

## Despliegue

- `.github/workflows/deploy.yml`: build con Vite en cada push a `master`, publica `dist/` a GitHub Pages.
- `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como GitHub Secrets inyectados en build time.
- Pasos manuales del usuario (no automatizables): crear cuenta y proyecto en supabase.com, correr el SQL de este documento, y proveer URL + anon key.

## Migración de datos existentes

No se migra el historial actual de `localStorage`. Al entrar por primera vez vía magic link, el usuario empieza con registros en cero.
