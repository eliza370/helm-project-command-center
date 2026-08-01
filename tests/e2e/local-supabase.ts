import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";

function getLocalValues() {
  const command = process.env.ComSpec ?? "cmd.exe";
  const output = execFileSync(
    command,
    ["/d", "/s", "/c", "npx.cmd supabase status -o env"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  );
  const values = new Map(
    output
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Z_]+)="?(.*?)"?$/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map((match) => [match[1], match[2].replace(/"$/, "")]),
  );
  return values;
}

export function createLocalUserClient() {
  const values = getLocalValues();
  const url = values.get("API_URL");
  const publicKey = values.get("PUBLISHABLE_KEY") ?? values.get("ANON_KEY");

  if (!url || !publicKey) throw new Error("Local Supabase test client is unavailable.");
  return createClient(url, publicKey, { auth: { persistSession: false } });
}

export async function deleteLocalTestUsers(userIds: string[]) {
  if (!userIds.length) return;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (userIds.some((userId) => !uuidPattern.test(userId))) {
    throw new Error("Refusing cleanup for an invalid test-user identifier.");
  }

  const ids = userIds.map((userId) => `'${userId}'`).join(",");
  const sql = `begin; create temp table helm_e2e_users(id uuid primary key) on commit drop; insert into helm_e2e_users values ${userIds.map((userId) => `('${userId}')`).join(",")}; create temp table helm_e2e_orgs on commit drop as select id from public.organizations where created_by in (select id from helm_e2e_users); delete from public.organization_members where user_id in (select id from helm_e2e_users); delete from public.organizations where id in (select id from helm_e2e_orgs); delete from public.profiles where id in (select id from helm_e2e_users); delete from auth.users where id in (${ids}); commit;`;

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
