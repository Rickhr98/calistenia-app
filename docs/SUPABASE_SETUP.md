# Configurar Supabase

1. Crea una cuenta en https://supabase.com y un nuevo proyecto.
2. Aplica el esquema de base de datos con el Supabase CLI (ver sección de migraciones abajo) — no hace falta pegar SQL a mano en el dashboard.
3. En Project Settings → API, copia:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`
4. Crea un archivo `.env` en la raíz del proyecto (no se commitea) con esos dos valores, siguiendo `.env.example`.
5. En Authentication → URL Configuration, agrega la URL de tu GitHub Pages
   (`https://rickhr98.github.io/calistenia-app/`) a "Redirect URLs" para que el magic link funcione en producción.
6. Para el despliegue automático, agrega los mismos dos valores como GitHub Secrets del repositorio
   (Settings → Secrets and variables → Actions → New repository secret), con los mismos nombres:
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

## Migraciones de base de datos (Supabase CLI)

El esquema (tablas `logs`/`user_settings`, RLS, políticas) vive versionado en `supabase/migrations/` en vez de un solo script para copiar/pegar. Se aplica con el Supabase CLI (ya disponible vía `npx supabase`, no hace falta instalarlo aparte).

**Primera vez, para conectar este repo a tu proyecto de Supabase:**

```bash
npx supabase login                        # abre el navegador para autenticarte
npx supabase link --project-ref <tu-project-ref>   # el project-ref sale de la URL del dashboard: supabase.com/dashboard/project/<ref>
```

**Aplicar las migraciones al proyecto remoto:**

```bash
npx supabase db push
```

Esto ejecuta cualquier archivo nuevo en `supabase/migrations/` que el proyecto remoto todavía no tenga aplicado (lo trackea en una tabla interna, así que es seguro correrlo varias veces).

**Cuando necesites cambiar el esquema a futuro** (nueva tabla, columna, política, etc.):

```bash
npx supabase migration new nombre_del_cambio   # crea supabase/migrations/<timestamp>_nombre_del_cambio.sql
# edita ese archivo con el SQL del cambio
npx supabase db push                           # lo aplica al proyecto remoto
```

Cada migración queda en git, con historial y orden explícito — no hay que recordar qué se corrió manualmente en el SQL editor.

### Aplicar migraciones automáticamente desde CI (opcional)

`.github/workflows/deploy.yml` incluye un job `migrate` que corre `supabase db push` antes del build. Se salta solo (sin fallar el pipeline) si no configuraste lo siguiente:

- **Repository variable** `SUPABASE_PROJECT_ID` (Settings → Secrets and variables → Actions → pestaña **Variables**) — el project-ref de tu proyecto, no es secreto.
- **Repository secret** `SUPABASE_ACCESS_TOKEN` — se genera en https://supabase.com/dashboard/account/tokens.
- **Repository secret** `SUPABASE_DB_PASSWORD` — la contraseña de la base de datos Postgres del proyecto (la que elegiste al crearlo; si la perdiste, puedes resetearla en Project Settings → Database).

Sin estos tres valores, el job se omite y el build/deploy sigue funcionando igual — solo tendrás que correr `npx supabase db push` a mano cuando cambies el esquema.
