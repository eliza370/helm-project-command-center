# Helm Repository Instructions

## Product

Helm is a professional project-management command center.

It helps project managers initiate, plan, execute, monitor, control, and close projects from one connected workspace.

Tagline: **Plan. Navigate. Deliver.**

## Required Reading

Before planning or implementing a feature, read:

* `docs/product-brief.md`
* `docs/mvp-scope.md`
* `docs/domain-model.md`
* `docs/permissions-model.md`
* `docs/implementation-decisions.md`
* Any other documentation related to the requested feature

Do not contradict the documented product scope or domain rules without explicitly identifying the conflict.

## Product Priorities

Prioritize:

1. Clear project health and attention indicators
2. Accurate project-management terminology
3. Complete workflows rather than disconnected screens
4. Secure organization-level and project-level access
5. Reliable source records and auditability
6. Professional, calm, accessible user experience
7. Maintainable code and automated testing

## MVP Boundaries

Do not add excluded features from `docs/mvp-scope.md` unless specifically requested.

Avoid unnecessary complexity.

Do not attempt to build all of Helm at once. Work in small, complete vertical slices.

## Technology Direction

Use the existing application stack and conventions.

The intended stack is:

* Next.js
* TypeScript
* App Router
* Tailwind CSS
* Supabase and PostgreSQL
* Playwright for end-to-end testing
* Vercel-compatible deployment

Do not replace the core technology stack without explicit approval.

## Architecture Principles

* Prefer server-side logic for sensitive operations.
* Keep authentication and authorization separate from visual interface logic.
* Use database migrations for schema changes.
* Keep reusable interface components separate from feature-specific components.
* Keep project-management business rules in clearly named modules.
* Calculate dashboard metrics from source records where practical.
* Do not duplicate the same business rule across multiple components.
* Keep files focused and reasonably sized.
* Reuse existing components and patterns before creating new ones.

## Data Rules

* Every project belongs to an organization.
* Every operational project record belongs to a project.
* Every protected query must respect organization and project access.
* Risks, issues, actions, decisions, and dependencies are separate entities.
* A risk is an uncertain future event.
* An issue is a problem that has already occurred.
* Closed records should remain available for reporting and audit purposes.
* Important changes should be attributable to a user and timestamp.
* Do not permanently delete important project-governance records without an explicit requirement.

## Security Rules

* Never place secrets or service-role credentials in browser code.
* Never commit `.env` files containing secrets.
* Validate all user-controlled input.
* Enforce authorization on the server or database, not only in the interface.
* Enable Row Level Security for protected Supabase tables.
* Give users only the permissions required for their roles.
* Do not expose records from unauthorized organizations or projects.
* Review create, read, update, and delete access separately.

## Interface Principles

Helm should feel:

* Professional
* Calm
* Dependable
* Precise
* Structured
* Enterprise-ready
* Clear rather than overwhelming

The interface should:

* Make project health understandable at a glance
* Clearly identify overdue, blocked, and high-risk items
* Avoid excessive visual noise
* Use consistent terminology and status indicators
* Work on desktop and smaller screens
* Support keyboard navigation
* Provide meaningful labels for controls
* Include loading, empty, success, and error states
* Avoid using color as the only way to communicate status

Use nautical language sparingly. The Helm identity should feel distinctive, not gimmicky.

## Development Workflow

For every feature:

1. Read the relevant documentation.
2. Inspect the existing implementation.
3. Define the user outcome.
4. Define acceptance criteria.
5. Identify affected data entities.
6. Identify permission requirements.
7. Implement the smallest complete vertical slice.
8. Include validation and error handling.
9. Add or update automated tests.
10. Run the required quality checks.
11. Report what changed and any remaining limitations.

## Quality Requirements

Before describing work as complete:

* TypeScript checks must pass.
* Lint checks must pass.
* Relevant automated tests must pass.
* The primary workflow must work from beginning to end.
* Loading, empty, and error states must be handled.
* Authorization must be verified.
* The interface must be reviewed at desktop and mobile widths.
* No credentials, temporary debugging code, or unexplained placeholders may remain.

Do not claim a test passed unless it was actually run.

If a check cannot be run, state that clearly.

## Change Discipline

* Do not modify unrelated files without a clear reason.
* Do not silently remove existing functionality.
* Do not introduce new dependencies when the existing stack can reasonably solve the problem.
* Explain significant architectural changes.
* Keep database migrations reversible when practical.
* Preserve existing user data during schema changes.
* Do not rewrite a working feature merely to apply a preferred style.

## Completion Report

After implementing a feature, report:

* User outcome delivered
* Files created or changed
* Database changes
* Authorization changes
* Tests added or updated
* Commands run
* Test results
* Known limitations
* Recommended next development step
