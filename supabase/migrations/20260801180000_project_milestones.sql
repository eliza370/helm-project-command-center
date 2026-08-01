create table public.milestones(
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  title text not null,
  description text,
  target_date date not null,
  status text not null default 'Planned',
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  cancelled_at timestamptz,
  constraint milestones_title_nonblank check(char_length(btrim(title)) between 1 and 200),
  constraint milestones_description_length check(description is null or char_length(btrim(description)) between 1 and 4000),
  constraint milestones_status_check check(status in('Planned','Completed','Cancelled')),
  constraint milestones_terminal_state_check check(
    (status='Planned' and completed_at is null and cancelled_at is null) or
    (status='Completed' and completed_at is not null and cancelled_at is null) or
    (status='Cancelled' and cancelled_at is not null and completed_at is null)
  )
);
create index milestones_project_target_idx on public.milestones(project_id,target_date,id);

create or replace function private.protect_milestone()
returns trigger language plpgsql set search_path='' as $$
begin
  if new.id is distinct from old.id or new.project_id is distinct from old.project_id or new.created_by is distinct from old.created_by or new.created_at is distinct from old.created_at then
    raise exception 'Milestone identity fields cannot be changed.' using errcode='42501';
  end if;
  if old.status in('Completed','Cancelled') then raise exception 'Terminal milestones cannot be changed.' using errcode='42501'; end if;
  if new.status='Completed' then new.completed_at:=now();new.cancelled_at:=null;
  elsif new.status='Cancelled' then new.cancelled_at:=now();new.completed_at:=null;
  else new.completed_at:=null;new.cancelled_at:=null;end if;
  new.updated_at:=now();return new;
end;$$;
create trigger milestones_protect before update on public.milestones for each row execute function private.protect_milestone();

alter table public.milestones enable row level security;
create policy milestones_select_project_access on public.milestones for select to authenticated using(private.has_project_access(project_id));
create policy milestones_insert_manager on public.milestones for insert to authenticated with check(private.can_manage_project(project_id) and created_by=auth.uid() and status='Planned' and completed_at is null and cancelled_at is null);
create policy milestones_update_manager on public.milestones for update to authenticated using(private.can_manage_project(project_id)) with check(private.can_manage_project(project_id));
revoke all on public.milestones from anon,authenticated;
grant select,insert,update on public.milestones to authenticated;

create or replace function public.transition_milestone(p_milestone_id uuid,p_status text)
returns public.milestones language plpgsql security definer set search_path='' as $$
declare current_milestone public.milestones%rowtype;updated_milestone public.milestones%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication is required.' using errcode='42501';end if;
  if p_status not in('Completed','Cancelled') then raise exception 'Unsupported milestone transition.' using errcode='22023';end if;
  select * into current_milestone from public.milestones where id=p_milestone_id for update;
  if current_milestone.id is null or not private.can_manage_project(current_milestone.project_id) then raise exception 'Milestone transition is not permitted.' using errcode='42501';end if;
  if current_milestone.status<>'Planned' then raise exception 'Terminal milestones cannot be changed.' using errcode='42501';end if;
  update public.milestones set status=p_status where id=current_milestone.id returning * into updated_milestone;
  return updated_milestone;
end;$$;
revoke all on function private.protect_milestone() from public;
revoke all on function public.transition_milestone(uuid,text) from public;
grant execute on function public.transition_milestone(uuid,text) to authenticated;
