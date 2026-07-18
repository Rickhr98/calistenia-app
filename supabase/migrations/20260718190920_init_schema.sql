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
