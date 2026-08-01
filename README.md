# Helm

**Plan. Navigate. Deliver.**

Helm is a professional project-management command center that will help project managers initiate, plan, execute, monitor, control, and close projects from one connected workspace.

## Current status

The repository contains the Next.js application shell, local Supabase database foundation, authentication, organization onboarding, project creation and editing, protected project overviews, and project-team access management. Additional project-management modules are not implemented yet.

## Prerequisites

* Node.js 20 or later
* npm
* Chromium installed through Playwright for end-to-end tests
* Docker or another Supabase-compatible container runtime for local database work

## Installation

```text
npm install
npx playwright install chromium
```

## Environment variables

Create an ignored `.env.local` and copy the local browser-safe URL and publishable key reported by `npx supabase status -o env` into:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit real environment values or service-role credentials.

Local email confirmation is disabled by default. If confirmation is enabled, use the `/auth/confirm` callback and a token-hash email template compatible with Supabase SSR.

## Development

```text
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```text
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run build
npm run test:e2e
npm run test:e2e:ui
```

## Local Supabase

```text
npx supabase start -x vector,logflare
npx supabase stop
npx supabase db reset
npm run test:db
npx supabase gen types typescript --local > lib/supabase/database.types.ts
```
