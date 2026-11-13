-- Run this in the Supabase SQL editor before using /admin/carousel

create table if not exists public.carousel_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  button_text text,
  button_link text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.carousel_slides enable row level security;

-- Homepage: anyone can read active slides
drop policy if exists "Public can read active carousel slides" on public.carousel_slides;
create policy "Public can read active carousel slides"
  on public.carousel_slides
  for select
  using (is_active = true);

-- Admins can read all slides (including inactive) for the admin UI
drop policy if exists "Admins can read all carousel slides" on public.carousel_slides;
create policy "Admins can read all carousel slides"
  on public.carousel_slides
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can insert carousel slides" on public.carousel_slides;
create policy "Admins can insert carousel slides"
  on public.carousel_slides
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update carousel slides" on public.carousel_slides;
create policy "Admins can update carousel slides"
  on public.carousel_slides
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can delete carousel slides" on public.carousel_slides;
create policy "Admins can delete carousel slides"
  on public.carousel_slides
  for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Seed current homepage slides (skip if table already has rows)
insert into public.carousel_slides (title, image_url, button_text, button_link, sort_order, is_active)
select * from (values
  ('FLOORING SERVICES', '/images/flooring-banner.png', null::text, null::text, 1, true),
  ('GOALPOSTS', '/images/goalpost.png', 'Shop Now', '/products/3', 2, true),
  ('COURT TAPING', '/images/badmintoncourt.png', 'Shop Now', '/products/2', 3, true),
  ('NAPFA Equipment', '/images/napfaequipment.png', 'Shop Now', '/products/13', 4, true)
) as seed(title, image_url, button_text, button_link, sort_order, is_active)
where not exists (select 1 from public.carousel_slides limit 1);
