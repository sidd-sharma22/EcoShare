# EcoShare + Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `schema.sql`.
3. In Supabase Authentication -> URL Configuration, set the Site URL to the URL where EcoShare is hosted.
4. In `Phase 1/supabase-client.js`, replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY`.
5. Serve the project through HTTP (for example VS Code Live Server). Do not open the HTML files directly with `file://`.
6. Test Register -> Login -> Explore -> Resource Details -> Borrow Request.

Do not place a `service_role`/secret key in browser code.
