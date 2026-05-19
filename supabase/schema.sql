create table if not exists public.diagnosis_answers (
  id text primary key,
  created_at timestamptz not null default now(),
  line_user_id text,
  line_display_name text,
  industry text not null,
  issue text not null,
  goal text not null,
  selected_features text[] not null default '{}',
  recommended_plan text not null,
  source_demo_type text not null check (source_demo_type in ('store', 'beauty', 'school'))
);

create table if not exists public.reservations (
  id text primary key,
  created_at timestamptz not null default now(),
  line_user_id text,
  line_display_name text,
  name text not null,
  email text not null,
  preferred_datetime text not null,
  message text not null,
  diagnosis_answer_id text references public.diagnosis_answers(id) on delete set null,
  source_demo_type text not null check (source_demo_type in ('store', 'beauty', 'school'))
);

create table if not exists public.customers (
  id text primary key,
  created_at timestamptz not null default now(),
  line_user_id text not null unique,
  line_display_name text not null,
  email text,
  name text,
  member_qr_code text not null,
  points integer not null default 0,
  visit_count integer not null default 0,
  last_visit_at timestamptz
);

create index if not exists diagnosis_answers_source_demo_type_idx
  on public.diagnosis_answers (source_demo_type);

create index if not exists reservations_source_demo_type_idx
  on public.reservations (source_demo_type);

create index if not exists customers_line_user_id_idx
  on public.customers (line_user_id);

-- Portfolio demo policy:
-- For a public portfolio, keep Supabase access on the server side and use
-- SUPABASE_SERVICE_ROLE_KEY only in Vercel environment variables.
-- In production, enable Row Level Security and design policies for admin users,
-- LINE users, and staff operations before storing real personal information.

alter table public.diagnosis_answers enable row level security;
alter table public.reservations enable row level security;
alter table public.customers enable row level security;
