# Helm

**Plan. Navigate. Deliver.**

Helm is a professional project-management command center that will help project managers initiate, plan, execute, monitor, control, and close projects from one connected workspace.

## Current status

The repository currently contains the Next.js application shell and its tooling baseline. Supabase setup, authentication, database migrations, and Helm application features are not implemented yet.

## Prerequisites

* Node.js 20 or later
* npm
* Chromium installed through Playwright for end-to-end tests
* Docker or another Supabase-compatible container runtime will be required for future local database work, but is not needed for the current application shell

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

The database test command is reserved for the later Supabase checkpoint:

```text
npm run test:db
```

It will not be usable until the repository has been initialized for local Supabase development and database tests have been added.
