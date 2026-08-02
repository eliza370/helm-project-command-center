import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";

export function createLocalUserClient() {
  const url = process.env.HELM_E2E_SUPABASE_URL;
  const publicKey = process.env.HELM_E2E_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publicKey) {
    throw new Error(
      "Local Supabase E2E values were not initialized. Run tests through the Playwright configuration.",
    );
  }
  return createClient(url, publicKey, { auth: { persistSession: false } });
}

export async function deleteLocalTestUsers(userIds: string[]) {
  if (!userIds.length) return;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (userIds.some((userId) => !uuidPattern.test(userId))) {
    throw new Error("Refusing cleanup for an invalid test-user identifier.");
  }

  const ids = userIds.map((userId) => `'${userId}'`).join(",");
  const sql = `begin; create temp table helm_e2e_users(id uuid primary key) on commit drop; insert into helm_e2e_users values ${userIds.map((userId) => `('${userId}')`).join(",")}; create temp table helm_e2e_orgs on commit drop as select id from public.organizations where created_by in (select id from helm_e2e_users); create temp table helm_e2e_projects on commit drop as select id from public.projects where organization_id in (select id from helm_e2e_orgs); delete from public.project_issues where project_id in (select id from helm_e2e_projects); delete from public.project_risks where project_id in (select id from helm_e2e_projects); delete from public.project_actions where project_id in (select id from helm_e2e_projects); delete from public.deliverables where project_id in (select id from helm_e2e_projects); delete from public.milestones where project_id in (select id from helm_e2e_projects); delete from public.project_members where project_id in (select id from helm_e2e_projects) or user_id in (select id from helm_e2e_users); delete from public.projects where id in (select id from helm_e2e_projects); delete from public.organization_members where user_id in (select id from helm_e2e_users); delete from public.organizations where id in (select id from helm_e2e_orgs); delete from public.profiles where id in (select id from helm_e2e_users); delete from auth.users where id in (${ids}); commit;`;

  execFileSync(
    "docker",
    [
      "exec",
      "supabase_db_helm-project-command-center",
      "psql",
      "-U",
      "postgres",
      "-d",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      sql,
    ],
    { stdio: "ignore" },
  );
}

export function provisionLocalProjectMember(input:{userId:string;email:string;fullName:string;organizationId:string;projectId?:string}){
  const uuid=/^[0-9a-f-]{36}$/i;if(!uuid.test(input.userId)||!uuid.test(input.organizationId)||(input.projectId&&!uuid.test(input.projectId)))throw new Error("Invalid fixture identifier.");
  const safe=(value:string)=>value.replace(/'/g,"''");
  const projectMembership=input.projectId?`insert into public.project_members(project_id,user_id,project_role,access_level) values ('${input.projectId}','${input.userId}','Delivery team','Project Member');`:"";
  const sql=`begin; insert into public.profiles(id,email,full_name) values ('${input.userId}','${safe(input.email)}','${safe(input.fullName)}'); insert into public.organization_members(organization_id,user_id,role,status) values ('${input.organizationId}','${input.userId}','Member','Active'); ${projectMembership} commit;`;
  execFileSync("docker",["exec","supabase_db_helm-project-command-center","psql","-U","postgres","-d","postgres","-v","ON_ERROR_STOP=1","-c",sql],{stdio:"ignore"});
}
