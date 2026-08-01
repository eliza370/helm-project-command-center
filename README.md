# Helm

**Plan. Navigate. Deliver.**

Helm is a professional project-management command center that will help project managers initiate, plan, execute, monitor, control, and close projects from one connected workspace.

## Current status

The repository contains the Next.js application shell, local Supabase setup, and the first vertical slice database foundation. Authentication interfaces and Helm application features are not implemented yet.

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

Copy `.env.example` to `.env.local` when Supabase integration begins, then provide values for:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit real environment values or service-role credentials.

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
