create extension if not exists pgcrypto;

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  market text,
  industry text,
  opportunity text,
  status text not null default 'draft',
  daily_send_limit integer not null default 10 check (daily_send_limit >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  company_name text not null,
  website_url text,
  normalized_domain text,
  country text,
  city text,
  industry text,
  source text not null default 'manual',
  status text not null default 'discovered',
  score integer not null default 0 check (score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  full_name text,
  role_title text,
  email text,
  phone text,
  linkedin_url text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.website_audits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  url text not null,
  findings jsonb not null default '{}'::jsonb,
  score integer check (score between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.business_research (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  source_url text,
  summary text,
  evidence jsonb not null default '[]'::jsonb,
  confidence numeric(4,3) check (confidence >= 0 and confidence <= 1),
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  title text not null,
  pain_point text,
  value_hypothesis text,
  confidence numeric(4,3) check (confidence >= 0 and confidence <= 1),
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  title text not null,
  body text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_threads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  provider_thread_id text,
  subject text,
  status text not null default 'draft',
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.email_drafts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  proposal_id uuid references public.proposals(id) on delete set null,
  thread_id uuid references public.email_threads(id) on delete set null,
  to_email text not null,
  subject text not null,
  body text not null,
  status text not null default 'awaiting_approval',
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.email_messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  thread_id uuid references public.email_threads(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  direction text not null check (direction in ('outbound', 'inbound')),
  provider_message_id text,
  from_email text,
  to_email text,
  subject text,
  body text,
  sent_at timestamptz,
  received_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reply_classifications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  message_id uuid not null references public.email_messages(id) on delete cascade,
  classification text not null,
  confidence numeric(4,3) check (confidence >= 0 and confidence <= 1),
  reasoning text,
  created_at timestamptz not null default now()
);

create table if not exists public.followups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  thread_id uuid references public.email_threads(id) on delete cascade,
  due_at timestamptz not null,
  status text not null default 'scheduled',
  cancelled_reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.suppression_list (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  email text,
  domain text,
  reason text not null,
  created_at timestamptz not null default now(),
  constraint suppression_has_target check (email is not null or domain is not null)
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sending_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  draft_id uuid references public.email_drafts(id) on delete set null,
  message_id uuid references public.email_messages(id) on delete set null,
  recipient_email text not null,
  was_test_mode boolean not null default true,
  status text not null,
  provider_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, key)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists campaigns_set_updated_at on public.campaigns;
create trigger campaigns_set_updated_at before update on public.campaigns for each row execute function public.set_updated_at();
drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_updated_at();
drop trigger if exists proposals_set_updated_at on public.proposals;
create trigger proposals_set_updated_at before update on public.proposals for each row execute function public.set_updated_at();
drop trigger if exists system_settings_set_updated_at on public.system_settings;
create trigger system_settings_set_updated_at before update on public.system_settings for each row execute function public.set_updated_at();

create index if not exists campaigns_owner_status_idx on public.campaigns(owner_id, status, created_at desc);
create index if not exists leads_owner_campaign_idx on public.leads(owner_id, campaign_id);
create index if not exists leads_owner_status_idx on public.leads(owner_id, status, created_at desc);
create index if not exists leads_domain_idx on public.leads(normalized_domain) where normalized_domain is not null;
create index if not exists lead_contacts_lead_idx on public.lead_contacts(lead_id);
create index if not exists lead_contacts_email_idx on public.lead_contacts(lower(email)) where email is not null;
create index if not exists website_audits_lead_idx on public.website_audits(lead_id, created_at desc);
create index if not exists business_research_lead_idx on public.business_research(lead_id, created_at desc);
create index if not exists opportunities_lead_status_idx on public.opportunities(lead_id, status);
create index if not exists proposals_lead_status_idx on public.proposals(lead_id, status);
create index if not exists email_threads_lead_idx on public.email_threads(lead_id, last_message_at desc);
create index if not exists email_messages_thread_idx on public.email_messages(thread_id, created_at desc);
create index if not exists email_messages_reply_idx on public.email_messages(owner_id, direction, received_at desc);
create index if not exists reply_classifications_message_idx on public.reply_classifications(message_id);
create index if not exists followups_due_idx on public.followups(owner_id, status, due_at);
create index if not exists suppression_email_idx on public.suppression_list(owner_id, lower(email)) where email is not null;
create index if not exists suppression_domain_idx on public.suppression_list(owner_id, lower(domain)) where domain is not null;
create index if not exists activity_log_owner_time_idx on public.activity_log(owner_id, created_at desc);
create index if not exists sending_events_owner_time_idx on public.sending_events(owner_id, created_at desc);

alter table public.campaigns enable row level security;
alter table public.leads enable row level security;
alter table public.lead_contacts enable row level security;
alter table public.website_audits enable row level security;
alter table public.business_research enable row level security;
alter table public.opportunities enable row level security;
alter table public.proposals enable row level security;
alter table public.email_drafts enable row level security;
alter table public.email_messages enable row level security;
alter table public.email_threads enable row level security;
alter table public.reply_classifications enable row level security;
alter table public.followups enable row level security;
alter table public.suppression_list enable row level security;
alter table public.activity_log enable row level security;
alter table public.sending_events enable row level security;
alter table public.system_settings enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'campaigns', 'leads', 'lead_contacts', 'website_audits', 'business_research',
    'opportunities', 'proposals', 'email_drafts', 'email_messages', 'email_threads',
    'reply_classifications', 'followups', 'suppression_list', 'activity_log',
    'sending_events', 'system_settings'
  ]
  loop
    execute format('drop policy if exists "%1$s owner read" on public.%1$I', table_name);
    execute format('drop policy if exists "%1$s owner insert" on public.%1$I', table_name);
    execute format('drop policy if exists "%1$s owner update" on public.%1$I', table_name);
    execute format('drop policy if exists "%1$s owner delete" on public.%1$I', table_name);
    execute format('create policy "%1$s owner read" on public.%1$I for select to authenticated using (owner_id = auth.uid())', table_name);
    execute format('create policy "%1$s owner insert" on public.%1$I for insert to authenticated with check (owner_id = auth.uid())', table_name);
    execute format('create policy "%1$s owner update" on public.%1$I for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid())', table_name);
    execute format('create policy "%1$s owner delete" on public.%1$I for delete to authenticated using (owner_id = auth.uid())', table_name);
  end loop;
end;
$$;
