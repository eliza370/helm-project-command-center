# Helm Implementation Decisions

## Purpose

This document records approved decisions that resolve early product, domain, and authorization questions. Detailed entity definitions remain in `docs/domain-model.md`, and access rules remain in `docs/permissions-model.md`.

## Approved Initial Decisions

### Identity and onboarding

* The first authenticated user creates an organization and becomes its active Administrator.
* The first implementation may use a simple onboarding flow.
* Invitations and advanced organization provisioning are deferred.

### Roles and access

* Organization roles are Administrator and Member.
* Project access levels are Project Manager, Project Member, Stakeholder, and Read Only.
* Active organization Administrators may view and administer every project in their organization.
* Ordinary organization membership does not grant project access.
* Non-administrators require active project membership.
* Organization Administrators and the assigned Project Manager may edit project details and are the only roles allowed to close or cancel a project.

### Project sponsor

* The first slice stores a required sponsor name and optional sponsor email.
* The sponsor need not be a registered Helm user.
* Optional linkage to a user or stakeholder is deferred.

### Project health

* Overall, scope, schedule, budget, resource, and risk health are manually selected in the first slice.
* Allowed values are Not Assessed, Green, Amber, and Red.
* Historical `project_health_updates` are deferred to the status-reporting slice.

### Lifecycle and status

* Lifecycle phases are Initiation, Planning, Execution, Monitoring and Control, Closing, and Closed.
* Project statuses are Draft, Active, On Hold, At Risk, Completed, and Cancelled.
* Draft projects begin in Initiation.
* Closed lifecycle is valid only with Completed or Cancelled status.
* Completed and Cancelled statuses each require Closed lifecycle.
* The first slice uses focused validation for these combinations and does not introduce a general transition engine.

### Risk scoring

* Probability and impact each use integer scales from 1 to 5.
* Risk score is `probability * impact`, producing a range from 1 to 25.
* Checkpoint 11 implements the score as a PostgreSQL generated stored column that is never accepted from client input.
* Helm's initial presentation bands are Low (1–4), Moderate (5–9), High (10–16), and Critical (17–25); these are product presentation bands, not universal standards.
* The first RAID slice implements only Threat and Opportunity risks. Issues, assumptions, dependencies, issue linkage, and generic RAID infrastructure remain deferred as distinct slices.

### Project issues

* Checkpoint 12 implements Issues as a distinct second section of the RAID register and a separate `project_issues` entity.
* Issue severity is qualitative: Low, Medium, High, or Critical. Categories reuse the established project-impact taxonomy.
* Open, In Progress, and Blocked are active states. Resolved and Cancelled are terminal, immutable, audited states; reopening and permanent deletion are unsupported.
* Active organization Administrators and the actual assigned Project Manager manage Issues. All other project roles, including an assigned owner, are read-only.
* An Issue may optionally reference a same-project Realized Risk through an immutable typed foreign key. Issue creation remains manual, multiple Issues may share one origin, and no conversion RPC or automatic creation is introduced.
* At Checkpoint 12, Assumptions, Dependencies, generic RAID tables, and polymorphic source identifiers remained deferred.

### Project assumptions

* Checkpoint 13 implements Assumptions as a separate third RAID entity with the established project-impact categories and qualitative Low, Medium, and High confidence.
* Active and Under Validation are active states. Validated, Invalidated, and Retired are terminal, immutable, audited outcomes. Overdue validation is derived and is not an Expired status.
* Validation and invalidation require current evidence and outcome notes; retirement requires outcome notes. Active organization Administrators and the actual assigned Project Manager manage Assumptions; ownership grants no mutation authority.
* Checkpoint 14 implements Dependencies as the fourth separate RAID entity with one `Internal` or `External` classification field. Plain constrained provider/outcome/required-for text preserves integrity without premature cross-project, vendor, graph, or polymorphic relationship infrastructure.
* Dependency overdue state is derived with the shared 14-day soon window; `Missed` is not a lifecycle status. Satisfied, Failed, and No Longer Required are immutable audited terminal outcomes. Only Administrators and the actual assigned Project Manager mutate Dependencies; ownership grants no mutation authority.
* Risk, Issue, and Action creation or linkage, automatic conversion, generic RAID tables, polymorphic source fields, and Dependencies remain deferred.

### Organization ownership

* Top-level entities such as projects and organization memberships store `organization_id` directly.
* Project-scoped operational records normally store `project_id` and derive organization ownership through the parent project.
* A project-scoped table duplicates `organization_id` only when a documented security, performance, or audit need justifies it.

### Comments and approvals

* General comments are excluded from the initial MVP implementation.
* No generic approval system will be created now.
* Feature-specific approvals will be implemented with change control, deliverable acceptance, or other relevant later slices.

### Status reports

* Draft reports may derive current values from source records.
* Published reports are historical snapshots.
* Published reports preserve narrative content and selected record references so later source changes do not rewrite history.

## First Development Slice

The first vertical slice consists only of:

1. Authentication
2. First-user organization onboarding
3. Organization membership
4. Project creation
5. Automatic Project Manager membership
6. Protected project overview
7. Manually selected health values
8. Required authorization and validation

No RAID, milestone, deliverable, action, decision, status-report, change-control, closure, comment, generic approval, invitation, or advanced provisioning implementation belongs in this slice.

## Deferred Design Work

Later vertical slices must define:

* Invitation lifecycle and organization provisioning
* Sponsor linkage to users or stakeholders
* Historical project-health update behavior
* Full project lifecycle transition rules, if needed
* Risk scoring storage and calculation enforcement
* Per-module create, read, update, status-change, approval, archive, and delete permissions
* Published status-report snapshot storage and reference presentation
* Feature-specific approval workflows
* Audit-event coverage and retention for each governance feature
