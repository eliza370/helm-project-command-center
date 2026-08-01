import { execFileSync } from "node:child_process";

const urlVariable = "HELM_E2E_SUPABASE_URL";
const keyVariable = "HELM_E2E_SUPABASE_PUBLISHABLE_KEY";

function parseStatusEnvironment(output: string) {
  return new Map(
    output
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Z_]+)="?(.*?)"?$/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map((match) => [match[1], match[2].replace(/"$/, "")]),
  );
}

export default function globalSetup() {
  let output: string;

  try {
    const command = process.env.ComSpec ?? "cmd.exe";
    output = execFileSync(
      command,
      ["/d", "/s", "/c", "npx.cmd supabase status -o env"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
  } catch {
    throw new Error(
      "Local Supabase E2E configuration failed. Confirm the local Supabase stack is running and retry.",
    );
  }

  const values = parseStatusEnvironment(output);
  const url = values.get("API_URL");
  const publishableKey = values.get("PUBLISHABLE_KEY") ?? values.get("ANON_KEY");

  if (!url || !publishableKey) {
    throw new Error(
      "Local Supabase E2E configuration is incomplete. Required URL or publishable key values were not returned.",
    );
  }

  process.env[urlVariable] = url;
  process.env[keyVariable] = publishableKey;
}
