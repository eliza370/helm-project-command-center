---

name: database-security
description: Design, review, or modify Helm database tables, migrations, authentication, authorization, Row Level Security policies, project access, organization access, audit behavior, or sensitive server-side operations. Use whenever a feature stores protected data or changes who can access it.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Helm Database Security

## Purpose

Protect Helm’s organization and project data through secure database design, server-side authorization, and carefully tested access policies.

Security must be enforced in the database or trusted server-side logic, not only through the user interface.

## Required Reading

Before making security or database changes, read:

* `AGENTS.md`
* `docs/product-brief.md`
* `docs/mvp-scope.md`
* `docs/domain-model.md`
* Existing database migrations
* Existing authentication code
* Existing authorization utilities
* Existing Row Level Security policies
* Existing security-related tests

## Core Security Principles

* Deny access by default.
* Grant only the permissions required for the user’s role.
* Every project belongs to one organization.
* Every protected project record belongs to a project.
* Organization access does not automatically grant unrestricted project access.
* Interface visibility is not a security control.
* Browser code must never contain service-role credentials or private secrets.
* User-supplied identifiers must never be trusted without authorization checks.
* Protected database tables must use Row Level Security.
* Security behavior must be tested.

## Sensitive Information

Never expose these values in browser code, logs, screenshots, or committed files:

* Supabase service-role keys
* Database passwords
* Private API keys
* Authentication secrets
* Encryption keys
* Session tokens
* Password-reset tokens
* Email-confirmation tokens
* Private connection strings

Public client configuration may only include values explicitly intended for browser use.

## Environment Files

Use environment variables for configuration and secrets.

Typical local files include:

```text
.env.local
```

Ensure secret-bearing environment files are excluded by `.gitignore`.

Provide placeholder names in `.env.example` without real values.

Example:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not commit a real `.env.local` file.

## Organization Access Model

An organization is Helm’s top-level data boundary.

A user should only access an organization when an active organization-membership record connects the user to it.

Organization membership should include:

* `organization_id`
* `user_id`
* `role`
* `status`
* `joined_at`

Administrative access should be based on an explicit organization role.

Do not infer organization administration from project ownership alone.

## Project Access Model

A user should access a project only when at least one approved rule permits it.

Possible rules include:

* The user is an active organization administrator.
* The user is an active project member.
* The project has been explicitly shared with the user through an approved mechanism.

Project membership should include:

* `project_id`
* `user_id`
* `access_level`
* `joined_at`
* `left_at`

Inactive or departed project members should no longer receive active access unless a documented exception exists.

## Initial Role Expectations

### Administrator

May:

* View projects within the organization
* Manage organization membership
* Manage organization settings
* Support project access administration

Administrator access must be based on active organization membership.

### Project Manager

May:

* View the assigned project
* Update project information
* Manage project members
* Create and update project records
* Produce reports
* Manage closure

### Project Member

May:

* View assigned projects
* View permitted project records
* Update records assigned to them where allowed
* Complete assigned actions

### Stakeholder

May:

* View explicitly authorized information
* Review published status information
* Provide approvals where allowed

### Read Only

May:

* View explicitly authorized information
* Not create, update, or delete project records

These expectations are starting rules. Feature-specific permissions must still be defined explicitly.

## Authorization Workflow

For every protected feature, define who can:

* Create
* Read
* Update
* Change status
* Assign an owner
* Approve
* Archive
* Delete

Do not use a single vague permission such as “can manage” when different operations require different controls.

## Server-Side Authorization

For protected server actions, route handlers, or backend functions:

1. Confirm the user has an authenticated session.
2. Resolve the user’s identity from the trusted session.
3. Verify organization membership.
4. Verify project access.
5. Verify the required role or operation permission.
6. Validate the requested record belongs to the authorized project.
7. Perform the action.
8. Return only the data the user is permitted to receive.

Do not accept a user ID from the browser as proof of identity.

Do not trust a project ID merely because it appears in a URL or form.

## Row Level Security

Enable Row Level Security on all protected tables.

Policies should explicitly address:

* Select
* Insert
* Update
* Delete

A read policy does not automatically secure writes.

A write policy does not automatically prevent unauthorized reads.

Review each operation independently.

## Policy Design

A project-record policy should normally confirm:

1. The authenticated user has active access to the parent project.
2. The project belongs to an organization the user may access.
3. The requested operation is allowed by the user’s role.
4. New or updated records remain inside the authorized project.

Insert and update policies must prevent users from assigning records to unauthorized projects or organizations.

## Secure Insert Rules

When inserting a project-owned record:

* Verify the project exists.
* Verify the user can access the project.
* Verify the user may create that record type.
* Ensure `project_id` belongs to the correct organization.
* Set trusted audit fields on the server where practical.
* Do not allow users to impersonate another creator.

## Secure Update Rules

When updating a record:

* Verify access to the existing record.
* Verify permission for the specific update.
* Prevent reassignment to an unauthorized project or organization.
* Protect immutable audit fields.
* Restrict approval and closure fields to authorized roles.
* Validate allowed status transitions.

## Delete and Archive Rules

Important project-governance records should normally be archived or closed rather than permanently deleted.

Before allowing deletion, consider:

* Reporting requirements
* Audit requirements
* Linked records
* Historical status reports
* Decisions and approvals
* Legal or contractual retention

Where permanent deletion is permitted, define cascade behavior deliberately.

Do not rely on database-default delete behavior without reviewing it.

## Foreign Keys

Use foreign keys to protect relationships.

Define deliberately whether a relationship should:

* Restrict deletion
* Cascade deletion
* Set the value to null
* Preserve historical information

For project-governance records, restricting or preserving is often safer than cascading.

## Database Constraints

Use constraints where they protect valid data.

Examples include:

* Required organization and project IDs
* Unique organization membership
* Unique project membership
* Allowed status values
* Valid numeric ranges
* Nonnegative scores
* Date relationships
* Required ownership for actionable records

Application validation does not replace database constraints for critical rules.

## Database Migrations

Every schema or policy change must use a version-controlled migration.

A migration should:

* Have a clear purpose
* Be safely repeatable where appropriate
* Preserve existing data
* Add constraints only after existing data is compatible
* Include Row Level Security changes
* Avoid embedding production secrets
* Be reviewed for rollback consequences

Do not manually edit a shared database without recording the equivalent migration.

## Audit Events

Important security and governance changes should create audit records.

Examples include:

* Project creation
* Project closure
* Member added or removed
* Role changed
* Risk closed
* Issue escalated
* Change request approved or rejected
* Sensitive record archived or deleted
* Project ownership changed

Audit records should capture:

* User
* Action
* Entity type
* Entity ID
* Organization
* Project
* Timestamp
* Relevant previous values
* Relevant new values

Do not store credentials, tokens, or unnecessary sensitive data in audit records.

## File Security

For uploaded project files:

* Store files in protected buckets.
* Apply organization and project access rules.
* Validate file size.
* Validate supported file types.
* Use generated storage paths.
* Avoid trusting the uploaded filename.
* Prevent unauthorized public URLs.
* Do not execute uploaded content.
* Remove embedded secrets from generated examples.

## Error Handling

Security errors should not reveal:

* Whether an unauthorized record exists
* Database structure
* Policy names
* Secret values
* Stack traces
* Internal identifiers not needed by the user

Return clear but limited messages such as:

```text
You do not have permission to access this project.
```

Log useful technical details only in an appropriate protected environment.

## Security Testing

Protected features should include tests for:

* Authenticated authorized access
* Authenticated unauthorized access
* Unauthenticated access
* Cross-organization access attempts
* Cross-project access attempts
* Role-restricted operations
* Invalid project or record IDs
* Attempts to reassign records to unauthorized projects
* Protected status or approval changes

At least one negative authorization test is required for each important protected workflow.

## Security Review Checklist

Before completion, verify:

* Authentication is required where expected.
* Authorization is enforced server-side or in the database.
* Row Level Security is enabled.
* Select, insert, update, and delete policies were reviewed separately.
* Cross-organization access is blocked.
* Cross-project access is blocked.
* User-controlled IDs are validated.
* Secrets are not exposed.
* Environment files are ignored.
* Audit fields cannot be casually falsified.
* Delete behavior is deliberate.
* Security tests were run.
* No temporary broad-access policies remain.

## Expected Output

After security work, report:

* Tables or features affected
* Authentication assumptions
* Authorization rules
* Roles affected
* Row Level Security policies added or changed
* Server-side checks added or changed
* Constraints and foreign keys
* Audit behavior
* Security tests
* Commands run
* Test results
* Known risks or limitations
