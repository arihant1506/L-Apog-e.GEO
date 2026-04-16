-- Run this in the Supabase SQL editor to create the required table
create table public.scans (
  id uuid default gen_random_uuid() primary key,
  scan_id text not null,
  date date not null,
  coords text not null,
  classification text not null,
  confidence numeric,
  type text -- e.g., 'critical', 'warning', 'safe'
);

-- Note: RLS (Row Level Security) needs to be configured depending on your needs.
-- Or you can temporarily disable it for development:
alter table public.scans disable row level security;
