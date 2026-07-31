---

name: demo-data-generator
description: Create realistic, internally consistent demonstration and development data for Helm. Use when generating seed data, sample projects, test records, dashboard scenarios, or example reports. Do not use for production data or destructive database operations.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Helm Demo Data Generator

## Purpose

Create realistic project-management data that allows Helm’s features, dashboards, reports, filters, status indicators, and alerts to be tested meaningfully.

Demo data should resemble real projects rather than random placeholder text.

## Required Reading

Before generating demo data, read:

* `AGENTS.md`
* `docs/product-brief.md`
* `docs/mvp-scope.md`
* `docs/domain-model.md`
* Existing database schema
* Existing migrations
* Existing seed files
* Relevant feature documentation

## Core Principles

Demo data must be:

* Realistic
* Internally consistent
* Safe
* Repeatable
* Clearly separated from production data
* Useful for testing user decisions
* Representative of different project conditions

Do not use real personal information.

Do not include real credentials, API keys, private company information, or confidential project data.

## Required Demo Scenarios

Where supported by the current schema, create at least these project scenarios.

### 1. Healthy Project

A project that is progressing normally.

Characteristics:

* Overall health is green
* Milestones are mostly on track
* Few overdue actions
* Risks are identified and actively managed
* No critical unresolved issues
* Team ownership is clear
* Status report reflects steady progress

### 2. Project Requiring Attention

A project with meaningful problems requiring project-manager intervention.

Characteristics:

* Overall health is amber or red
* One or more milestones are delayed
* Several actions are overdue
* At least one high-scoring risk exists
* At least one active issue exists
* A dependency is at risk
* A decision or escalation is required
* Status report clearly identifies support needed

### 3. Project Approaching Closure

A project in the closing phase.

Characteristics:

* Most deliverables are completed
* Acceptance records are present
* Remaining closure actions are visible
* Handover activities are underway
* Lessons learned are recorded
* Final approval is pending or recently completed
* Historical project records remain available

## Project Variety

Use varied project examples such as:

* Software implementation
* Business-process transformation
* Infrastructure upgrade
* Product launch
* Regulatory-compliance initiative
* Internal operating-model change

Avoid using the same names, dates, risks, and status patterns across every project.

## Organizations

Create fictional organizations with professional names.

Examples:

* Northstar Systems
* Meridian Health Services
* Harborline Logistics
* Asteron Manufacturing

Do not use a real company unless explicitly requested.

## Users

Create fictional users with:

* Full name
* Professional email address using a fictional or reserved domain
* Job title
* Organization role
* Project role

Use safe domains such as:

```text
example.com
example.org
example.net
```

Example:

```text
maya.chen@example.com
```

Do not create passwords in seed files unless the local authentication setup explicitly requires test credentials.

Never use real passwords.

## Project Dates

Dates must form a coherent timeline.

Confirm that:

* Start dates occur before target completion dates.
* Actual completion dates do not occur before start dates.
* Milestones fall within or reasonably near the project period.
* Overdue records have due dates in the past.
* Upcoming records have future dates.
* Historical status reports align with project progress.
* Closure dates occur after the relevant completion work.

Prefer relative date generation where repeatable test behavior is needed.

## Project Health

Use the documented values:

* Not Assessed
* Green
* Amber
* Red

Health values should match the underlying scenario.

Examples:

* A project with multiple critical overdue issues should not remain entirely green.
* A project with a single minor late action does not automatically need to be red.
* Status-report narratives should explain amber or red health.

## Milestones

Milestones should represent significant checkpoints.

Examples:

* Project charter approved
* Solution design completed
* Pilot launched
* User acceptance testing completed
* Production launch
* Operational handover completed

Do not use minor tasks as milestones.

For each milestone, make its:

* Owner
* Planned date
* Forecast date
* Actual date
* Status
* Completion percentage

consistent with the project scenario.

## Deliverables

Deliverables should be tangible or verifiable outputs.

Examples:

* Approved project charter
* Technical design document
* Configured application
* Training materials
* Migration plan
* Production-release package
* Handover documentation

Acceptance criteria and acceptance status should align with project progress.

## Risks

Risks must describe uncertain future events.

Good example:

> If the external identity provider is not approved by the security team before integration begins, the launch date may be delayed.

Bad example:

> The identity provider approval is late.

The bad example is already an issue.

Risk data should include:

* Probability
* Impact
* Score
* Owner
* Response strategy
* Mitigation plan
* Trigger
* Target date
* Status

High-scoring risks should be visible in project-health and reporting data.

## Assumptions

Assumptions should reflect real planning uncertainty.

Examples:

* Required subject-matter experts will be available during testing.
* Historical data quality will be sufficient for migration.
* Procurement will complete the contract before development begins.
* Regional teams will use the standard operating process.

Include both validated and unvalidated assumptions where supported.

## Issues

Issues must describe events or problems that have already occurred.

Examples:

* Test-environment access was delivered five business days late.
* The supplier failed the security review.
* Data reconciliation identified missing customer records.
* A key team member left the project unexpectedly.

Issue severity, owner, resolution plan, and status should be consistent.

## Dependencies

Dependencies should clearly identify:

* What depends on something else
* What is required
* Owner
* Needed-by date
* Status
* Impact if missed

Include internal and external dependencies where supported.

Examples:

* Production deployment depends on security approval.
* Training depends on finalized process documentation.
* Data migration depends on source-system access.
* Launch depends on supplier hardware delivery.

## Action Items

Create a useful mixture of:

* Open actions
* In-progress actions
* Blocked actions
* Completed actions
* Overdue actions
* Upcoming actions
* High-priority actions

Every active action should have:

* Clear wording
* One accountable owner
* Due date
* Priority
* Status
* Source or context

Avoid vague actions such as:

> Follow up.

Prefer:

> Confirm the revised security-review date with the infrastructure lead and update the launch forecast.

## Decisions

Decision records should preserve realistic context.

Examples:

* Approve phased deployment instead of a single launch.
* Delay migration until reconciliation errors are resolved.
* Use the existing identity provider rather than purchasing a new platform.
* Accept a temporary manual process for the first release.

Include:

* Decision-maker
* Date
* Context
* Alternatives
* Rationale
* Consequences

## Change Requests

Where supported, include a mixture of:

* Draft
* Submitted
* Under Review
* Approved
* Rejected
* Implemented

Change impacts should be realistic and connected to the project scenario.

An approved change affecting schedule should be reflected in forecast dates where appropriate.

## Status Reports

Status reports should summarize the underlying project records.

A report should include:

* Executive summary
* Accomplishments
* Planned work
* Upcoming milestones
* Top risks
* Top issues
* Decisions required
* Support required
* Health indicators

Do not describe a project as healthy when the underlying records show severe unresolved problems.

## Closure Data

For closing projects, include:

* Accepted deliverables
* Handover actions
* Outstanding actions
* Documentation completion
* Final stakeholder approval
* Closure summary
* Lessons learned

Do not mark a project closed while required closure activities remain incomplete unless the scenario explicitly represents an exception.

## Lessons Learned

Create useful, reusable lessons.

Each lesson should explain:

* What happened
* The effect on the project
* What should be repeated or changed
* Who might benefit from the lesson

Avoid generic statements such as:

> Communication should be better.

Prefer:

> Involve regional operations leads before finalizing the training schedule because local blackout periods caused two avoidable delays.

## Data Relationships

Ensure that:

* Every project belongs to a valid organization.
* Every project member references a valid user.
* Every project record references a valid project.
* Owners are authorized project participants where required.
* Linked source records exist.
* Status reports reflect underlying records.
* Closure records match the project phase.
* Dates and status transitions make sense.
* Historical records remain chronologically consistent.

## Volume Guidelines

Create enough records to test the interface without overwhelming development.

A typical demonstration project may include:

* 5 to 10 project members and stakeholders
* 4 to 8 milestones
* 5 to 12 deliverables
* 6 to 12 risks
* 3 to 8 assumptions
* 3 to 8 issues
* 4 to 10 dependencies
* 10 to 25 action items
* 4 to 10 decisions
* 2 to 6 change requests
* 3 to 8 status reports
* 5 to 12 closure items
* 3 to 8 lessons learned

Generate only entities currently supported by the application schema.

## Repeatability

Seed generation should be repeatable.

Where possible:

* Use stable identifiers or deterministic generation.
* Avoid creating duplicate records on every run.
* Support resetting development data safely.
* Clearly label demo organizations and projects.
* Separate demo-seeding commands from production migrations.

Do not make a production deployment depend on demo data.

## Safety Rules

* Never connect seed scripts to production by default.
* Never delete all records without checking the environment.
* Require an explicit development or test environment.
* Never include real credentials.
* Never include real customer data.
* Never expose service-role keys.
* Never bypass Row Level Security in browser code.
* Clearly mark any server-side administrative seed process.

## Testing Uses

Demo data should enable testing of:

* Empty and populated dashboards
* Green, amber, and red project health
* Sorting and filtering
* Overdue indicators
* Upcoming deadlines
* High-priority records
* Ownership views
* Cross-project separation
* Cross-organization separation
* Status-report generation
* Closure workflows
* Mobile and desktop layouts

## Expected Output

After generating demo data, report:

* Organizations created
* Users and roles created
* Projects created
* Scenario represented by each project
* Record counts by entity
* Date-generation strategy
* Seed command
* Reset command, if available
* Safety checks
* Tests performed
* Known limitations
