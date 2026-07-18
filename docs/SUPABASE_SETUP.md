# Configurar Supabase

1. Crea una cuenta en https://supabase.com y un nuevo proyecto.
2. En el SQL editor del proyecto, ejecuta el contenido de `supabase/schema.sql`.
3. En Project Settings → API, copia:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`
4. Crea un archivo `.env` en la raíz del proyecto (no se commitea) con esos dos valores, siguiendo `.env.example`.
5. En Authentication → URL Configuration, agrega la URL de tu GitHub Pages
   (`https://rickhr98.github.io/calistenia-app/`) a "Redirect URLs" para que el magic link funcione en producción.
6. Para el despliegue automático, agrega los mismos dos valores como GitHub Secrets del repositorio
   (Settings → Secrets and variables → Actions → New repository secret), con los mismos nombres:
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
