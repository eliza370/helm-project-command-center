create or replace function public.manage_project_membership(
  p_project_id uuid,
  p_user_id uuid,
  p_access_level text,
  p_active boolean
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_project public.projects%rowtype;
  existing_membership public.project_members%rowtype;
  membership_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication is required.' using errcode = '42501';
  end if;

  select * into target_project from public.projects where id = p_project_id;
  if target_project.id is null or not private.can_manage_project(p_project_id) then
    raise exception 'Project team management is not permitted.' using errcode = '42501';
  end if;

  if p_user_id = target_project.project_manager_id then
    raise exception 'The assigned Project Manager membership is protected.' using errcode = '42501';
  end if;
  if p_access_level not in ('Project Member', 'Stakeholder', 'Read Only') then
    raise exception 'Unsupported project access level.' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.organization_members
    where organization_id = target_project.organization_id
      and user_id = p_user_id and status = 'Active'
  ) then
    raise exception 'The selected user is not an active organization member.' using errcode = '42501';
  end if;

  select * into existing_membership from public.project_members
  where project_id = p_project_id and user_id = p_user_id for update;

  if existing_membership.id is null then
    if not p_active then
      raise exception 'An inactive membership cannot be created.' using errcode = '22023';
    end if;
    insert into public.project_members(project_id,user_id,access_level)
    values(p_project_id,p_user_id,p_access_level) returning id into membership_id;
  else
    if existing_membership.access_level = 'Project Manager' then
      raise exception 'Project Manager memberships are protected.' using errcode = '42501';
    end if;
    update public.project_members
    set access_level = p_access_level,
        left_at = case when p_active then null else now() end
    where id = existing_membership.id
    returning id into membership_id;
  end if;
  return membership_id;
end;
$$;

revoke all on function public.manage_project_membership(uuid, uuid, text, boolean) from public;
grant execute on function public.manage_project_membership(uuid, uuid, text, boolean) to authenticated;
