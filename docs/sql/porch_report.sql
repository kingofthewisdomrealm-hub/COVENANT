-- The Vero Porch — traffic report for the private attribution page.
-- Run once in Lovable Cloud → SQL editor. Safe to re-run. Reads web_events
-- only (the table the website's /api/track collector already fills).
-- Same lock as attribution_report: the caller must pass the secret.

create or replace function public.porch_report(p_secret text, p_days int default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  since timestamptz := case when p_days is null or p_days <= 0 then '1970-01-01'::timestamptz else now() - (p_days || ' days')::interval end;
  out jsonb;
begin
  if p_secret is null or p_secret <> (select value from app_config where key = 'attribution_secret') then
    raise exception 'unauthorized';
  end if;

  with porch as (
    select *, coalesce(visitor_id, ip_hash, session_id) as who
    from web_events
    where at >= since and (page = '/porch' or page like '/porch/%')
  ),
  views as (select * from porch where event = 'page_view'),
  first_seen as (select who, min(at) as first_at from views where who is not null group by who),
  reader_leads as (
    select distinct f.who
    from first_seen f
    join web_events e on coalesce(e.visitor_id, e.ip_hash, e.session_id) = f.who
    where e.event = 'generate_lead' and e.at >= f.first_at
  )
  select jsonb_build_object(
    'generated_at', now(),
    'days', p_days,
    'totals', jsonb_build_object(
      'views', (select count(*) from views),
      'visitors', (select count(distinct who) from views),
      'qr_scans', (select count(*) from views where campaign ilike 'porch%' or channel = 'flyer_qr'),
      'leads_on_porch', (select count(*) from porch where event = 'generate_lead'),
      'readers_who_became_leads', (select count(*) from reader_leads),
      'phone_taps', (select count(*) from porch where event in ('phone_click', 'sms_click'))
    ),
    'by_page', coalesce((select jsonb_agg(x order by x.views desc) from (
        select page, count(*) as views, count(distinct who) as visitors
        from views group by page order by count(*) desc limit 60) x), '[]'::jsonb),
    'by_channel', coalesce((select jsonb_agg(x order by x.views desc) from (
        select coalesce(channel, 'unknown') as channel, count(*) as views, count(distinct who) as visitors
        from views group by 1) x), '[]'::jsonb),
    'by_campaign', coalesce((select jsonb_agg(x order by x.views desc) from (
        select campaign, count(*) as views, count(distinct who) as visitors
        from views where campaign is not null group by campaign) x), '[]'::jsonb),
    'by_city', coalesce((select jsonb_agg(x order by x.views desc) from (
        select coalesce(city, 'Unknown') as city, region, count(*) as views, count(distinct who) as visitors
        from views group by 1, 2 order by count(*) desc limit 15) x), '[]'::jsonb),
    'daily', coalesce((select jsonb_agg(x order by x.day) from (
        select to_char(date_trunc('day', at at time zone 'America/New_York'), 'YYYY-MM-DD') as day,
               count(*) as views, count(distinct who) as visitors
        from views where at >= now() - interval '60 days' group by 1) x), '[]'::jsonb)
  ) into out;

  return out;
end;
$$;

revoke all on function public.porch_report(text, int) from public;
grant execute on function public.porch_report(text, int) to anon, authenticated;
