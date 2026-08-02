create table public.project_risks (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete restrict,
 title text not null, description text not null, risk_type text not null, category text not null,
 probability smallint not null, impact smallint not null,
 risk_score smallint generated always as (probability * impact) stored,
 response_strategy text not null, response_plan text not null, trigger text,
 owner_membership_id uuid not null references public.project_members(id) on delete restrict,
 review_date date not null, status text not null default 'Identified',
 realization_notes text, realized_at timestamptz, realized_by uuid references public.profiles(id) on delete restrict,
 closure_notes text, closed_at timestamptz, closed_by uuid references public.profiles(id) on delete restrict,
 created_by uuid not null references public.profiles(id) on delete restrict, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint project_risks_title_check check(char_length(btrim(title)) between 1 and 200),
 constraint project_risks_description_check check(char_length(btrim(description)) between 1 and 4000),
 constraint project_risks_type_check check(risk_type in('Threat','Opportunity')),
 constraint project_risks_category_check check(category in('Scope','Schedule','Cost','Resources','Technical','Quality','Supplier','Compliance','Operational','Other')),
 constraint project_risks_probability_check check(probability between 1 and 5), constraint project_risks_impact_check check(impact between 1 and 5),
 constraint project_risks_strategy_check check((risk_type='Threat' and response_strategy in('Avoid','Reduce','Transfer','Accept','Escalate')) or (risk_type='Opportunity' and response_strategy in('Exploit','Enhance','Share','Accept','Escalate'))),
 constraint project_risks_response_plan_check check(char_length(btrim(response_plan)) between 1 and 4000),
 constraint project_risks_trigger_check check(trigger is null or char_length(btrim(trigger)) between 1 and 1000),
 constraint project_risks_status_check check(status in('Identified','Monitoring','Mitigating','Realized','Closed')),
 constraint project_risks_realization_notes_check check(realization_notes is null or char_length(btrim(realization_notes)) between 1 and 4000),
 constraint project_risks_closure_notes_check check(closure_notes is null or char_length(btrim(closure_notes)) between 1 and 4000),
 constraint project_risks_state_check check(
  (status in('Identified','Monitoring','Mitigating') and realization_notes is null and realized_at is null and realized_by is null and closure_notes is null and closed_at is null and closed_by is null) or
  (status='Realized' and realization_notes is not null and realized_at is not null and realized_by is not null and closure_notes is null and closed_at is null and closed_by is null) or
  (status='Closed' and closure_notes is not null and closed_at is not null and closed_by is not null and realization_notes is null and realized_at is null and realized_by is null)
 )
);
create index project_risks_project_status_review_idx on public.project_risks(project_id,status,review_date,id);
create index project_risks_project_owner_status_idx on public.project_risks(project_id,owner_membership_id,status);
create index project_risks_project_score_idx on public.project_risks(project_id,risk_score desc,id);

create or replace function private.risk_owner_is_eligible(p_project_id uuid,p_membership_id uuid)
returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.project_members pm join public.projects p on p.id=pm.project_id join public.organization_members om on om.organization_id=p.organization_id and om.user_id=pm.user_id and om.status='Active' where pm.id=p_membership_id and pm.project_id=p_project_id and pm.left_at is null and (pm.access_level='Project Member' or(pm.access_level='Project Manager' and pm.user_id=p.project_manager_id))) $$;

create or replace function private.protect_project_risk() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if tg_op='INSERT' then
  if new.status<>'Identified' or new.created_by<>auth.uid() or new.realization_notes is not null or new.realized_at is not null or new.realized_by is not null or new.closure_notes is not null or new.closed_at is not null or new.closed_by is not null then raise exception 'New risks must use trusted initial values.' using errcode='23514';end if;
 else
  if new.id is distinct from old.id or new.project_id is distinct from old.project_id or new.created_by is distinct from old.created_by or new.created_at is distinct from old.created_at then raise exception 'Risk identity fields cannot be changed.' using errcode='42501';end if;
  if old.status in('Realized','Closed') then raise exception 'Terminal risks cannot be changed.' using errcode='42501';end if;
 end if;
 new.title:=btrim(new.title);new.description:=btrim(new.description);new.response_plan:=btrim(new.response_plan);new.trigger:=nullif(btrim(new.trigger),'');new.realization_notes:=nullif(btrim(new.realization_notes),'');new.closure_notes:=nullif(btrim(new.closure_notes),'');new.updated_at:=now();return new;
end;$$;
create trigger project_risks_protect before insert or update on public.project_risks for each row execute function private.protect_project_risk();
alter table public.project_risks enable row level security;
create policy project_risks_select_project_access on public.project_risks for select to authenticated using(private.has_project_access(project_id));
revoke all on public.project_risks from anon,authenticated;grant select on public.project_risks to authenticated;

create or replace function public.create_project_risk(p_project_id uuid,p_title text,p_description text,p_risk_type text,p_category text,p_probability smallint,p_impact smallint,p_response_strategy text,p_response_plan text,p_trigger text,p_owner_membership_id uuid,p_review_date date)
returns public.project_risks language plpgsql security definer set search_path='' as $$ declare persisted public.project_risks%rowtype;begin
 if auth.uid() is null or not private.can_manage_project(p_project_id) then raise exception 'Risk creation is not permitted.' using errcode='42501';end if;
 if not private.risk_owner_is_eligible(p_project_id,p_owner_membership_id) then raise exception 'The selected risk owner is not eligible.' using errcode='23514';end if;
 insert into public.project_risks(project_id,title,description,risk_type,category,probability,impact,response_strategy,response_plan,trigger,owner_membership_id,review_date,created_by) values(p_project_id,p_title,p_description,p_risk_type,p_category,p_probability,p_impact,p_response_strategy,p_response_plan,p_trigger,p_owner_membership_id,p_review_date,auth.uid()) returning * into persisted;return persisted;end;$$;

create or replace function public.update_project_risk(p_risk_id uuid,p_title text,p_description text,p_risk_type text,p_category text,p_probability smallint,p_impact smallint,p_response_strategy text,p_response_plan text,p_trigger text,p_owner_membership_id uuid,p_review_date date)
returns public.project_risks language plpgsql security definer set search_path='' as $$ declare current_risk public.project_risks%rowtype;persisted public.project_risks%rowtype;begin
 if auth.uid() is null then raise exception 'Authentication is required.' using errcode='42501';end if;select * into current_risk from public.project_risks where id=p_risk_id for update;
 if current_risk.id is null or not private.can_manage_project(current_risk.project_id) then raise exception 'Risk update is not permitted.' using errcode='42501';end if;
 if current_risk.status in('Realized','Closed') then raise exception 'Terminal risks cannot be changed.' using errcode='42501';end if;
 if not private.risk_owner_is_eligible(current_risk.project_id,p_owner_membership_id) then raise exception 'The selected risk owner is not eligible.' using errcode='23514';end if;
 update public.project_risks set title=p_title,description=p_description,risk_type=p_risk_type,category=p_category,probability=p_probability,impact=p_impact,response_strategy=p_response_strategy,response_plan=p_response_plan,trigger=p_trigger,owner_membership_id=p_owner_membership_id,review_date=p_review_date where id=p_risk_id returning * into persisted;return persisted;end;$$;

create or replace function public.transition_project_risk(p_risk_id uuid,p_target_status text,p_notes text default null)
returns public.project_risks language plpgsql security definer set search_path='' as $$ declare current_risk public.project_risks%rowtype;persisted public.project_risks%rowtype;begin
 if auth.uid() is null then raise exception 'Authentication is required.' using errcode='42501';end if;select * into current_risk from public.project_risks where id=p_risk_id for update;
 if current_risk.id is null or not private.can_manage_project(current_risk.project_id) then raise exception 'Risk transition is not permitted.' using errcode='42501';end if;
 if current_risk.status in('Realized','Closed') then raise exception 'Risk transition is not permitted.' using errcode='42501';end if;
 if not ((current_risk.status='Identified' and p_target_status in('Monitoring','Mitigating','Realized','Closed')) or(current_risk.status='Monitoring' and p_target_status in('Mitigating','Realized','Closed')) or(current_risk.status='Mitigating' and p_target_status in('Monitoring','Realized','Closed'))) then raise exception 'Unsupported risk transition.' using errcode='22023';end if;
 if p_target_status in('Realized','Closed') and nullif(btrim(p_notes),'') is null then raise exception 'Meaningful terminal notes are required.' using errcode='22023';end if;
 update public.project_risks set status=p_target_status,realization_notes=case when p_target_status='Realized' then btrim(p_notes) end,realized_at=case when p_target_status='Realized' then now() end,realized_by=case when p_target_status='Realized' then auth.uid() end,closure_notes=case when p_target_status='Closed' then btrim(p_notes) end,closed_at=case when p_target_status='Closed' then now() end,closed_by=case when p_target_status='Closed' then auth.uid() end where id=p_risk_id returning * into persisted;return persisted;end;$$;

create or replace function public.get_project_risks(p_project_id uuid)
returns table(id uuid,project_id uuid,title text,description text,risk_type text,category text,probability smallint,impact smallint,risk_score smallint,response_strategy text,response_plan text,trigger text,owner_membership_id uuid,owner_user_id uuid,owner_name text,owner_access_level text,owner_is_eligible boolean,review_date date,status text,realization_notes text,realized_at timestamptz,realized_by uuid,realized_by_name text,closure_notes text,closed_at timestamptz,closed_by uuid,closed_by_name text,created_by uuid,created_by_name text,created_at timestamptz,updated_at timestamptz)
language sql stable security definer set search_path='' as $$ select r.id,r.project_id,r.title,r.description,r.risk_type,r.category,r.probability,r.impact,r.risk_score,r.response_strategy,r.response_plan,r.trigger,r.owner_membership_id,pm.user_id,op.full_name,pm.access_level,private.risk_owner_is_eligible(r.project_id,r.owner_membership_id),r.review_date,r.status,r.realization_notes,r.realized_at,r.realized_by,xp.full_name,r.closure_notes,r.closed_at,r.closed_by,cp.full_name,r.created_by,rp.full_name,r.created_at,r.updated_at from public.project_risks r join public.project_members pm on pm.id=r.owner_membership_id join public.profiles op on op.id=pm.user_id join public.profiles rp on rp.id=r.created_by left join public.profiles xp on xp.id=r.realized_by left join public.profiles cp on cp.id=r.closed_by where r.project_id=p_project_id and private.has_project_access(p_project_id) order by case when r.status in('Realized','Closed') then 1 else 0 end,case when r.status not in('Realized','Closed') and not private.risk_owner_is_eligible(r.project_id,r.owner_membership_id) then 0 else 1 end,case when r.status not in('Realized','Closed') and r.review_date<current_date then 0 else 1 end,case when r.status not in('Realized','Closed') and r.review_date=current_date then 0 else 1 end,case when r.risk_score>=17 then 0 when r.risk_score>=10 then 1 else 2 end,r.risk_score desc,r.review_date,r.created_at,r.id $$;

create or replace function public.get_eligible_risk_owners(p_project_id uuid)
returns table(membership_id uuid,user_id uuid,full_name text,access_level text) language plpgsql stable security definer set search_path='' as $$ begin if auth.uid() is null or not private.can_manage_project(p_project_id) then raise exception 'Risk management is not permitted.' using errcode='42501';end if;return query select pm.id,pm.user_id,pr.full_name,pm.access_level from public.project_members pm join public.profiles pr on pr.id=pm.user_id join public.projects p on p.id=pm.project_id join public.organization_members om on om.organization_id=p.organization_id and om.user_id=pm.user_id and om.status='Active' where pm.project_id=p_project_id and pm.left_at is null and(pm.access_level='Project Member' or(pm.access_level='Project Manager' and pm.user_id=p.project_manager_id)) order by pr.full_name,pm.id;end;$$;

revoke all on function private.risk_owner_is_eligible(uuid,uuid) from public;revoke all on function private.protect_project_risk() from public;
revoke all on function public.create_project_risk(uuid,text,text,text,text,smallint,smallint,text,text,text,uuid,date) from public;revoke all on function public.update_project_risk(uuid,text,text,text,text,smallint,smallint,text,text,text,uuid,date) from public;revoke all on function public.transition_project_risk(uuid,text,text) from public;revoke all on function public.get_project_risks(uuid) from public;revoke all on function public.get_eligible_risk_owners(uuid) from public;
grant execute on function public.create_project_risk(uuid,text,text,text,text,smallint,smallint,text,text,text,uuid,date) to authenticated;grant execute on function public.update_project_risk(uuid,text,text,text,text,smallint,smallint,text,text,text,uuid,date) to authenticated;grant execute on function public.transition_project_risk(uuid,text,text) to authenticated;grant execute on function public.get_project_risks(uuid) to authenticated;grant execute on function public.get_eligible_risk_owners(uuid) to authenticated;
