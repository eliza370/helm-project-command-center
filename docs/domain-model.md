# Helm Domain Model

## Purpose

This document defines the core business entities used by Helm.

The data model should support the full project lifecycle while keeping project information structured, connected, auditable, and easy to report on.

## Core Principles

* Every project record must belong to a project.
* Every project must belong to an organization.
* Every auditable record should identify who created it and when.
* Records with ownership should reference a user or project member.
* Closed records should remain available for reporting and audit purposes.
* Risks, issues, actions, and decisions should remain separate entities.
* Dashboard metrics should be calculated from source records rather than entered manually where possible.
* Access must be restricted to authorized users.

## Shared Fields

Top-level organization-owned entities, including projects and organization memberships, store `organization_id` directly.

Project-scoped operational records normally store `project_id` and derive organization ownership through the parent project. They should not duplicate `organization_id` unless a documented security, performance, or audit requirement justifies it.

Most project-scoped records should include:

* `id`
* `project_id`
* `created_by`
* `created_at`
* `updated_at`

Where relevant, records should also include:

* `title`
* `description`
* `status`
* `owner_id`
* `target_date`
* `completed_at`
* `closed_at`

## Organizations

An organization is the top-level workspace containing users and projects.

### Fields

* `id`
* `name`
* `description`
* `created_at`
* `updated_at`

## Users

A user is a person who can sign in to Helm.

### Fields

* `id`
* `email`
* `full_name`
* `job_title`
* `avatar_url`
* `created_at`
* `updated_at`

## Organization Members

An organization member connects a user to an organization.

### Fields

* `id`
* `organization_id`
* `user_id`
* `role`
* `joined_at`
* `status`

### Roles

* Administrator
* Member

The first authenticated user creates an organization through a simple onboarding flow and receives an active Administrator membership. Invitations and advanced provisioning are deferred.

## Projects

A project is the primary workspace in Helm.

### Fields

* `id`
* `organization_id`
* `name`
* `description`
* `business_objective`
* `project_manager_id`
* `sponsor_name` (required in the first vertical slice)
* `sponsor_email` (optional)
* `lifecycle_phase`
* `status`
* `start_date`
* `target_completion_date`
* `actual_completion_date`
* `overall_health`
* `scope_health`
* `schedule_health`
* `budget_health`
* `resource_health`
* `risk_health`
* `created_by`
* `created_at`
* `updated_at`
* `closed_at`

### Lifecycle Phases

* Initiation
* Planning
* Execution
* Monitoring and Control
* Closing
* Closed

### Project Statuses

* Draft
* Active
* On Hold
* At Risk
* Completed
* Cancelled

### Health Values

* Not Assessed
* Green
* Amber
* Red

In the first vertical slice, all six project-health fields are selected manually. Historical health updates are deferred until the status-reporting vertical slice.

### Initial Lifecycle and Status Validation

* Draft projects begin in the Initiation lifecycle phase.
* The Closed lifecycle phase is valid only with Completed or Cancelled status.
* Completed status requires the Closed lifecycle phase.
* Cancelled status requires the Closed lifecycle phase.
* The first vertical slice does not require a general transition engine, but trusted validation must reject invalid Closed, Completed, and Cancelled combinations.

Only an active organization Administrator or the assigned Project Manager may close or cancel a project.

## Project Members

A project member connects a user to a project.

### Fields

* `id`
* `project_id`
* `user_id`
* `project_role`
* `responsibilities`
* `access_level`
* `joined_at`
* `left_at`

### Access Levels

* Project Manager
* Project Member
* Stakeholder
* Read Only

Project access and operation permissions are defined in `docs/permissions-model.md`.

## Stakeholders

A stakeholder is a person or group affected by the project.

Stakeholders do not need to be registered Helm users.

### Fields

* `id`
* `project_id`
* `name`
* `organization`
* `job_title`
* `email`
* `phone`
* `stakeholder_type`
* `interest_level`
* `influence_level`
* `engagement_strategy`
* `notes`
* `owner_id`
* `created_at`
* `updated_at`

## Objectives

An objective describes a result the project is expected to achieve.

### Fields

* `id`
* `project_id`
* `title`
* `description`
* `owner_id`
* `status`
* `target_date`
* `created_at`
* `updated_at`

## Success Metrics

A success metric defines how project success will be measured.

### Fields

* `id`
* `project_id`
* `objective_id`
* `name`
* `description`
* `measurement_method`
* `target_value`
* `current_value`
* `unit`
* `owner_id`
* `status`
* `created_at`
* `updated_at`

## Milestones

A milestone represents a significant project checkpoint.

### Fields

* `id`
* `project_id`
* `name`
* `description`
* `owner_id`
* `planned_date`
* `forecast_date`
* `actual_date`
* `status`
* `completion_percentage`
* `notes`
* `created_at`
* `updated_at`

### Milestone Statuses

* Not Started
* On Track
* At Risk
* Delayed
* Completed
* Cancelled

## Deliverables

A deliverable is a tangible project output.

### Fields

* `id`
* `project_id`
* `milestone_id`
* `name`
* `description`
* `owner_id`
* `planned_start_date`
* `planned_completion_date`
* `forecast_completion_date`
* `actual_completion_date`
* `status`
* `acceptance_criteria`
* `accepted_by`
* `accepted_at`
* `notes`
* `created_at`
* `updated_at`

## Risks

Checkpoint 11 implements risks as the first RAID slice. Risks are classified as Threats or Opportunities and use constrained categories and type-compatible response strategies. Probability and impact remain 1–5; `risk_score` is a database-generated product, presented initially as Low (1–4), Moderate (5–9), High (10–16), or Critical (17–25) exposure. The review date is the next planned risk-review date.

Implemented statuses are Identified, Monitoring, Mitigating, Realized, and Closed. Realized and Closed are terminal, immutable, audited states requiring meaningful notes. Risk ownership is accountable project membership but grants no mutation permission. Issues, assumptions, dependencies, automatic issue creation, risk-to-issue linkage, and generic RAID or polymorphic infrastructure remain deferred as distinct later slices.

A risk is an uncertain future event that could affect the project.

A risk is not an issue. Once the event has occurred, it should be managed as an issue.

### Fields

* `id`
* `project_id`
* `title`
* `description`
* `category`
* `probability`
* `impact`
* `risk_score`
* `owner_id`
* `response_strategy`
* `mitigation_plan`
* `contingency_plan`
* `trigger`
* `target_date`
* `status`
* `occurred_at`
* `created_at`
* `updated_at`
* `closed_at`

### Risk Statuses

* Identified
* Assessing
* Monitoring
* Mitigating
* Occurred
* Closed
* Accepted

### Response Strategies

* Avoid
* Reduce
* Transfer
* Accept
* Escalate
* Exploit
* Enhance
* Share

### Risk Scoring

* Probability uses an integer scale from 1 to 5.
* Impact uses an integer scale from 1 to 5.
* Risk score equals probability multiplied by impact and therefore ranges from 1 to 25.

This rule is documented now and will be implemented with the later risk vertical slice.

## Assumptions

An assumption is something believed to be true for planning purposes but not yet confirmed.

Checkpoint 13 implements Assumptions as the third distinct RAID entity. Each records its planning rationale, validation method, impact if false, qualitative confidence, eligible validation owner, recorded and due dates, and current validation evidence. Active and Under Validation are active states. Validated, Invalidated, and Retired are terminal, immutable, audited outcomes requiring meaningful notes; validation and invalidation also require evidence. Ownership is read-only, overdue validation is derived rather than an Expired status, and permanent deletion is unsupported. Resulting Risk, Issue, or Action creation and linkage remain deferred.

### Fields

* `id`
* `project_id`
* `description`
* `owner_id`
* `validation_method`
* `validation_date`
* `status`
* `validation_result`
* `created_at`
* `updated_at`

### Assumption Statuses

* Active
* Under Validation
* Validated
* Invalidated
* Retired

## Issues

An issue is a problem that has already occurred and requires resolution.

Checkpoint 12 implements Issues as a separate RAID entity. Issues use the shared Scope, Schedule, Cost, Resources, Technical, Quality, Supplier, Compliance, Operational, and Other categories, with qualitative Low, Medium, High, and Critical severity. Open, In Progress, and Blocked are active; Resolved and Cancelled are terminal and immutable. Blocked requires a reason, while resolution and cancellation require meaningful notes and trusted actor/timestamp audit fields.

Each Issue has one eligible Project Manager or Project Member owner, but ownership grants no mutation authority. An Issue may optionally and immutably reference a Realized Risk in the same project through a typed foreign key. Managers create Issues deliberately; realization never creates one automatically, and multiple Issues may reference one Realized Risk. Assumptions, Dependencies, generic RAID infrastructure, and polymorphic source links remain deferred.

### Fields

* `id`
* `project_id`
* `title`
* `description`
* `severity`
* `impact`
* `owner_id`
* `resolution_plan`
* `target_resolution_date`
* `actual_resolution_date`
* `status`
* `escalation_required`
* `created_at`
* `updated_at`
* `closed_at`

### Issue Statuses

* Open
* In Progress
* Blocked
* Resolved
* Cancelled

## Dependencies

A Dependency is a required condition, input, commitment, service, decision, or outcome that a project relies on to progress or deliver successfully. Checkpoint 14 implements Dependencies as the fourth separate RAID entity; it does not use generic RAID or relationship tables.

### Fields

* `id`
* `project_id`
* `title`
* `description`
* `classification` (`Internal` or `External`)
* `provider_name`
* `required_outcome`
* `required_for`
* `impact_if_missed`
* `management_plan`
* `owner_membership_id`
* `identified_date`
* `needed_by_date`
* `status`
* `satisfaction_evidence`
* `outcome_notes`
* Trusted terminal actor and timestamp fields
* `created_by`
* `created_at`
* `updated_at`

### Dependency Statuses

* Identified
* Confirmed
* In Progress
* At Risk
* Satisfied
* Failed
* No Longer Required

Identified, Confirmed, In Progress, and At Risk are active states. The three outcomes are terminal, immutable, audited states. Satisfaction requires evidence and outcome notes; failure and no-longer-required outcomes require notes. Overdue is derived from `needed_by_date`, not stored as a status.

Only active organization Administrators and the actual assigned Project Manager may mutate Dependencies. Owners are limited to that actual Project Manager or active Project Members, but ownership grants no mutation permission. Historical ownership remains visible after deactivation and active records surface an Inactive owner attention reason.

Cross-project links, dependency graphs, automatic propagation, polymorphic relationships, permanent deletion, reopening, and automatic creation of other governance records remain deferred.

## Action Items

Checkpoint 10 implements project actions with one eligible project-membership owner, a due date, priority, active working status, terminal completion or cancellation, and trusted creator/completion/cancellation audit fields. Completed and Cancelled actions are retained and immutable; permanent deletion and reopening are not supported in this checkpoint.

Structured `source`, `source_type`, `source_id`, and generic related-record linkage are deliberately deferred until supported source entities exist. An unconstrained polymorphic identifier would not provide foreign-key, same-project, or organization-boundary integrity. Future slices should use typed foreign keys or integrity-preserving relation tables.

An action item is a specific follow-up assigned to a person.

### Fields

* `id`
* `project_id`
* `title`
* `description`
* `owner_id`
* `due_date`
* `priority`
* `status`
* `source_type`
* `source_id`
* `completion_notes`
* `completed_at`
* `created_by`
* `created_at`
* `updated_at`

### Action Statuses

* Open
* In Progress
* Blocked
* Completed
* Cancelled

### Priority Values

* Low
* Medium
* High
* Critical

## Decisions

A Decision is an authoritative record of an important project choice after it has been made. It is not a pending approval, vote, discussion, task, or mutable workflow item. Decisions have no status lifecycle; Helm derives `Recorded` and `Corrected` display labels from trusted correction audit fields.

### Fields

* `id`
* `project_id`
* `title`
* `decision`
* `decision_date`
* `decision_maker_name`
* `context`
* `alternatives_considered`
* `rationale`
* `consequences`
* `effective_date` (optional)
* `follow_up_notes` (optional)
* `correction_reason` (optional until corrected)
* `last_corrected_by` (optional until corrected)
* `last_corrected_at` (optional until corrected)
* `created_by`
* `created_at`
* `updated_at`

`decision_maker_name` is a durable text snapshot because a legitimate decision-maker may be a person or body without a Helm account. Being named grants no permission. Corrections fix inaccurate records and retain the latest authoritative values plus the latest trusted correction reason, actor, and timestamp. A changed project choice is recorded as a new Decision; full revision history is deferred.

Generic related-record fields are deferred because weak polymorphic identifiers would not preserve referential or same-project integrity. Follow-up work is created manually as an Action; recording or correcting a Decision never mutates another governance record.

## Change Requests

A Change Request is a formal, auditable proposal for a controlled project modification. Drafts are private to managers. Submission attests a complete structured impact assessment and freezes the governance proposal. Approval never changes source project records; it permits only implementation planning and outcome tracking.

### Fields

* `id`
* `project_id`
* `title`
* `description`
* `reason`
* `requester_name` (durable text; grants no permission)
* `requested_date`
* `scope_impact`
* `schedule_impact`
* `budget_impact`
* `resource_impact`
* `quality_impact`
* `risk_impact`
* `recommendation`
* Implementation owner and target date
* Trusted creator, editor, submitter, decision, withdrawal, implementation-start, and outcome audit fields
* `status`
* `created_at`
* `updated_at`

### Change Request Statuses

* Draft
* Submitted
* Approved
* Rejected
* Withdrawn
* In Implementation
* Implemented
* Not Implemented

Rejected, Withdrawn, Implemented, and Not Implemented are terminal and immutable. An Approved or In Implementation request may conclude as Not Implemented with meaningful outcome notes. Creator, requester, decision actor, and implementation ownership grant no mutation permission. Change Control does not automatically mutate Projects or any other governance record. Reopening, deletion, archive, generic approval infrastructure, comments, attachments, notifications, source links, baseline comparison, and Status Report integration are deferred.

## Project Health Updates

A project health update records the project's condition at a point in time.

### Fields

* `id`
* `project_id`
* `reporting_date`
* `overall_health`
* `scope_health`
* `schedule_health`
* `budget_health`
* `resource_health`
* `risk_health`
* `summary`
* `created_by`
* `created_at`

Health updates should be preserved to support trends over time.

This entity is deferred until the status-reporting vertical slice and is not part of the first development slice.

## Status Reports

A status report provides a stakeholder-ready project summary.

### Fields

* `id`
* `project_id`
* `reporting_period_start`
* `reporting_period_end`
* `overall_health`
* `executive_summary`
* `accomplishments`
* `planned_work`
* `top_risks`
* `top_issues`
* `upcoming_milestones`
* `decisions_required`
* `support_required`
* `created_by`
* `created_at`
* `published_at`

Draft reports may derive current values from project source records. Once published, a report becomes a historical snapshot. Published reports preserve their narrative and selected record references so later source-record changes do not rewrite reporting history.

Status-report implementation must define how selected references and their publication-time presentation are preserved.

## Comments and Approvals

General comments are excluded from the initial MVP implementation. Helm will not introduce a generic approval entity or workflow in the initial slices.

Feature-specific approvals, including change-request approval and deliverable acceptance, belong to their respective later vertical slices and must preserve the approver, decision, and timestamp required by that feature.

## Meetings

A meeting record captures project discussions and outcomes.

### Fields

* `id`
* `project_id`
* `title`
* `meeting_date`
* `meeting_type`
* `facilitator_id`
* `attendees`
* `agenda`
* `notes`
* `created_by`
* `created_at`
* `updated_at`

Actions and decisions created during meetings should be stored in their respective entities and linked to the meeting.

## Closure Items

A closure item represents a required project-closing activity.

### Fields

* `id`
* `project_id`
* `title`
* `description`
* `category`
* `owner_id`
* `due_date`
* `status`
* `completion_evidence`
* `completed_at`
* `created_at`
* `updated_at`

## Lessons Learned

A lesson learned captures reusable knowledge from the project.

### Fields

* `id`
* `project_id`
* `category`
* `title`
* `description`
* `what_happened`
* `impact`
* `recommendation`
* `submitted_by`
* `created_at`
* `updated_at`

## Attachments

An attachment connects a file to a project record.

### Fields

* `id`
* `project_id`
* `related_record_type`
* `related_record_id`
* `file_name`
* `file_path`
* `file_type`
* `file_size`
* `uploaded_by`
* `uploaded_at`

## Audit Events

An audit event records important changes.

### Fields

* `id`
* `organization_id`
* `project_id`
* `user_id`
* `action`
* `entity_type`
* `entity_id`
* `previous_values`
* `new_values`
* `created_at`

## Initial Implementation Priority

The first complete vertical slice should implement only:

1. Authentication
2. First-user organization onboarding
3. Organizations, users, and organization memberships
4. Project creation
5. Automatic Project Manager membership for the project creator
6. Protected project overview
7. Manually selected project-health fields
8. Required authorization and validation

All other entities should be added incrementally as complete vertical features.
# Project Status Reports

A Status Report is a stakeholder-readable project summary for an exact completed reporting period. It has a `Draft -> Published` lifecycle. Drafts use independently editable six-dimension health and show clearly labelled live project context. Publication copies mutable project headings and bounded, category-specific snapshots of upcoming Milestones, top active Risks, top active Issues, overdue Actions, and recent Decisions. Published reports are immutable historical publication-time snapshots; they are not reconstructions of source state at the reporting-period end.

Required narratives are executive summary, accomplishments, and planned work. Concerns, decisions required, and support required are optional. Creator, latest draft editor, and publisher identities and timestamps are trusted audit data. One report is allowed per project and exact reporting-period pair. Correction, supersession, recall, unpublish, archive, and deletion are deferred.
