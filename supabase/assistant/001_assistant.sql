-- ============================================================================
-- Covenant Assistant — tables + secured functions
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).
--
-- SECURITY MODEL (same as the attribution page):
--   The website only holds the *publishable* (anon) key. Every table here has
--   row-level security ON with NO policies, so anon can read and write nothing
--   directly. The only doors are the SECURITY DEFINER functions below, and each
--   one first checks the assistant secret (p_key) against assistant_config.
--   Put the same secret in Vercel as ASSISTANT_SECRET.
-- ============================================================================

-- ---- the lock ---------------------------------------------------------------
create table if not exists public.assistant_config (
	id int primary key default 1 check (id = 1),
	secret text not null check (length(secret) >= 12),
	updated_at timestamptz not null default now()
);
alter table public.assistant_config enable row level security;

-- >>> SET YOUR SECRET (any long random string, 24+ characters) <<<
-- insert into public.assistant_config (secret) values ('replace-me-with-a-long-random-secret')
--   on conflict (id) do update set secret = excluded.secret, updated_at = now();

create or replace function public.assistant_check(p_key text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
	select exists (
		select 1 from public.assistant_config
		where secret = p_key and length(coalesce(p_key, '')) >= 12
	);
$$;
revoke all on function public.assistant_check(text) from public;

-- ---- data -------------------------------------------------------------------
create table if not exists public.buildings (
	id text primary key,
	name text not null,
	city text,
	address text,
	stories int,
	year_built int,
	deadline date,
	status text not null default 'unknown', -- past_due | due_this_year | upcoming | not_required | unknown
	contact text,
	phone text,
	called boolean not null default false,
	notes text,
	lead_project_id uuid,          -- set once the building became a CRM job
	source text,
	updated_at timestamptz not null default now()
);
alter table public.buildings enable row level security;
create index if not exists buildings_status_idx on public.buildings (status);

create table if not exists public.homeowner_programs (
	id text primary key,
	name text not null,
	scope text,
	bucket text,
	summary text,
	access jsonb not null default '[]'::jsonb,
	contact jsonb not null default '[]'::jsonb,
	status text,
	sort_order int not null default 0,
	source text
);
alter table public.homeowner_programs enable row level security;

create table if not exists public.assistant_knowledge (
	topic text primary key,
	body text not null,
	source text,
	updated_at timestamptz not null default now()
);
alter table public.assistant_knowledge enable row level security;

-- Every lead the assistant proposed and a human approved. project_id is the
-- CRM job (contact + project at the Lead milestone). If the CRM write failed,
-- crm_error says why and the lead is still here — a database problem must
-- never cost a lead.
create table if not exists public.assistant_leads (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	building_id text references public.buildings (id) on delete set null,
	building text not null,
	city text,
	deadline date,
	contact text,
	phone text,
	reason text,
	next_step text,
	project_id uuid,
	crm_error text
);
alter table public.assistant_leads enable row level security;

create table if not exists public.assistant_runs (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	goal text,
	report text,
	tools_used text[] not null default '{}'
);
alter table public.assistant_runs enable row level security;

-- ---- doors (each checks the key first) --------------------------------------
create or replace function public.assistant_buildings(p_key text)
returns setof public.buildings
language plpgsql security definer set search_path = public stable
as $$
begin
	if not public.assistant_check(p_key) then raise exception 'assistant: bad key'; end if;
	return query select * from public.buildings order by deadline nulls last, name;
end $$;

create or replace function public.assistant_programs(p_key text)
returns setof public.homeowner_programs
language plpgsql security definer set search_path = public stable
as $$
begin
	if not public.assistant_check(p_key) then raise exception 'assistant: bad key'; end if;
	return query select * from public.homeowner_programs order by sort_order, name;
end $$;

create or replace function public.assistant_knowledge_get(p_key text, p_topic text default null)
returns setof public.assistant_knowledge
language plpgsql security definer set search_path = public stable
as $$
begin
	if not public.assistant_check(p_key) then raise exception 'assistant: bad key'; end if;
	return query select * from public.assistant_knowledge
		where p_topic is null or p_topic = 'all' or topic = p_topic
		order by topic;
end $$;

create or replace function public.assistant_leads_list(p_key text)
returns setof public.assistant_leads
language plpgsql security definer set search_path = public stable
as $$
begin
	if not public.assistant_check(p_key) then raise exception 'assistant: bad key'; end if;
	return query select * from public.assistant_leads order by created_at desc;
end $$;

-- Paste-from-Excel loader. p_rows is a JSON array of building objects
-- (id, name, city, address, stories, year_built, deadline, status, contact,
-- phone, called, notes). p_replace = true wipes the table first.
create or replace function public.assistant_upsert_buildings(p_key text, p_rows jsonb, p_replace boolean default false)
returns int
language plpgsql security definer set search_path = public
as $$
declare n int;
begin
	if not public.assistant_check(p_key) then raise exception 'assistant: bad key'; end if;
	if p_replace then delete from public.buildings where lead_project_id is null; end if;
	insert into public.buildings (id, name, city, address, stories, year_built, deadline, status, contact, phone, called, notes, source, updated_at)
	select
		coalesce(r->>'id', lower(regexp_replace(r->>'name', '[^a-zA-Z0-9]+', '-', 'g'))),
		r->>'name', r->>'city', r->>'address',
		nullif(r->>'stories', '')::int, nullif(r->>'year_built', '')::int,
		nullif(r->>'deadline', '')::date, coalesce(nullif(r->>'status', ''), 'unknown'),
		r->>'contact', r->>'phone', coalesce((r->>'called')::boolean, false), r->>'notes',
		coalesce(r->>'source', 'assistant paste'), now()
	from jsonb_array_elements(p_rows) as r
	where coalesce(r->>'name', '') <> ''
	on conflict (id) do update set
		name = excluded.name, city = excluded.city, address = excluded.address, stories = excluded.stories,
		year_built = excluded.year_built, deadline = excluded.deadline, status = excluded.status,
		contact = excluded.contact, phone = excluded.phone, called = excluded.called, notes = excluded.notes,
		source = excluded.source, updated_at = now();
	get diagnostics n = row_count;
	return n;
end $$;

-- Records an approved lead. Called by the server AFTER it tried
-- submit_website_lead (the existing website→CRM door). p_project_id is the
-- new CRM job, or null with p_crm_error when that write failed.
create or replace function public.assistant_record_lead(
	p_key text, p_building_id text, p_reason text, p_next_step text,
	p_project_id uuid default null, p_crm_error text default null
)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare b public.buildings; lead_id uuid;
begin
	if not public.assistant_check(p_key) then raise exception 'assistant: bad key'; end if;
	select * into b from public.buildings where id = p_building_id;
	if not found then raise exception 'assistant: no building %', p_building_id; end if;
	insert into public.assistant_leads (building_id, building, city, deadline, contact, phone, reason, next_step, project_id, crm_error)
	values (b.id, b.name, b.city, b.deadline, b.contact, b.phone, p_reason, p_next_step, p_project_id, p_crm_error)
	returning id into lead_id;
	if p_project_id is not null then
		update public.buildings set lead_project_id = p_project_id, updated_at = now() where id = b.id;
	end if;
	return lead_id;
end $$;

create or replace function public.assistant_log_run(p_key text, p_goal text, p_report text, p_tools text[])
returns void
language plpgsql security definer set search_path = public
as $$
begin
	if not public.assistant_check(p_key) then raise exception 'assistant: bad key'; end if;
	insert into public.assistant_runs (goal, report, tools_used) values (p_goal, p_report, coalesce(p_tools, '{}'));
end $$;

-- anon may CALL the doors; the doors decide.
grant execute on function public.assistant_buildings(text) to anon, authenticated;
grant execute on function public.assistant_programs(text) to anon, authenticated;
grant execute on function public.assistant_knowledge_get(text, text) to anon, authenticated;
grant execute on function public.assistant_leads_list(text) to anon, authenticated;
grant execute on function public.assistant_upsert_buildings(text, jsonb, boolean) to anon, authenticated;
grant execute on function public.assistant_record_lead(text, text, text, text, uuid, text) to anon, authenticated;
grant execute on function public.assistant_log_run(text, text, text, text[]) to anon, authenticated;
