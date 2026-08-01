create or replace function public.get_project_team(p_project_id uuid)
returns table(membership_id uuid, user_id uuid, full_name text, email text, access_level text, active boolean, is_assigned_manager boolean)
language plpgsql stable security definer set search_path=''
as $$
begin
  if auth.uid() is null or not private.has_project_access(p_project_id) then
    raise exception 'Project team access is not permitted.' using errcode='42501';
  end if;
  return query select pm.id,pm.user_id,p.full_name,p.email,pm.access_level,pm.left_at is null,pr.project_manager_id=pm.user_id
  from public.project_members pm join public.profiles p on p.id=pm.user_id join public.projects pr on pr.id=pm.project_id
  where pm.project_id=p_project_id order by (pr.project_manager_id=pm.user_id) desc,p.full_name,pm.id;
end;$$;

create or replace function public.get_eligible_project_members(p_project_id uuid)
returns table(user_id uuid, full_name text, email text, existing_access_level text)
language plpgsql stable security definer set search_path=''
as $$
declare target_project public.projects%rowtype;
begin
  select * into target_project from public.projects where id=p_project_id;
  if auth.uid() is null or target_project.id is null or not private.can_manage_project(p_project_id) then
    raise exception 'Project team management is not permitted.' using errcode='42501';
  end if;
  return query select om.user_id,p.full_name,p.email,pm.access_level
  from public.organization_members om join public.profiles p on p.id=om.user_id
  left join public.project_members pm on pm.project_id=p_project_id and pm.user_id=om.user_id
  where om.organization_id=target_project.organization_id and om.status='Active'
    and om.user_id<>target_project.project_manager_id and (pm.id is null or pm.left_at is not null)
  order by p.full_name,om.user_id;
end;$$;

revoke all on function public.get_project_team(uuid) from public;
revoke all on function public.get_eligible_project_members(uuid) from public;
grant execute on function public.get_project_team(uuid) to authenticated;
grant execute on function public.get_eligible_project_members(uuid) to authenticated;
