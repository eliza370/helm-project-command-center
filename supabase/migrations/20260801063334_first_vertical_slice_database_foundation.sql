create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete restrict,
  email text not null,
  full_name text not null,
  job_title text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_length check (char_length(email) between 3 and 320),
  constraint profiles_email_format check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint profiles_full_name_nonblank check (char_length(btrim(full_name)) between 1 and 200),
  constraint profiles_job_title_length check (job_title is null or char_length(btrim(job_title)) between 1 and 200),
  constraint profiles_avatar_url_length check (avatar_url is null or char_length(btrim(avatar_url)) between 1 and 2048)
);

create unique index profiles_email_unique_idx on public.profiles (lower(email));

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_name_nonblank check (char_length(btrim(name)) between 1 and 200),
  constraint organizations_description_length check (description is null or char_length(btrim(description)) between 1 and 4000)
);

create index organizations_created_by_idx on public.organizations (created_by);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  user_id uuid not null references public.profiles (id) on delete restrict,
  role text not null,
  status text not null,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint organization_members_role_check check (role in ('Administrator', 'Member')),
  constraint organization_members_status_check check (status in ('Active', 'Inactive')),
  constraint organization_members_organization_user_key unique (organization_id, user_id)
);

create index organization_members_user_active_idx
  on public.organization_members (user_id, organization_id)
  where status = 'Active';

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete restrict,
  name text not null,
  description text,
  business_objective text not null,
  project_manager_id uuid not null references public.profiles (id) on delete restrict,
  sponsor_name text not null,
  sponsor_email text,
  lifecycle_phase text not null,
  status text not null,
  start_date date not null,
  target_completion_date date not null,
  actual_completion_date date,
  overall_health text not null,
  scope_health text not null,
  schedule_health text not null,
  budget_health text not null,
  resource_health text not null,
  risk_health text not null,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint projects_name_nonblank check (char_length(btrim(name)) between 1 and 200),
  constraint projects_description_length check (description is null or char_length(btrim(description)) between 1 and 4000),
  constraint projects_business_objective_nonblank check (char_length(btrim(business_objective)) between 1 and 4000),
  constraint projects_sponsor_name_nonblank check (char_length(btrim(sponsor_name)) between 1 and 200),
  constraint projects_sponsor_email_length check (sponsor_email is null or char_length(sponsor_email) between 3 and 320),
  constraint projects_sponsor_email_format check (
    sponsor_email is null or sponsor_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint projects_lifecycle_phase_check check (
    lifecycle_phase in ('Initiation', 'Planning', 'Execution', 'Monitoring and Control', 'Closing', 'Closed')
  ),
  constraint projects_status_check check (
    status in ('Draft', 'Active', 'On Hold', 'At Risk', 'Completed', 'Cancelled')
  ),
  constraint projects_lifecycle_status_check check (
    (status <> 'Draft' or lifecycle_phase = 'Initiation')
    and (lifecycle_phase <> 'Closed' or status in ('Completed', 'Cancelled'))
    and (status not in ('Completed', 'Cancelled') or lifecycle_phase = 'Closed')
  ),
  constraint projects_date_order_check check (target_completion_date >= start_date),
  constraint projects_overall_health_check check (overall_health in ('Not Assessed', 'Green', 'Amber', 'Red')),
  constraint projects_scope_health_check check (scope_health in ('Not Assessed', 'Green', 'Amber', 'Red')),
  constraint projects_schedule_health_check check (schedule_health in ('Not Assessed', 'Green', 'Amber', 'Red')),
  constraint projects_budget_health_check check (budget_health in ('Not Assessed', 'Green', 'Amber', 'Red')),
  constraint projects_resource_health_check check (resource_health in ('Not Assessed', 'Green', 'Amber', 'Red')),
  constraint projects_risk_health_check check (risk_health in ('Not Assessed', 'Green', 'Amber', 'Red'))
);

create index projects_organization_id_idx on public.projects (organization_id);
create index projects_project_manager_id_idx on public.projects (project_manager_id);
create index projects_created_by_idx on public.projects (created_by);
create index projects_organization_status_idx on public.projects (organization_id, status);

create table public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete restrict,
  user_id uuid not null references public.profiles (id) on delete restrict,
  project_role text,
  responsibilities text,
  access_level text not null,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  created_at timestamptz not null default now(),
  constraint project_members_project_role_length check (
    project_role is null or char_length(btrim(project_role)) between 1 and 200
  ),
  constraint project_members_responsibilities_length check (
    responsibilities is null or char_length(btrim(responsibilities)) between 1 and 4000
  ),
  constraint project_members_access_level_check check (
    access_level in ('Project Manager', 'Project Member', 'Stakeholder', 'Read Only')
  ),
  constraint project_members_dates_check check (left_at is null or left_at >= joined_at),
  constraint project_members_project_user_key unique (project_id, user_id)
);

create index project_members_user_active_idx
  on public.project_members (user_id, project_id)
  where left_at is null;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function private.protect_profile_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.created_at is distinct from old.created_at
    or (current_user not in ('postgres', 'supabase_admin') and new.email is distinct from old.email)
  then
    raise exception 'Profile identity fields cannot be changed.' using errcode = '42501';
  end if;

  return new;
end;
$$;

create or replace function private.protect_organization_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.created_by is distinct from old.created_by
    or new.created_at is distinct from old.created_at
  then
    raise exception 'Organization identity fields cannot be changed.' using errcode = '42501';
  end if;

  return new;
end;
$$;

create or replace function private.protect_project_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.organization_id is distinct from old.organization_id
    or new.project_manager_id is distinct from old.project_manager_id
    or new.created_by is distinct from old.created_by
    or new.created_at is distinct from old.created_at
  then
    raise exception 'Project identity fields cannot be changed.' using errcode = '42501';
  end if;

  if new.status in ('Completed', 'Cancelled') and old.status not in ('Completed', 'Cancelled') then
    new.closed_at := coalesce(new.closed_at, now());
  elsif new.status not in ('Completed', 'Cancelled') then
    new.closed_at := null;
  end if;

  return new;
end;
$$;

create trigger profiles_protect_identity
before update on public.profiles
for each row execute function private.protect_profile_identity();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger organizations_protect_identity
before update on public.organizations
for each row execute function private.protect_organization_identity();

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function private.set_updated_at();

create trigger projects_protect_identity
before update on public.projects
for each row execute function private.protect_project_identity();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function private.set_updated_at();

create or replace function private.is_active_organization_member(
  target_organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members as organization_member
    where organization_member.organization_id = target_organization_id
      and organization_member.user_id = auth.uid()
      and organization_member.status = 'Active'
  );
$$;

create or replace function private.is_organization_admin(
  target_organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members as organization_member
    where organization_member.organization_id = target_organization_id
      and organization_member.user_id = auth.uid()
      and organization_member.role = 'Administrator'
      and organization_member.status = 'Active'
  );
$$;

create or replace function private.has_project_access(
  target_project_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.projects as project
    join public.organization_members as organization_member
      on organization_member.organization_id = project.organization_id
      and organization_member.user_id = auth.uid()
      and organization_member.status = 'Active'
    where project.id = target_project_id
      and (
        organization_member.role = 'Administrator'
        or exists (
          select 1
          from public.project_members as project_member
          where project_member.project_id = project.id
            and project_member.user_id = auth.uid()
            and project_member.left_at is null
        )
      )
  );
$$;

create or replace function private.can_manage_project(
  target_project_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.projects as project
    join public.organization_members as organization_member
      on organization_member.organization_id = project.organization_id
      and organization_member.user_id = auth.uid()
      and organization_member.status = 'Active'
    where project.id = target_project_id
      and (
        organization_member.role = 'Administrator'
        or (
          project.project_manager_id = auth.uid()
          and exists (
            select 1
            from public.project_members as project_member
            where project_member.project_id = project.id
              and project_member.user_id = auth.uid()
              and project_member.access_level = 'Project Manager'
              and project_member.left_at is null
          )
        )
      )
  );
$$;

revoke all on function private.set_updated_at() from public;
revoke all on function private.protect_profile_identity() from public;
revoke all on function private.protect_organization_identity() from public;
revoke all on function private.protect_project_identity() from public;
revoke all on function private.is_active_organization_member(uuid) from public;
revoke all on function private.is_organization_admin(uuid) from public;
revoke all on function private.has_project_access(uuid) from public;
revoke all on function private.can_manage_project(uuid) from public;

grant execute on function private.is_active_organization_member(uuid) to anon, authenticated;
grant execute on function private.is_organization_admin(uuid) to anon, authenticated;
grant execute on function private.has_project_access(uuid) to anon, authenticated;
grant execute on function private.can_manage_project(uuid) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy organizations_select_active_member
on public.organizations
for select
to authenticated
using (private.is_active_organization_member(id));

create policy organizations_update_active_admin
on public.organizations
for update
to authenticated
using (private.is_organization_admin(id))
with check (private.is_organization_admin(id));

create policy organization_members_select_own_or_admin
on public.organization_members
for select
to authenticated
using (
  user_id = auth.uid()
  or private.is_organization_admin(organization_id)
);

create policy projects_select_authorized
on public.projects
for select
to authenticated
using (private.has_project_access(id));

create policy projects_update_manager
on public.projects
for update
to authenticated
using (private.can_manage_project(id))
with check (private.can_manage_project(id));

create policy project_members_select_authorized_project
on public.project_members
for select
to authenticated
using (private.has_project_access(project_id));

revoke all on public.profiles from anon, authenticated;
revoke all on public.organizations from anon, authenticated;
revoke all on public.organization_members from anon, authenticated;
revoke all on public.projects from anon, authenticated;
revoke all on public.project_members from anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant select on public.organizations to anon, authenticated;
grant select on public.organization_members to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.project_members to anon, authenticated;

grant insert, update, delete on public.profiles to authenticated;
grant insert, update, delete on public.organizations to authenticated;
grant insert, update, delete on public.organization_members to authenticated;
grant insert, update, delete on public.projects to authenticated;
grant insert, update, delete on public.project_members to authenticated;

create or replace function public.complete_onboarding(
  p_organization_name text,
  p_full_name text,
  p_description text default null,
  p_job_title text default null,
  p_avatar_url text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
  new_organization_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication is required.' using errcode = '42501';
  end if;

  select auth_user.email
  into current_email
  from auth.users as auth_user
  where auth_user.id = current_user_id
  for update;

  if current_email is null then
    raise exception 'Authenticated user was not found.' using errcode = '42501';
  end if;

  if char_length(btrim(p_organization_name)) not between 1 and 200 then
    raise exception 'Organization name must be between 1 and 200 characters.' using errcode = '22023';
  end if;

  if char_length(btrim(p_full_name)) not between 1 and 200 then
    raise exception 'Full name must be between 1 and 200 characters.' using errcode = '22023';
  end if;

  insert into public.profiles (id, email, full_name, job_title, avatar_url)
  values (
    current_user_id,
    current_email,
    btrim(p_full_name),
    nullif(btrim(p_job_title), ''),
    nullif(btrim(p_avatar_url), '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      job_title = excluded.job_title,
      avatar_url = excluded.avatar_url;

  if exists (
    select 1
    from public.organization_members as organization_member
    where organization_member.user_id = current_user_id
      and organization_member.status = 'Active'
  ) then
    raise exception 'An active organization membership already exists.' using errcode = '23505';
  end if;

  insert into public.organizations (name, description, created_by)
  values (
    btrim(p_organization_name),
    nullif(btrim(p_description), ''),
    current_user_id
  )
  returning id into new_organization_id;

  insert into public.organization_members (
    organization_id,
    user_id,
    role,
    status
  )
  values (
    new_organization_id,
    current_user_id,
    'Administrator',
    'Active'
  );

  return new_organization_id;
end;
$$;

create or replace function public.create_project(
  p_organization_id uuid,
  p_name text,
  p_description text,
  p_business_objective text,
  p_sponsor_name text,
  p_sponsor_email text,
  p_lifecycle_phase text,
  p_status text,
  p_start_date date,
  p_target_completion_date date,
  p_actual_completion_date date,
  p_overall_health text,
  p_scope_health text,
  p_schedule_health text,
  p_budget_health text,
  p_resource_health text,
  p_risk_health text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  new_project_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication is required.' using errcode = '42501';
  end if;

  if not private.is_organization_admin(p_organization_id) then
    raise exception 'You do not have permission to create a project in this organization.' using errcode = '42501';
  end if;

  if char_length(btrim(p_name)) not between 1 and 200 then
    raise exception 'Project name must be between 1 and 200 characters.' using errcode = '22023';
  end if;

  if char_length(btrim(p_business_objective)) not between 1 and 4000 then
    raise exception 'Business objective must be between 1 and 4000 characters.' using errcode = '22023';
  end if;

  if char_length(btrim(p_sponsor_name)) not between 1 and 200 then
    raise exception 'Sponsor name must be between 1 and 200 characters.' using errcode = '22023';
  end if;

  if p_start_date is null or p_target_completion_date is null then
    raise exception 'Project start and target completion dates are required.' using errcode = '22023';
  end if;

  insert into public.projects (
    organization_id,
    name,
    description,
    business_objective,
    project_manager_id,
    sponsor_name,
    sponsor_email,
    lifecycle_phase,
    status,
    start_date,
    target_completion_date,
    actual_completion_date,
    overall_health,
    scope_health,
    schedule_health,
    budget_health,
    resource_health,
    risk_health,
    created_by,
    closed_at
  )
  values (
    p_organization_id,
    btrim(p_name),
    nullif(btrim(p_description), ''),
    btrim(p_business_objective),
    current_user_id,
    btrim(p_sponsor_name),
    nullif(btrim(p_sponsor_email), ''),
    p_lifecycle_phase,
    p_status,
    p_start_date,
    p_target_completion_date,
    p_actual_completion_date,
    p_overall_health,
    p_scope_health,
    p_schedule_health,
    p_budget_health,
    p_resource_health,
    p_risk_health,
    current_user_id,
    case when p_status in ('Completed', 'Cancelled') then now() else null end
  )
  returning id into new_project_id;

  insert into public.project_members (
    project_id,
    user_id,
    project_role,
    access_level
  )
  values (
    new_project_id,
    current_user_id,
    'Project Manager',
    'Project Manager'
  );

  return new_project_id;
end;
$$;

revoke all on function public.complete_onboarding(text, text, text, text, text) from public;
revoke all on function public.create_project(uuid, text, text, text, text, text, text, text, date, date, date, text, text, text, text, text, text) from public;

grant execute on function public.complete_onboarding(text, text, text, text, text) to authenticated;
grant execute on function public.create_project(uuid, text, text, text, text, text, text, text, date, date, date, text, text, text, text, text, text) to authenticated;
