# Sala de Skills

Tracker de calistenia (handstand, L-sit, front lever) construido con React + Vite + TypeScript, desplegado en GitHub Pages, con Supabase para auth (magic link) y persistencia de registros.

## Desarrollo

```bash
npm install
cp .env.example .env   # completa con tus credenciales de Supabase, ver docs/SUPABASE_SETUP.md
npm run dev
```

## Tests

```bash
npm test
```

## Despliegue

Cada push a `master` corre tests, build, y publica a GitHub Pages vía `.github/workflows/deploy.yml`. Requiere los secrets de repo `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (ver `docs/SUPABASE_SETUP.md`).
