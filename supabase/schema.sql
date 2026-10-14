-- =====================================================================
-- QAQA Portfolio: database schema
-- Run this whole file once in Supabase: SQL Editor -> New query -> Run
-- BEFORE running: change the admin email in is_portfolio_admin() below
-- if you will sign in with a different address.
-- =====================================================================

-- Who may add / edit / delete things (only this logged-in email)
create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'beneditc64@gmail.com'
$$;

-- ---------- categories (topics) ----------
create table if not exists public.portfolio_categories (
  slug        text primary key check (slug ~ '^[a-z0-9-]+$'),
  name        text not null,
  sort_order  int  not null default 0
);

-- ---------- portfolio items ----------
create table if not exists public.portfolio_items (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  category_slug  text not null
                 references public.portfolio_categories(slug)
                 on update cascade on delete restrict,
  media_type     text not null
                 check (media_type in ('image','youtube','vimeo','soundcloud','details')),
  media_url      text,                      -- video/audio link, or live project link for 'details'
  thumbnail_url  text not null,             -- card image
  description    text,
  extra_images   text[] not null default '{}',   -- extra pictures for the 'details' popup
  published      boolean not null default true,
  sort_order     int not null default 0,    -- lower number shows first
  created_at     timestamptz not null default now()
);

create index if not exists portfolio_items_category_idx on public.portfolio_items (category_slug);

-- ---------- row level security ----------
alter table public.portfolio_categories enable row level security;
alter table public.portfolio_items      enable row level security;

drop policy if exists "categories: public read"  on public.portfolio_categories;
drop policy if exists "categories: admin write"  on public.portfolio_categories;
drop policy if exists "items: public read"       on public.portfolio_items;
drop policy if exists "items: admin read all"    on public.portfolio_items;
drop policy if exists "items: admin write"       on public.portfolio_items;

create policy "categories: public read" on public.portfolio_categories
  for select to anon, authenticated using (true);

create policy "categories: admin write" on public.portfolio_categories
  for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

create policy "items: public read" on public.portfolio_items
  for select to anon, authenticated using (published);

create policy "items: admin read all" on public.portfolio_items
  for select to authenticated using (public.is_portfolio_admin());

create policy "items: admin write" on public.portfolio_items
  for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- ---------- image storage ----------
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "portfolio files: admin insert" on storage.objects;
drop policy if exists "portfolio files: admin update" on storage.objects;
drop policy if exists "portfolio files: admin delete" on storage.objects;

create policy "portfolio files: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_portfolio_admin());

create policy "portfolio files: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_admin());

create policy "portfolio files: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_admin());

-- ---------- starter categories (edit/add more from the dashboard) ----------
insert into public.portfolio_categories (slug, name, sort_order) values
  ('web-development', 'Web Development', 1),
  ('web-design',      'Web Design',      2),
  ('logo-branding',   'Logo & Branding', 3),
  ('graphic-design',  'Graphic Design',  4)
on conflict (slug) do nothing;

-- ---------- site settings (CV link) ----------
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
