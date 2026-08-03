# Helm MVP Scope

## MVP Objective

The first version of Helm should prove that a project manager can create a project, organize its essential information, identify what needs attention, and view a useful project status overview from one application.

The MVP should prioritize a complete, reliable workflow over a large number of partially developed features.

## Core Workflow

A project manager should be able to:

1. Sign in to Helm.
2. Create a project.
3. Define the project's basic information.
4. Add project team members and stakeholders.
5. Add milestones and deliverables.
6. Record risks, assumptions, issues, and dependencies.
7. Assign and track action items.
8. Record important decisions.
9. Update project health.
10. Produce a project status overview.
11. Complete basic project closure activities.

## Included Modules

### 1. Project Overview

The project overview should include:

* Project name
* Project description
* Business objective
* Project manager
* Project sponsor
* Project sponsor email (optional)
* Lifecycle phase
* Start date
* Target completion date
* Overall status
* Scope health
* Schedule health
* Budget health
* Resource health
* Risk health
* Current accomplishments
* Current blockers
* Next steps

### 2. Team and Stakeholders

Users should be able to record:

* Project manager
* Project sponsor
* Team members
* Workstream leads
* Stakeholders
* Roles and responsibilities
* Contact information
* Level of influence
* Level of interest

### 3. Milestones and Deliverables

Users should be able to track:

* Milestone name
* Deliverable name
* Description
* Owner
* Planned start date
* Planned completion date
* Actual completion date
* Status
* Dependencies
* Completion notes

### 4. RAID Register

The RAID register should support:

* Risks
* Assumptions
* Issues
* Dependencies

Risk records should include:

* Description
* Category
* Probability
* Impact
* Risk score
* Owner
* Response strategy
* Mitigation plan
* Trigger
* Target date
* Status

Issue records should include:

* Description
* Severity
* Impact
* Owner
* Resolution plan
* Target resolution date
* Status

### 5. Action Items

Users should be able to track:

* Action description
* Owner
* Due date
* Priority
* Status
* Source
* Related project record
* Completion notes

### 6. Decision Log

Users should be able to record:

* Decision
* Decision date
* Decision-maker
* Context
* Alternatives considered
* Reason for the decision
* Consequences
* Related records (deferred until an integrity-preserving relationship design is implemented)

### 7. Status Reporting

The project status view should include:

* Overall project health
* Scope health
* Schedule health
* Budget health
* Resource health
* Risk health
* Recent accomplishments
* Planned work
* Upcoming milestones
* Top risks and issues
* Overdue action items
* Decisions required
* Support required

### 8. Change Control

Users should be able to record:

* Change request
* Reason for the change
* Requester
* Date submitted
* Scope impact
* Schedule impact
* Budget impact
* Risk impact
* Recommendation
* Approval decision
* Decision-maker
* Decision date
* Status

### 9. Project Closure

Users should be able to track:

* Deliverable acceptance
* Outstanding action items
* Handover activities
* Documentation completion
* Final stakeholder approval
* Closure date
* Final project summary
* Lessons learned

## Initial User Roles

Helm separates organization roles from project access levels. Organization roles are `Administrator` and `Member`. Project access levels are `Project Manager`, `Project Member`, `Stakeholder`, and `Read Only`. See `docs/permissions-model.md` for access precedence and operation-level permissions.

The MVP should support these roles:

### Administrator

* Manage organizations and users
* Access all projects within the organization
* Configure organization settings

### Project Manager

* Create and manage projects
* Manage project records
* Add project members
* Produce status reports
* Close projects

### Project Member

* View assigned projects
* Update assigned records
* Complete assigned action items

### Stakeholder

* View authorized project information
* Review status reports
* Provide approvals where permitted

### Read Only

* View explicitly authorized project information
* Cannot create, update, close, or cancel project records

## First Development Slice

The first complete vertical slice includes only:

1. Authentication
2. First-user organization onboarding
3. Organization membership
4. Project creation
5. Automatic project-manager membership
6. A protected project overview
7. Manually selected project-health values
8. Required server-side authorization, validation, and negative-access testing

The first authenticated user creates an organization and becomes its Administrator. Invitations and advanced organization provisioning are deferred. Project creation requires a sponsor name and permits an optional sponsor email; the sponsor does not need a Helm account.

No other project-management modules are part of this first slice. Historical project-health updates are deferred to the status-reporting slice.

## Explicitly Excluded from the MVP

The following features should not be built during the initial MVP:

* Advanced Gantt chart editing
* Detailed task-management boards
* Resource capacity forecasting
* Earned value management
* Detailed financial accounting
* Portfolio optimization
* Jira integration
* Microsoft Project integration
* Custom workflow builders
* AI-generated project plans
* Native mobile applications
* Real-time chat
* Complex notification systems
* Public project pages
* Customer billing and subscriptions
* General-purpose comments
* A generic approval system

Feature-specific approvals, such as change approval and deliverable acceptance, are included only when their corresponding vertical slices are implemented.

## MVP Success Criteria

The MVP is successful when a project manager can:

* Create a project
* View a clear project overview
* Add and manage essential project records
* Identify overdue and high-risk items
* Understand project health at a glance
* Generate a useful status summary
* Restrict project access to authorized users
* Complete the primary workflow without using an external spreadsheet
# Project Status Reporting

The MVP includes protected Status Report registers, manager-authored drafts, deliberate publication, independent report health, narrative sections, and immutable publication-time project/source snapshots. Approval workflows, corrections and supersession, recall or unpublish, deletion or archive, comments, attachments, notifications, distribution, exports, AI narratives, templates, charts, custom sections, portfolio reporting, and generic source relationships are excluded.

# Project Change Control

The MVP includes private manager-authored Change Request drafts, formal submission with a complete six-dimension impact assessment, approval or rejection, implementation planning and tracking, withdrawal before decision, and immutable Implemented, Not Implemented, Rejected, and Withdrawn outcomes. Change Control never automatically mutates another project record. Generic approvals, multi-stage approval, voting, comments, attachments, notifications, source links, baseline comparison, financial accounting, reopening, deletion, archive, and Status Report integration are excluded.
