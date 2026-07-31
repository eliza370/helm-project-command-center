---

name: pm-domain-modeling
description: Define, review, or modify Helm project-management entities, fields, statuses, relationships, lifecycle rules, and business logic. Use when working with projects, milestones, deliverables, stakeholders, RAID records, actions, decisions, changes, status reports, or closure. Do not use for isolated styling work.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Project Management Domain Modeling

## Purpose

Ensure that Helm's data structures, workflows, terminology, and business rules accurately support professional project management.

Use `docs/domain-model.md` as the primary domain reference.

## Required Reading

Before making domain changes, read:

* `AGENTS.md`
* `docs/product-brief.md`
* `docs/mvp-scope.md`
* `docs/domain-model.md`

Also inspect any existing database schema, TypeScript types, validation schemas, and interface components related to the requested feature.

## Core Rules

### Projects

* Every project belongs to an organization.
* Every operational project record belongs to a project.
* Every project must have a lifecycle phase and status.
* Lifecycle phase and project status are separate concepts.
* Project health values should use consistent definitions.
* Historical project-health updates should be preserved.

### Risks

A risk is an uncertain future event that may affect project objectives.

A risk should include:

* A clear description of the uncertain event
* Probability
* Impact
* Risk score
* Owner
* Response strategy
* Mitigation or response plan
* Status

Do not describe a problem that has already occurred as a risk.

When a risk occurs, preserve the original risk record and create or link an issue where appropriate.

### Issues

An issue is a problem that has already occurred and requires investigation, resolution, escalation, or acceptance.

An issue should include:

* Description
* Impact or severity
* Owner
* Resolution plan
* Target resolution date
* Status

Do not combine risks and issues into one generic record type merely because they share some fields.

### Assumptions

An assumption is something believed to be true for planning purposes but not yet confirmed.

An assumption should support:

* Validation method
* Validation date
* Owner
* Status
* Validation result

Invalidated assumptions may create risks, issues, actions, or change requests.

### Dependencies

A dependency represents a relationship in which one item relies on another item, team, event, supplier, decision, or deliverable.

A dependency should identify:

* What is dependent
* What is required
* Who owns the dependency
* When it is needed
* Current status
* Impact if missed

### Action Items

An action item is a specific follow-up assigned to an owner.

An actionable record should include:

* A clear action
* One accountable owner
* Due date
* Priority
* Status
* Source or context

Do not use action items as substitutes for milestones, deliverables, risks, issues, or decisions.

### Decisions

A decision record should preserve:

* What was decided
* Who made or approved the decision
* When it was made
* Why it was made
* Alternatives considered where relevant
* Consequences or follow-up effects

Decisions should remain available after project closure.

### Milestones

A milestone is a significant project checkpoint or event.

A milestone is not a general task.

Milestones should support:

* Planned date
* Forecast date
* Actual date
* Owner
* Status
* Related deliverables or dependencies

### Deliverables

A deliverable is a tangible or verifiable project output.

Deliverables should support:

* Acceptance criteria
* Owner
* Planned and forecast dates
* Completion status
* Acceptance status
* Acceptance evidence or notes

### Change Requests

A change request represents a controlled proposal to alter the project.

A change request should capture relevant effects on:

* Scope
* Schedule
* Budget
* Resources
* Risk
* Expected benefits

Approval status, approver, and decision date must remain auditable.

### Status Reports

Status reports should summarize source records rather than become a second disconnected system of truth.

Where practical, derive:

* Overdue actions
* Upcoming milestones
* Top risks
* Open critical issues
* Project-health indicators

Allow narrative fields for interpretation, accomplishments, planned work, decisions required, and support required.

### Closure

Project closure should support:

* Deliverable acceptance
* Outstanding-item review
* Handover
* Documentation completion
* Final approval
* Lessons learned
* Closure date
* Final project summary

Closing a project should not erase its records.

## Modeling Workflow

When defining or modifying a project-management feature:

1. Identify the user outcome.
2. Identify the relevant domain entity.
3. Confirm whether an existing entity already serves the need.
4. Define the entity's purpose in one sentence.
5. Define required and optional fields.
6. Define statuses and allowed transitions.
7. Define ownership.
8. Define organization and project relationships.
9. Define permission requirements.
10. Define audit requirements.
11. Define relationships to other entities.
12. Define dashboard or reporting consequences.
13. Check terminology against this skill and `docs/domain-model.md`.
14. Update documentation when the accepted model changes.

## Status Design Rules

Statuses should:

* Be mutually understandable
* Represent meaningful workflow states
* Avoid near-duplicate meanings
* Support filtering and reporting
* Include a clear closed, completed, resolved, or cancelled state where relevant

Do not create a status solely for visual decoration.

Document any restrictions on moving between statuses.

## Calculated Fields

Prefer calculated values when the result can reliably be derived from source data.

Examples include:

* Risk score from probability and impact
* Overdue status from due date and completion status
* Milestone delay from planned, forecast, and actual dates
* Project counts from related records

Do not store the same value in multiple places unless there is a deliberate historical or performance reason.

## Ownership Rules

Records requiring follow-up should normally have one accountable owner.

Multiple contributors may be supported separately, but accountability should remain clear.

When a user leaves a project, owned records must not silently lose accountability. Require reassignment, display an unassigned state, or preserve historical ownership appropriately.

## Auditability Rules

Preserve:

* Creator
* Creation timestamp
* Most recent update timestamp
* Important status changes
* Closure or completion timestamp
* Approval or decision information
* Relevant previous and new values for sensitive changes

Avoid permanent deletion for governance records unless explicitly required.

## Expected Output

When completing domain-modeling work, report:

* Entity or workflow affected
* Business purpose
* Fields added, removed, or changed
* Statuses and transitions
* Relationships
* Ownership rules
* Permission implications
* Reporting implications
* Documentation updated
* Open questions or limitations
