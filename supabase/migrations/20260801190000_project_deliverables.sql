create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  milestone_id uuid references public.milestones(id) on delete restrict,
  title text not null,
  description text,
  acceptance_criteria text not null,
  owner_membership_id uuid not null references public.project_members(id) on delete restrict,
  due_date date not null,
  status text not null default 'Planned',
  review_feedback text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  accepted_at timestamptz,
  accepted_by uuid references public.profiles(id) on delete restrict,
  cancelled_at timestamptz,
  constraint deliverables_title_check check (char_length(btrim(title)) between 1 and 200),
  constraint deliverables_description_check check (description is null or char_length(btrim(description)) between 1 and 4000),
  constraint deliverables_acceptance_criteria_check check (char_length(btrim(acceptance_criteria)) between 1 and 4000),
  constraint deliverables_review_feedback_check check (review_feedback is null or char_length(btrim(review_feedback)) between 1 and 4000),
  constraint deliverables_status_check check (status in ('Planned','In Progress','Ready for Acceptance','Accepted','Cancelled')),
  constraint deliverables_state_check check (
    (status='Planned' and submitted_at is null and accepted_at is null and accepted_by is null and cancelled_at is null) or
    (status='In Progress' and submitted_at is null and accepted_at is null and accepted_by is null and cancelled_at is null) or
    (status='Ready for Acceptance' and submitted_at is not null and accepted_at is null and accepted_by is null and cancelled_at is null) or
    (status='Accepted' and submitted_at is not null and accepted_at is not null and accepted_by is not null and cancelled_at is null) or
    (status='Cancelled' and accepted_at is null and accepted_by is null and cancelled_at is not null)
  )
);

create index deliverables_project_due_idx on public.deliverables(project_id,due_date,id);
create index deliverables_owner_idx on public.deliverables(owner_membership_id);
create index deliverables_milestone_idx on public.deliverables(milestone_id) where milestone_id is not null;

create or replace function private.deliverable_owner_is_eligible(p_project_id uuid,p_membership_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
  select exists (
    select 1 from public.project_members pm
    join public.projects p on p.id=pm.project_id
    join public.organization_members om on om.organization_id=p.organization_id and om.user_id=pm.user_id and om.status='Active'
    where pm.id=p_membership_id and pm.project_id=p_project_id and pm.left_at is null
      and (pm.access_level='Project Member' or (pm.access_level='Project Manager' and pm.user_id=p.project_manager_id))
  )
$$;

create or replace function private.protect_deliverable()
returns trigger language plpgsql security definer set search_path='' as $$
declare milestone_project uuid; milestone_status text;
begin
  if tg_op='UPDATE' then
    if new.id is distinct from old.id or new.project_id is distinct from old.project_id or new.created_by is distinct from old.created_by or new.created_at is distinct from old.created_at then
      raise exception 'Deliverable identity fields cannot be changed.' using errcode='42501';
    end if;
    if old.status in ('Accepted','Cancelled') then raise exception 'Terminal deliverables cannot be changed.' using errcode='42501'; end if;
    if old.status='Ready for Acceptance' and new.status='Ready for Acceptance' then raise exception 'Submitted deliverables are read-only while awaiting acceptance.' using errcode='42501'; end if;
  end if;

  if tg_op='INSERT' or new.owner_membership_id is distinct from old.owner_membership_id then
    if not private.deliverable_owner_is_eligible(new.project_id,new.owner_membership_id) then raise exception 'The selected deliverable owner is not eligible.' using errcode='23514'; end if;
  end if;
  if new.milestone_id is not null and (tg_op='INSERT' or new.milestone_id is distinct from old.milestone_id) then
    select project_id,status into milestone_project,milestone_status from public.milestones where id=new.milestone_id;
    if milestone_project is null or milestone_project<>new.project_id then raise exception 'The selected milestone does not belong to this project.' using errcode='23514'; end if;
    if milestone_status<>'Planned' then raise exception 'Only planned milestones may receive new deliverable associations.' using errcode='23514'; end if;
  end if;

  if tg_op='INSERT' then
    if new.status<>'Planned' or new.submitted_at is not null or new.accepted_at is not null or new.accepted_by is not null or new.cancelled_at is not null then raise exception 'New deliverables must be Planned.' using errcode='23514'; end if;
  elsif new.status is distinct from old.status then
    if old.status='Planned' and new.status='In Progress' then null;
    elsif old.status='In Progress' and new.status='Ready for Acceptance' then new.submitted_at:=now();
    elsif old.status='Ready for Acceptance' and new.status='Accepted' then new.accepted_at:=now();new.accepted_by:=auth.uid();
    elsif old.status='Ready for Acceptance' and new.status='In Progress' then
      if new.review_feedback is null or btrim(new.review_feedback)='' then raise exception 'Review feedback is required when returning a deliverable.' using errcode='22023'; end if;
      new.submitted_at:=null;
    elsif old.status in ('Planned','In Progress','Ready for Acceptance') and new.status='Cancelled' then new.cancelled_at:=now();
    else raise exception 'Unsupported deliverable transition.' using errcode='22023'; end if;
  else
    new.submitted_at:=old.submitted_at;new.accepted_at:=old.accepted_at;new.accepted_by:=old.accepted_by;new.cancelled_at:=old.cancelled_at;
  end if;
  new.updated_at:=now();return new;
end;$$;

create trigger deliverables_protect before insert or update on public.deliverables for each row execute function private.protect_deliverable();

create or replace function private.guard_deliverable_accepting_identity()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if new.accepted_by is distinct from old.accepted_by and not (old.status='Ready for Acceptance' and new.status='Accepted') then
    raise exception 'Accepting identity is trusted.' using errcode='42501';
  end if;
  return new;
end;$$;
create trigger deliverables_accepting_identity_guard before update on public.deliverables for each row execute function private.guard_deliverable_accepting_identity();

alter table public.deliverables enable row level security;
create policy deliverables_select_project_access on public.deliverables for select to authenticated using(private.has_project_access(project_id));
create policy deliverables_insert_manager on public.deliverables for insert to authenticated with check(private.can_manage_project(project_id) and created_by=auth.uid() and status='Planned');
create policy deliverables_update_manager on public.deliverables for update to authenticated using(private.can_manage_project(project_id)) with check(private.can_manage_project(project_id));
revoke all on public.deliverables from anon,authenticated;
grant select,insert,update on public.deliverables to authenticated;

create or replace function public.transition_deliverable(p_deliverable_id uuid,p_operation text,p_review_feedback text default null)
returns public.deliverables language plpgsql security definer set search_path='' as $$
declare current_deliverable public.deliverables%rowtype; next_status text; persisted public.deliverables%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication is required.' using errcode='42501';end if;
  select * into current_deliverable from public.deliverables where id=p_deliverable_id for update;
  if current_deliverable.id is null or not private.can_manage_project(current_deliverable.project_id) then raise exception 'Deliverable transition is not permitted.' using errcode='42501';end if;
  next_status:=case p_operation when 'start' then 'In Progress' when 'submit' then 'Ready for Acceptance' when 'accept' then 'Accepted' when 'return' then 'In Progress' when 'cancel' then 'Cancelled' else null end;
  if next_status is null then raise exception 'Unsupported deliverable operation.' using errcode='22023';end if;
  update public.deliverables set status=next_status,review_feedback=case when p_operation='return' then nullif(btrim(p_review_feedback),'') else review_feedback end where id=current_deliverable.id returning * into persisted;
  return persisted;
end;$$;

create or replace function public.get_project_deliverables(p_project_id uuid)
returns table(id uuid,project_id uuid,milestone_id uuid,milestone_title text,title text,description text,acceptance_criteria text,owner_membership_id uuid,owner_name text,owner_access_level text,due_date date,status text,review_feedback text,created_at timestamptz,updated_at timestamptz,submitted_at timestamptz,accepted_at timestamptz,accepted_by uuid,accepted_by_name text,cancelled_at timestamptz)
language sql stable security definer set search_path='' as $$
  select d.id,d.project_id,d.milestone_id,m.title,d.title,d.description,d.acceptance_criteria,d.owner_membership_id,op.full_name,pm.access_level,d.due_date,d.status,d.review_feedback,d.created_at,d.updated_at,d.submitted_at,d.accepted_at,d.accepted_by,ap.full_name,d.cancelled_at
  from public.deliverables d join public.project_members pm on pm.id=d.owner_membership_id join public.profiles op on op.id=pm.user_id
  left join public.milestones m on m.id=d.milestone_id left join public.profiles ap on ap.id=d.accepted_by
  where d.project_id=p_project_id and private.has_project_access(p_project_id)
  order by case when d.status in('Accepted','Cancelled') then 1 else 0 end,d.due_date,d.id
$$;

create or replace function public.get_eligible_deliverable_owners(p_project_id uuid)
returns table(membership_id uuid,user_id uuid,full_name text,access_level text)
language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null or not private.can_manage_project(p_project_id) then raise exception 'Deliverable management is not permitted.' using errcode='42501';end if;
  return query select pm.id,pm.user_id,pr.full_name,pm.access_level from public.project_members pm join public.profiles pr on pr.id=pm.user_id join public.projects p on p.id=pm.project_id join public.organization_members om on om.organization_id=p.organization_id and om.user_id=pm.user_id and om.status='Active' where pm.project_id=p_project_id and pm.left_at is null and (pm.access_level='Project Member' or (pm.access_level='Project Manager' and pm.user_id=p.project_manager_id)) order by pr.full_name,pm.id;
end;$$;

create or replace function public.get_assignable_deliverable_milestones(p_project_id uuid)
returns table(id uuid,title text,target_date date)
language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null or not private.can_manage_project(p_project_id) then raise exception 'Deliverable management is not permitted.' using errcode='42501';end if;
  return query select m.id,m.title,m.target_date from public.milestones m where m.project_id=p_project_id and m.status='Planned' order by m.target_date,m.id;
end;$$;

revoke all on function private.deliverable_owner_is_eligible(uuid,uuid) from public;
revoke all on function private.protect_deliverable() from public;
revoke all on function private.guard_deliverable_accepting_identity() from public;
revoke all on function public.transition_deliverable(uuid,text,text) from public;
revoke all on function public.get_project_deliverables(uuid) from public;
revoke all on function public.get_eligible_deliverable_owners(uuid) from public;
revoke all on function public.get_assignable_deliverable_milestones(uuid) from public;
grant execute on function public.transition_deliverable(uuid,text,text) to authenticated;
grant execute on function public.get_project_deliverables(uuid) to authenticated;
grant execute on function public.get_eligible_deliverable_owners(uuid) to authenticated;
grant execute on function public.get_assignable_deliverable_milestones(uuid) to authenticated;
