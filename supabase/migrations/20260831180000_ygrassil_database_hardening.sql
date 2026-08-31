-- Ygrassil database hardening.
-- Idempotent: safe to apply more than once through Supabase migration tooling.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

do $policies$
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
    execute format('create policy "%1$s owner read" on public.%1$I for select to authenticated using (owner_id = (select auth.uid()))', table_name);
    execute format('create policy "%1$s owner insert" on public.%1$I for insert to authenticated with check (owner_id = (select auth.uid()))', table_name);
    execute format('create policy "%1$s owner update" on public.%1$I for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()))', table_name);
    execute format('create policy "%1$s owner delete" on public.%1$I for delete to authenticated using (owner_id = (select auth.uid()))', table_name);
  end loop;
end;
$policies$;

do $indexes$
declare
  spec record;
  equivalent_index_exists boolean;
begin
  for spec in
    select * from (values
      ('activity_log', 'actor_id', 'activity_log_actor_idx'),
      ('business_research', 'owner_id', 'business_research_owner_idx'),
      ('email_drafts', 'approved_by', 'email_drafts_approved_by_idx'),
      ('email_drafts', 'lead_id', 'email_drafts_lead_idx'),
      ('email_drafts', 'owner_id', 'email_drafts_owner_idx'),
      ('email_drafts', 'proposal_id', 'email_drafts_proposal_idx'),
      ('email_drafts', 'thread_id', 'email_drafts_thread_idx'),
      ('email_messages', 'lead_id', 'email_messages_lead_idx'),
      ('email_threads', 'owner_id', 'email_threads_owner_idx'),
      ('followups', 'lead_id', 'followups_lead_idx'),
      ('followups', 'thread_id', 'followups_thread_idx'),
      ('lead_contacts', 'owner_id', 'lead_contacts_owner_idx'),
      ('leads', 'campaign_id', 'leads_campaign_idx'),
      ('opportunities', 'owner_id', 'opportunities_owner_idx'),
      ('proposals', 'opportunity_id', 'proposals_opportunity_idx'),
      ('proposals', 'owner_id', 'proposals_owner_idx'),
      ('reply_classifications', 'owner_id', 'reply_classifications_owner_idx'),
      ('sending_events', 'draft_id', 'sending_events_draft_idx'),
      ('sending_events', 'lead_id', 'sending_events_lead_idx'),
      ('sending_events', 'message_id', 'sending_events_message_idx'),
      ('website_audits', 'owner_id', 'website_audits_owner_idx')
    ) as requested(table_name, column_name, index_name)
  loop
    if to_regclass(format('public.%I', spec.index_name)) is null then
      select exists (
        select 1
        from pg_index index_meta
        join pg_class table_meta on table_meta.oid = index_meta.indrelid
        join pg_namespace schema_meta on schema_meta.oid = table_meta.relnamespace
        join pg_attribute column_meta
          on column_meta.attrelid = index_meta.indrelid
         and column_meta.attname = spec.column_name
         and column_meta.attnum > 0
        where schema_meta.nspname = 'public'
          and table_meta.relname = spec.table_name
          and index_meta.indnkeyatts = 1
          and index_meta.indnatts = 1
          and index_meta.indkey[0] = column_meta.attnum
          and index_meta.indpred is null
          and index_meta.indexprs is null
      ) into equivalent_index_exists;

      if not equivalent_index_exists then
        execute format(
          'create index %I on public.%I (%I)',
          spec.index_name,
          spec.table_name,
          spec.column_name
        );
      end if;
    end if;
  end loop;
end;
$indexes$;
