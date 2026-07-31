# Helm Domain Model

## Purpose

This document defines the core business entities used by Helm.

The data model should support the full project lifecycle while keeping project information structured, connected, auditable, and easy to report on.

## Core Principles

* Every project record must belong to a project.
* Every project must belong to an organization.
* Every record should identify who created it and when.
* Records with ownership should reference a user or project member.
* Closed records should remain available for reporting and audit purposes.
* Risks, issues, actions, and decisions should remain separate entities.
* Dashboard metrics should be calculated from source records rather than entered manually where possible.
* Access must be restricted to authorized users.

## Shared Fields

Most project records should include:

* `id`
* `organization_id`
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

## Projects

A project is the primary workspace in Helm.

### Fields

* `id`
* `organization_id`
* `name`
* `description`
* `business_objective`
* `project_manager_id`
* `sponsor_name`
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

## Assumptions

An assumption is something believed to be true for planning purposes but not yet confirmed.

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

* Unvalidated
* Validated
* Invalidated
* Expired

## Issues

An issue is a problem that has already occurred and requires resolution.

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
* Investigating
* In Progress
* Blocked
* Resolved
* Closed

## Dependencies

A dependency is a relationship in which one item relies on another.

### Fields

* `id`
* `project_id`
* `title`
* `description`
* `dependency_type`
* `internal_or_external`
* `dependent_item`
* `required_item`
* `owner_id`
* `needed_by_date`
* `status`
* `impact_if_missed`
* `created_at`
* `updated_at`

### Dependency Statuses

* Identified
* Confirmed
* On Track
* At Risk
* Missed
* Resolved

## Action Items

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

A decision records an important project choice and its context.

### Fields

* `id`
* `project_id`
* `title`
* `decision`
* `decision_date`
* `decision_maker`
* `context`
* `alternatives_considered`
* `rationale`
* `consequences`
* `related_record_type`
* `related_record_id`
* `created_by`
* `created_at`
* `updated_at`

## Change Requests

A change request proposes a controlled modification to the project.

### Fields

* `id`
* `project_id`
* `title`
* `description`
* `reason`
* `requested_by`
* `submitted_at`
* `scope_impact`
* `schedule_impact`
* `budget_impact`
* `resource_impact`
* `risk_impact`
* `recommendation`
* `decision`
* `decision_maker`
* `decision_date`
* `status`
* `created_at`
* `updated_at`

### Change Request Statuses

* Draft
* Submitted
* Under Review
* Approved
* Rejected
* Deferred
* Implemented
* Cancelled

## Project Health Updates

A project health update records the project’s condition at a point in time.

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

The first development phase should implement only:

1. Organizations
2. Users
3. Organization members
4. Projects
5. Project members
6. Project health fields

All other entities should be added incrementally as complete vertical features.
