create table public.project_status_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  reporting_period_start date not null,
  reporting_period_end date not null,
  status text not null default 'Draft',
  overall_health text not null, scope_health text not null, schedule_health text not null,
  budget_health text not null, resource_health text not null, risk_health text not null,
  executive_summary text not null, accomplishments text not null, planned_work text not null,
  concerns text, decisions_required text, support_required text,
  project_name_snapshot text, project_status_snapshot text, project_lifecycle_phase_snapshot text,
  upcoming_milestones_snapshot jsonb, top_risks_snapshot jsonb, top_issues_snapshot jsonb,
  overdue_actions_snapshot jsonb, recent_decisions_snapshot jsonb,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  last_edited_by uuid not null references public.profiles(id) on delete restrict,
  last_edited_at timestamptz not null default now(),
  published_by uuid references public.profiles(id) on delete restrict,
  published_at timestamptz,
  constraint project_status_reports_period_unique unique(project_id,reporting_period_start,reporting_period_end),
  constraint project_status_reports_period_check check(reporting_period_start<=reporting_period_end and reporting_period_end<=current_date),
  constraint project_status_reports_status_check check(status in('Draft','Published')),
  constraint project_status_reports_health_check check(overall_health in('Not Assessed','Green','Amber','Red') and scope_health in('Not Assessed','Green','Amber','Red') and schedule_health in('Not Assessed','Green','Amber','Red') and budget_health in('Not Assessed','Green','Amber','Red') and resource_health in('Not Assessed','Green','Amber','Red') and risk_health in('Not Assessed','Green','Amber','Red')),
  constraint project_status_reports_text_check check(char_length(btrim(executive_summary)) between 1 and 4000 and char_length(btrim(accomplishments)) between 1 and 4000 and char_length(btrim(planned_work)) between 1 and 4000 and (concerns is null or char_length(btrim(concerns)) between 1 and 4000) and (decisions_required is null or char_length(btrim(decisions_required)) between 1 and 4000) and (support_required is null or char_length(btrim(support_required)) between 1 and 4000)),
  constraint project_status_reports_publication_check check(
    (status='Draft' and published_by is null and published_at is null and project_name_snapshot is null and project_status_snapshot is null and project_lifecycle_phase_snapshot is null and upcoming_milestones_snapshot is null and top_risks_snapshot is null and top_issues_snapshot is null and overdue_actions_snapshot is null and recent_decisions_snapshot is null)
    or (status='Published' and published_by is not null and published_at is not null and project_name_snapshot is not null and project_status_snapshot is not null and project_lifecycle_phase_snapshot is not null and upcoming_milestones_snapshot is not null and top_risks_snapshot is not null and top_issues_snapshot is not null and overdue_actions_snapshot is not null and recent_decisions_snapshot is not null)
  )
);
create index project_status_reports_project_period_idx on public.project_status_reports(project_id,reporting_period_end desc,id);

create function private.protect_project_status_report() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_op='INSERT' then
    if new.created_by<>auth.uid() or new.last_edited_by<>auth.uid() or new.status<>'Draft' or new.published_by is not null then raise exception 'Status report audit values are trusted.' using errcode='23514'; end if;
  else
    if old.status='Published' then raise exception 'Published status reports are immutable.' using errcode='42501'; end if;
    if new.id is distinct from old.id or new.project_id is distinct from old.project_id or new.created_by is distinct from old.created_by or new.created_at is distinct from old.created_at then raise exception 'Status report identity fields cannot change.' using errcode='42501'; end if;
  end if;
  if new.reporting_period_start < (select p.start_date from public.projects p where p.id=new.project_id) then raise exception 'Reporting period cannot precede the project start date.' using errcode='22023'; end if;
  new.executive_summary:=btrim(new.executive_summary); new.accomplishments:=btrim(new.accomplishments); new.planned_work:=btrim(new.planned_work);
  new.concerns:=nullif(btrim(new.concerns),''); new.decisions_required:=nullif(btrim(new.decisions_required),''); new.support_required:=nullif(btrim(new.support_required),'');
  return new;
end $$;
create trigger project_status_reports_protect before insert or update on public.project_status_reports for each row execute function private.protect_project_status_report();

alter table public.project_status_reports enable row level security;
create policy project_status_reports_select on public.project_status_reports for select to authenticated using(private.can_manage_project(project_id) or (status='Published' and private.has_project_access(project_id)));
revoke all on public.project_status_reports from anon,authenticated;
grant select on public.project_status_reports to authenticated;

create function public.create_project_status_report(p_project_id uuid,p_reporting_period_start date,p_reporting_period_end date,p_overall_health text,p_scope_health text,p_schedule_health text,p_budget_health text,p_resource_health text,p_risk_health text,p_executive_summary text,p_accomplishments text,p_planned_work text,p_concerns text,p_decisions_required text,p_support_required text)
returns public.project_status_reports language plpgsql security definer set search_path='' as $$ declare r public.project_status_reports%rowtype; begin
 if auth.uid() is null or not private.can_manage_project(p_project_id) then raise exception 'Status report creation is not permitted.' using errcode='42501'; end if;
 insert into public.project_status_reports(project_id,reporting_period_start,reporting_period_end,overall_health,scope_health,schedule_health,budget_health,resource_health,risk_health,executive_summary,accomplishments,planned_work,concerns,decisions_required,support_required,created_by,last_edited_by)
 values(p_project_id,p_reporting_period_start,p_reporting_period_end,p_overall_health,p_scope_health,p_schedule_health,p_budget_health,p_resource_health,p_risk_health,p_executive_summary,p_accomplishments,p_planned_work,nullif(btrim(p_concerns),''),nullif(btrim(p_decisions_required),''),nullif(btrim(p_support_required),''),auth.uid(),auth.uid()) returning * into r; return r;
exception when unique_violation then raise exception 'A status report already exists for this reporting period.' using errcode='23505'; end $$;

create function public.update_project_status_report(p_report_id uuid,p_reporting_period_start date,p_reporting_period_end date,p_overall_health text,p_scope_health text,p_schedule_health text,p_budget_health text,p_resource_health text,p_risk_health text,p_executive_summary text,p_accomplishments text,p_planned_work text,p_concerns text,p_decisions_required text,p_support_required text)
returns public.project_status_reports language plpgsql security definer set search_path='' as $$ declare x public.project_status_reports%rowtype;r public.project_status_reports%rowtype; begin
 if auth.uid() is null then raise exception 'Authentication is required.' using errcode='42501'; end if; select * into x from public.project_status_reports where id=p_report_id for update;
 if x.id is null or x.status<>'Draft' or not private.can_manage_project(x.project_id) then raise exception 'Status report update is not permitted.' using errcode='42501'; end if;
 update public.project_status_reports set reporting_period_start=p_reporting_period_start,reporting_period_end=p_reporting_period_end,overall_health=p_overall_health,scope_health=p_scope_health,schedule_health=p_schedule_health,budget_health=p_budget_health,resource_health=p_resource_health,risk_health=p_risk_health,executive_summary=p_executive_summary,accomplishments=p_accomplishments,planned_work=p_planned_work,concerns=nullif(btrim(p_concerns),''),decisions_required=nullif(btrim(p_decisions_required),''),support_required=nullif(btrim(p_support_required),''),last_edited_by=auth.uid(),last_edited_at=now() where id=p_report_id returning * into r;return r;
exception when unique_violation then raise exception 'A status report already exists for this reporting period.' using errcode='23505'; end $$;

create function public.publish_project_status_report(p_report_id uuid,p_confirm boolean) returns public.project_status_reports language plpgsql security definer set search_path='' as $$
declare x public.project_status_reports%rowtype;p public.projects%rowtype;r public.project_status_reports%rowtype;begin
 if auth.uid() is null or not p_confirm then raise exception 'Publication confirmation is required.' using errcode='22023';end if;
 select * into x from public.project_status_reports where id=p_report_id for update;
 if x.id is null or x.status<>'Draft' or not private.can_manage_project(x.project_id) then raise exception 'Status report publication is not permitted.' using errcode='42501';end if;
 select * into p from public.projects where id=x.project_id;
 update public.project_status_reports set status='Published',project_name_snapshot=p.name,project_status_snapshot=p.status,project_lifecycle_phase_snapshot=p.lifecycle_phase,
 upcoming_milestones_snapshot=jsonb_build_object('total',(select count(*) from public.milestones m where m.project_id=x.project_id and m.status='Planned' and m.target_date between x.reporting_period_end and x.reporting_period_end+30),'items',(select coalesce(jsonb_agg(to_jsonb(q)),'[]'::jsonb) from(select m.title,m.target_date,m.status from public.milestones m where m.project_id=x.project_id and m.status='Planned' and m.target_date between x.reporting_period_end and x.reporting_period_end+30 order by m.target_date,m.id limit 10)q)),
 top_risks_snapshot=jsonb_build_object('total',(select count(*) from public.project_risks z where z.project_id=x.project_id and z.status not in('Realized','Closed')),'items',(select coalesce(jsonb_agg(to_jsonb(q)),'[]'::jsonb) from(select z.title,z.risk_type,z.category,z.risk_score,z.status,z.review_date,pr.full_name owner_name from public.project_risks z join public.project_members pm on pm.id=z.owner_membership_id join public.profiles pr on pr.id=pm.user_id where z.project_id=x.project_id and z.status not in('Realized','Closed') order by z.risk_score desc,z.review_date,z.id limit 5)q)),
 top_issues_snapshot=jsonb_build_object('total',(select count(*) from public.project_issues i where i.project_id=x.project_id and i.status not in('Resolved','Cancelled')),'items',(select coalesce(jsonb_agg(to_jsonb(q)),'[]'::jsonb) from(select i.title,i.severity,i.status,i.target_resolution_date,pr.full_name owner_name from public.project_issues i join public.project_members pm on pm.id=i.owner_membership_id join public.profiles pr on pr.id=pm.user_id where i.project_id=x.project_id and i.status not in('Resolved','Cancelled') order by case i.severity when 'Critical' then 0 when 'High' then 1 when 'Medium' then 2 else 3 end,case when i.status='Blocked' then 0 else 1 end,i.target_resolution_date,i.id limit 5)q)),
 overdue_actions_snapshot=jsonb_build_object('total',(select count(*) from public.project_actions a where a.project_id=x.project_id and a.status in('Open','In Progress','Blocked') and a.due_date<x.reporting_period_end),'items',(select coalesce(jsonb_agg(to_jsonb(q)),'[]'::jsonb) from(select a.title,a.priority,a.status,a.due_date,pr.full_name owner_name from public.project_actions a join public.project_members pm on pm.id=a.owner_membership_id join public.profiles pr on pr.id=pm.user_id where a.project_id=x.project_id and a.status in('Open','In Progress','Blocked') and a.due_date<x.reporting_period_end order by a.due_date,a.id limit 10)q)),
 recent_decisions_snapshot=jsonb_build_object('total',(select count(*) from public.project_decisions d where d.project_id=x.project_id and d.decision_date between x.reporting_period_start and x.reporting_period_end),'items',(select coalesce(jsonb_agg(to_jsonb(q)),'[]'::jsonb) from(select d.title,d.decision,d.decision_maker_name,d.decision_date,d.effective_date,d.follow_up_notes from public.project_decisions d where d.project_id=x.project_id and d.decision_date between x.reporting_period_start and x.reporting_period_end order by d.decision_date desc,d.id limit 10)q)),
 published_by=auth.uid(),published_at=now() where id=x.id returning * into r;return r;end $$;

revoke all on function private.protect_project_status_report() from public;
revoke all on function public.create_project_status_report(uuid,date,date,text,text,text,text,text,text,text,text,text,text,text,text) from public;
revoke all on function public.update_project_status_report(uuid,date,date,text,text,text,text,text,text,text,text,text,text,text,text) from public;
revoke all on function public.publish_project_status_report(uuid,boolean) from public;
grant execute on function public.create_project_status_report(uuid,date,date,text,text,text,text,text,text,text,text,text,text,text,text) to authenticated;
grant execute on function public.update_project_status_report(uuid,date,date,text,text,text,text,text,text,text,text,text,text,text,text) to authenticated;
grant execute on function public.publish_project_status_report(uuid,boolean) to authenticated;
