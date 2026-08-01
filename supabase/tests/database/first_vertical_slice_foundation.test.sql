begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(35);

insert into auth.users (id, email)
values
  ('00000000-0000-0000-0000-000000000001', 'admin-one@example.com'),
  ('00000000-0000-0000-0000-000000000002', 'project-member@example.com'),
  ('00000000-0000-0000-0000-000000000003', 'member-without-project@example.com'),
  ('00000000-0000-0000-0000-000000000004', 'other-admin@example.com');

select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);
set local role anon;

select throws_ok(
  $$select public.complete_onboarding('Unauthorized Org', 'Anonymous User')$$,
  '42501',
  'permission denied for function complete_onboarding',
  'Unauthenticated onboarding is denied'
);

reset role;

select is(
  (select count(*) from public.organizations where name = 'Unauthorized Org'),
  0::bigint,
  'Failed onboarding leaves no organization behind'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select lives_ok(
  $$select public.complete_onboarding('Primary Organization', 'Admin One', 'Primary workspace')$$,
  'Onboarding creates the first organization atomically'
);

reset role;

select is(
  (select count(*) from public.organizations where created_by = '00000000-0000-0000-0000-000000000001'),
  1::bigint,
  'Onboarding creates one organization'
);

select is(
  (
    select count(*)
    from public.organization_members
    where user_id = '00000000-0000-0000-0000-000000000001'
      and role = 'Administrator'
      and status = 'Active'
  ),
  1::bigint,
  'Onboarding creates the active Administrator membership'
);

select is(
  (select created_by from public.organizations where name = 'Primary Organization'),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Onboarding always creates the organization for auth.uid()'
);

select has_function(
  'public',
  'complete_onboarding',
  array['text', 'text', 'text', 'text', 'text'],
  'Onboarding exposes no browser-supplied user ID parameter'
);

set local role authenticated;

select throws_ok(
  $$select public.complete_onboarding('Second Organization', 'Admin One')$$,
  '23505',
  'An active organization membership already exists.',
  'A second active onboarding attempt is rejected'
);

reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000004', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select lives_ok(
  $$select public.complete_onboarding('Other Organization', 'Other Admin')$$,
  'A separate user can onboard their own organization'
);

reset role;

insert into public.profiles (id, email, full_name)
values
  ('00000000-0000-0000-0000-000000000002', 'project-member@example.com', 'Project Member'),
  ('00000000-0000-0000-0000-000000000003', 'member-without-project@example.com', 'Member Without Project');

insert into public.organization_members (organization_id, user_id, role, status)
select organization.id, member.user_id, 'Member', 'Active'
from public.organizations as organization
cross join (
  values
    ('00000000-0000-0000-0000-000000000002'::uuid),
    ('00000000-0000-0000-0000-000000000003'::uuid)
) as member(user_id)
where organization.name = 'Primary Organization';

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select lives_ok(
  $$
    select public.create_project(
      (select id from public.organizations where name = 'Primary Organization'),
      'Foundation Project',
      'Database foundation project',
      'Establish a secure project foundation',
      'Executive Sponsor',
      'sponsor@example.com',
      'Initiation',
      'Draft',
      '2026-08-01',
      '2026-12-31',
      null,
      'Not Assessed',
      'Not Assessed',
      'Not Assessed',
      'Not Assessed',
      'Not Assessed',
      'Not Assessed'
    )
  $$,
  'Project creation succeeds for an active organization Administrator'
);

reset role;

select is(
  (select count(*) from public.projects where name = 'Foundation Project'),
  1::bigint,
  'Atomic project creation creates the project'
);

select is(
  (
    select count(*)
    from public.project_members as project_member
    join public.projects as project on project.id = project_member.project_id
    where project.name = 'Foundation Project'
      and project_member.user_id = '00000000-0000-0000-0000-000000000001'
      and project_member.access_level = 'Project Manager'
      and project_member.left_at is null
  ),
  1::bigint,
  'Atomic project creation creates the active Project Manager membership'
);

select ok(
  (
    select project.created_by = '00000000-0000-0000-0000-000000000001'
      and project.project_manager_id = '00000000-0000-0000-0000-000000000001'
    from public.projects as project
    where project.name = 'Foundation Project'
  ),
  'Project creator and manager identities come from auth.uid()'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select throws_ok(
  $$
    select public.create_project(
      (select organization_id from public.organization_members where user_id = auth.uid()),
      'Unauthorized Project', null, 'Should not be created', 'Sponsor', null,
      'Initiation', 'Draft', '2026-08-01', '2026-08-31', null,
      'Green', 'Green', 'Green', 'Green', 'Green', 'Green'
    )
  $$,
  '42501',
  'You do not have permission to create a project in this organization.',
  'Non-Administrators cannot create projects'
);

reset role;

select throws_ok(
  $$
    insert into public.organization_members (organization_id, user_id, role, status)
    select organization_id, user_id, 'Member', 'Active'
    from public.organization_members
    where user_id = '00000000-0000-0000-0000-000000000002'
  $$,
  '23505'::character(5),
  null::text,
  'Unique organization memberships are enforced'
);

insert into public.project_members (project_id, user_id, access_level)
select project.id, '00000000-0000-0000-0000-000000000002', 'Project Member'
from public.projects as project
where project.name = 'Foundation Project';

select throws_ok(
  $$
    insert into public.project_members (project_id, user_id, access_level)
    select project.id, '00000000-0000-0000-0000-000000000002', 'Project Member'
    from public.projects as project
    where project.name = 'Foundation Project'
  $$,
  '23505'::character(5),
  null::text,
  'Unique project memberships are enforced'
);

insert into public.projects (
  id,
  organization_id,
  name,
  business_objective,
  project_manager_id,
  sponsor_name,
  lifecycle_phase,
  status,
  start_date,
  target_completion_date,
  overall_health,
  scope_health,
  schedule_health,
  budget_health,
  resource_health,
  risk_health,
  created_by
)
select
  '20000000-0000-0000-0000-000000000001',
  organization.id,
  'Member Managed Project',
  'Verify assigned Project Manager permissions',
  '00000000-0000-0000-0000-000000000002',
  'Sponsor',
  'Execution',
  'Active',
  '2026-08-01',
  '2026-10-31',
  'Green', 'Green', 'Green', 'Green', 'Green', 'Green',
  '00000000-0000-0000-0000-000000000001'
from public.organizations as organization
where organization.name = 'Primary Organization';

insert into public.project_members (project_id, user_id, project_role, access_level)
values (
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Project Manager',
  'Project Manager'
);

select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);
set local role anon;

select results_eq(
  $$select id from public.projects$$,
  array[]::uuid[],
  'Anonymous project access is denied'
);

reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000004', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select results_eq(
  $$select id from public.projects$$,
  array[]::uuid[],
  'Cross-organization project reads are denied'
);

reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000003', true);
set local role authenticated;

select results_eq(
  $$select id from public.projects$$,
  array[]::uuid[],
  'An ordinary organization Member without project membership cannot read a project'
);

reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
set local role authenticated;

select is(
  (select count(*) from public.projects),
  2::bigint,
  'An organization Administrator can read every project in the organization'
);

reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
set local role authenticated;

select is(
  (select count(*) from public.projects where name = 'Foundation Project'),
  1::bigint,
  'A Project Member can read an assigned project'
);

select results_eq(
  $$update public.projects set name = 'Unauthorized Rename' where name = 'Foundation Project' returning id$$,
  array[]::uuid[],
  'A Project Member cannot update project details'
);

select lives_ok(
  $$update public.projects set description = 'Updated by assigned manager' where id = '20000000-0000-0000-0000-000000000001'$$,
  'The assigned Project Manager can update permitted project details'
);

select throws_ok(
  $$
    update public.projects
    set project_manager_id = '00000000-0000-0000-0000-000000000003'
    where id = '20000000-0000-0000-0000-000000000001'
  $$,
  '42501',
  'Project identity fields cannot be changed.',
  'The assigned Project Manager cannot tamper with protected identity fields'
);

reset role;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
set local role authenticated;

select throws_ok(
  $$
    select public.create_project(
      (select id from public.organizations where name = 'Primary Organization'),
      'Invalid Dates', null, 'Invalid date test', 'Sponsor', null,
      'Initiation', 'Draft', '2026-09-01', '2026-08-01', null,
      'Green', 'Green', 'Green', 'Green', 'Green', 'Green'
    )
  $$,
  '23514'::character(5),
  null::text,
  'Target completion before start date is rejected'
);

select throws_ok(
  $$
    select public.create_project(
      (select id from public.organizations where name = 'Primary Organization'),
      'Invalid Health', null, 'Invalid health test', 'Sponsor', null,
      'Initiation', 'Draft', '2026-08-01', '2026-09-01', null,
      'Blue', 'Green', 'Green', 'Green', 'Green', 'Green'
    )
  $$,
  '23514'::character(5),
  null::text,
  'Invalid health values are rejected'
);

select throws_ok(
  $$
    select public.create_project(
      (select id from public.organizations where name = 'Primary Organization'),
      'Invalid Draft', null, 'Invalid lifecycle test', 'Sponsor', null,
      'Planning', 'Draft', '2026-08-01', '2026-09-01', null,
      'Green', 'Green', 'Green', 'Green', 'Green', 'Green'
    )
  $$,
  '23514'::character(5),
  null::text,
  'Draft projects outside Initiation are rejected'
);

select throws_ok(
  $$
    select public.create_project(
      (select id from public.organizations where name = 'Primary Organization'),
      'Invalid Closed', null, 'Invalid status test', 'Sponsor', null,
      'Closed', 'Active', '2026-08-01', '2026-09-01', null,
      'Green', 'Green', 'Green', 'Green', 'Green', 'Green'
    )
  $$,
  '23514'::character(5),
  null::text,
  'Closed lifecycle with a nonterminal status is rejected'
);

select throws_ok(
  $$insert into public.organizations (name, created_by) values ('Direct Organization', auth.uid())$$,
  '42501'::character(5),
  null::text,
  'Direct organization inserts bypassing onboarding are rejected'
);

select throws_ok(
  $$
    insert into public.projects (
      organization_id, name, business_objective, project_manager_id, sponsor_name,
      lifecycle_phase, status, start_date, target_completion_date,
      overall_health, scope_health, schedule_health, budget_health, resource_health, risk_health, created_by
    )
    select id, 'Direct Project', 'Bypass attempt', auth.uid(), 'Sponsor',
      'Initiation', 'Draft', '2026-08-01', '2026-09-01',
      'Green', 'Green', 'Green', 'Green', 'Green', 'Green', auth.uid()
    from public.organizations where name = 'Primary Organization'
  $$,
  '42501'::character(5),
  null::text,
  'Direct project inserts bypassing atomic creation are rejected'
);

select throws_ok(
  $$
    insert into public.project_members (project_id, user_id, access_level)
    values ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Project Member')
  $$,
  '42501'::character(5),
  null::text,
  'Direct project membership insertion is rejected'
);

select results_eq(
  $$delete from public.organizations where name = 'Primary Organization' returning id$$,
  array[]::uuid[],
  'Direct organization deletion is denied'
);

select results_eq(
  $$delete from public.projects where name = 'Foundation Project' returning id$$,
  array[]::uuid[],
  'Direct project deletion is denied'
);

select results_eq(
  $$delete from public.organization_members where user_id = auth.uid() returning id$$,
  array[]::uuid[],
  'Direct organization membership deletion is denied'
);

select results_eq(
  $$delete from public.project_members where user_id = auth.uid() returning id$$,
  array[]::uuid[],
  'Direct project membership deletion is denied'
);

select * from finish();
rollback;
