create table public.project_actions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  title text not null,
  description text,
  owner_membership_id uuid not null references public.project_members(id) on delete restrict,
  due_date date not null,
  priority text not null,
  status text not null default 'Open',
  completion_notes text,
  completed_at timestamptz,
  completed_by uuid references public.profiles(id) on delete restrict,
  cancelled_at timestamptz,
  cancelled_by uuid references public.profiles(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_actions_title_check check (char_length(btrim(title)) between 1 and 200),
  constraint project_actions_description_check check (description is null or char_length(btrim(description)) between 1 and 4000),
  constraint project_actions_completion_notes_check check (completion_notes is null or char_length(btrim(completion_notes)) between 1 and 4000),
  constraint project_actions_priority_check check (priority in ('Low','Medium','High','Critical')),
  constraint project_actions_status_check check (status in ('Open','In Progress','Blocked','Completed','Cancelled')),
  constraint project_actions_state_check check (
    (status in ('Open','In Progress','Blocked') and completion_notes is null and completed_at is null and completed_by is null and cancelled_at is null and cancelled_by is null) or
    (status='Completed' and completion_notes is not null and completed_at is not null and completed_by is not null and cancelled_at is null and cancelled_by is null) or
    (status='Cancelled' and completion_notes is null and completed_at is null and completed_by is null and cancelled_at is not null and cancelled_by is not null)
  )
);

create index project_actions_project_status_due_idx on public.project_actions(project_id,status,due_date,id);
create index project_actions_project_owner_status_idx on public.project_actions(project_id,owner_membership_id,status);

create or replace function private.action_owner_is_eligible(p_project_id uuid,p_membership_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
  select exists (
    select 1 from public.project_members pm
    join public.projects p on p.id=pm.project_id
    join public.organization_members om on om.organization_id=p.organization_id and om.user_id=pm.user_id and om.status='Active'
    where pm.id=p_membership_id and pm.project_id=p_project_id and pm.left_at is null
      and (pm.access_level='Project Member' or (pm.access_level='Project Manager' and pm.user_id=p.project_manager_id))
  )
$$;

create or replace function private.protect_project_action()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_op='INSERT' then
    if new.status<>'Open' or new.created_by<>auth.uid() or new.completion_notes is not null or new.completed_at is not null or new.completed_by is not null or new.cancelled_at is not null or new.cancelled_by is not null then
      raise exception 'New actions must use trusted initial values.' using errcode='23514';
    end if;
  else
    if new.id is distinct from old.id or new.project_id is distinct from old.project_id or new.created_by is distinct from old.created_by or new.created_at is distinct from old.created_at then
      raise exception 'Action identity fields cannot be changed.' using errcode='42501';
    end if;
    if old.status in ('Completed','Cancelled') then raise exception 'Terminal actions cannot be changed.' using errcode='42501'; end if;
  end if;
  new.title:=btrim(new.title);
  new.description:=nullif(btrim(new.description),'');
  new.completion_notes:=nullif(btrim(new.completion_notes),'');
  new.updated_at:=now();
  return new;
end;$$;

create trigger project_actions_protect before insert or update on public.project_actions for each row execute function private.protect_project_action();

alter table public.project_actions enable row level security;
create policy project_actions_select_project_access on public.project_actions for select to authenticated using(private.has_project_access(project_id));
revoke all on public.project_actions from anon,authenticated;
grant select on public.project_actions to authenticated;

create or replace function public.create_project_action(p_project_id uuid,p_title text,p_description text,p_owner_membership_id uuid,p_due_date date,p_priority text)
returns public.project_actions language plpgsql security definer set search_path='' as $$
declare persisted public.project_actions%rowtype;
begin
  if auth.uid() is null or not private.can_manage_project(p_project_id) then raise exception 'Action creation is not permitted.' using errcode='42501'; end if;
  if not private.action_owner_is_eligible(p_project_id,p_owner_membership_id) then raise exception 'The selected action owner is not eligible.' using errcode='23514'; end if;
  insert into public.project_actions(project_id,title,description,owner_membership_id,due_date,priority,created_by)
  values(p_project_id,btrim(p_title),nullif(btrim(p_description),''),p_owner_membership_id,p_due_date,p_priority,auth.uid()) returning * into persisted;
  return persisted;
end;$$;

create or replace function public.update_project_action(p_action_id uuid,p_title text,p_description text,p_owner_membership_id uuid,p_due_date date,p_priority text)
returns public.project_actions language plpgsql security definer set search_path='' as $$
declare current_action public.project_actions%rowtype; persisted public.project_actions%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication is required.' using errcode='42501'; end if;
  select * into current_action from public.project_actions where id=p_action_id for update;
  if current_action.id is null or not private.can_manage_project(current_action.project_id) then raise exception 'Action update is not permitted.' using errcode='42501'; end if;
  if current_action.status in ('Completed','Cancelled') then raise exception 'Terminal actions cannot be changed.' using errcode='42501'; end if;
  if not private.action_owner_is_eligible(current_action.project_id,p_owner_membership_id) then raise exception 'The selected action owner is not eligible.' using errcode='23514'; end if;
  update public.project_actions set title=btrim(p_title),description=nullif(btrim(p_description),''),owner_membership_id=p_owner_membership_id,due_date=p_due_date,priority=p_priority where id=p_action_id returning * into persisted;
  return persisted;
end;$$;

create or replace function public.transition_project_action(p_action_id uuid,p_target_status text,p_completion_notes text default null)
returns public.project_actions language plpgsql security definer set search_path='' as $$
declare current_action public.project_actions%rowtype; persisted public.project_actions%rowtype; manager_allowed boolean; assigned_member_allowed boolean;
begin
  if auth.uid() is null then raise exception 'Authentication is required.' using errcode='42501'; end if;
  if p_target_status not in ('Open','In Progress','Blocked','Completed','Cancelled') then raise exception 'Unsupported action status.' using errcode='22023'; end if;
  select * into current_action from public.project_actions where id=p_action_id for update;
  if current_action.id is null or current_action.status in ('Completed','Cancelled') then raise exception 'Action transition is not permitted.' using errcode='42501'; end if;
  manager_allowed:=private.can_manage_project(current_action.project_id);
  select exists(select 1 from public.project_members pm join public.projects p on p.id=pm.project_id join public.organization_members om on om.organization_id=p.organization_id and om.user_id=pm.user_id and om.status='Active' where pm.id=current_action.owner_membership_id and pm.project_id=current_action.project_id and pm.user_id=auth.uid() and pm.access_level='Project Member' and pm.left_at is null) into assigned_member_allowed;
  if not manager_allowed and not assigned_member_allowed then raise exception 'Action transition is not permitted.' using errcode='42501'; end if;
  if p_target_status='Cancelled' and not manager_allowed then raise exception 'Action cancellation is not permitted.' using errcode='42501'; end if;
  if p_target_status='Completed' and nullif(btrim(p_completion_notes),'') is null then raise exception 'Completion notes are required.' using errcode='22023'; end if;
  update public.project_actions set status=p_target_status,
    completion_notes=case when p_target_status='Completed' then btrim(p_completion_notes) else null end,
    completed_at=case when p_target_status='Completed' then now() else null end,
    completed_by=case when p_target_status='Completed' then auth.uid() else null end,
    cancelled_at=case when p_target_status='Cancelled' then now() else null end,
    cancelled_by=case when p_target_status='Cancelled' then auth.uid() else null end
  where id=p_action_id returning * into persisted;
  return persisted;
end;$$;

create or replace function public.get_project_actions(p_project_id uuid)
returns table(id uuid,project_id uuid,title text,description text,owner_membership_id uuid,owner_user_id uuid,owner_name text,owner_access_level text,due_date date,priority text,status text,completion_notes text,completed_at timestamptz,completed_by uuid,completed_by_name text,cancelled_at timestamptz,cancelled_by uuid,cancelled_by_name text,created_by uuid,created_by_name text,created_at timestamptz,updated_at timestamptz)
language sql stable security definer set search_path='' as $$
  select a.id,a.project_id,a.title,a.description,a.owner_membership_id,pm.user_id,op.full_name,pm.access_level,a.due_date,a.priority,a.status,a.completion_notes,a.completed_at,a.completed_by,cp.full_name,a.cancelled_at,a.cancelled_by,xp.full_name,a.created_by,rp.full_name,a.created_at,a.updated_at
  from public.project_actions a join public.project_members pm on pm.id=a.owner_membership_id join public.profiles op on op.id=pm.user_id join public.profiles rp on rp.id=a.created_by left join public.profiles cp on cp.id=a.completed_by left join public.profiles xp on xp.id=a.cancelled_by
  where a.project_id=p_project_id and private.has_project_access(p_project_id)
  order by case when a.status in ('Completed','Cancelled') then 1 else 0 end,
    case when a.status='Blocked' then 0 else 1 end,
    case when a.status not in ('Completed','Cancelled') and a.due_date<current_date then 0 else 1 end,
    case a.priority when 'Critical' then 0 when 'High' then 1 when 'Medium' then 2 else 3 end,
    a.due_date,a.created_at,a.id
$$;

create or replace function public.get_eligible_action_owners(p_project_id uuid)
returns table(membership_id uuid,user_id uuid,full_name text,access_level text)
language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null or not private.can_manage_project(p_project_id) then raise exception 'Action management is not permitted.' using errcode='42501'; end if;
  return query select pm.id,pm.user_id,pr.full_name,pm.access_level from public.project_members pm join public.profiles pr on pr.id=pm.user_id join public.projects p on p.id=pm.project_id join public.organization_members om on om.organization_id=p.organization_id and om.user_id=pm.user_id and om.status='Active' where pm.project_id=p_project_id and pm.left_at is null and (pm.access_level='Project Member' or (pm.access_level='Project Manager' and pm.user_id=p.project_manager_id)) order by pr.full_name,pm.id;
end;$$;

revoke all on function private.action_owner_is_eligible(uuid,uuid) from public;
revoke all on function private.protect_project_action() from public;
revoke all on function public.create_project_action(uuid,text,text,uuid,date,text) from public;
revoke all on function public.update_project_action(uuid,text,text,uuid,date,text) from public;
revoke all on function public.transition_project_action(uuid,text,text) from public;
revoke all on function public.get_project_actions(uuid) from public;
revoke all on function public.get_eligible_action_owners(uuid) from public;
grant execute on function public.create_project_action(uuid,text,text,uuid,date,text) to authenticated;
grant execute on function public.update_project_action(uuid,text,text,uuid,date,text) to authenticated;
grant execute on function public.transition_project_action(uuid,text,text) to authenticated;
grant execute on function public.get_project_actions(uuid) to authenticated;
grant execute on function public.get_eligible_action_owners(uuid) to authenticated;
