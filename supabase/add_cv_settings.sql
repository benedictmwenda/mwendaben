-- =====================================================================
-- Adds CV management (run once if you already ran schema.sql earlier;
-- it is safe to run again). Supabase: SQL Editor -> New query -> Run
-- =====================================================================

create table if not exists public.site_settings (
  key         text primary key check (key ~ '^[a-z0-9_]+$'),
  value       text,
  updated_at  timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings: public read"  on public.site_settings;
drop policy if exists "settings: admin all"    on public.site_settings;

-- visitors may only read the CV link, nothing else
create policy "settings: public read" on public.site_settings
  for select to anon, authenticated using (key = 'cv_url');

create policy "settings: admin all" on public.site_settings
  for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
