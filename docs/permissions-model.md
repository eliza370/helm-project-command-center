# Helm Permissions Model

## Purpose

This document defines the initial organization and project access model for Helm. Authentication identifies a user; authorization determines which organizations, projects, records, and operations that user may access.

Authorization must be enforced in trusted server-side logic or the database. Interface visibility is not a security boundary.

## Organization Roles

Organization membership has one of two roles:

* `Administrator`
* `Member`

Only active organization memberships grant organization access.

### Administrator

An active Administrator may view and administer every project belonging to the organization. This permission does not depend on project membership.

Administrators may manage organization membership and settings, create projects, edit project details, manage project access, and close or cancel projects within their organization.

### Member

An active Member may belong to the organization but does not automatically receive access to every organization project. A non-administrator requires active project membership to access a project.

## Project Access Levels

### Project risks

Active organization Administrators and the actual assigned Project Manager may create, edit, assess, assign, transition, realize, and close active project risks. Project Members, Stakeholders, and Read Only users are read-only, including an assigned risk owner. Realized and Closed risks are terminal and no role may permanently delete a risk.

### Project issues

Active organization Administrators and the actual assigned Project Manager may create, edit, assign, transition, resolve, and cancel active project issues. Project Members, Stakeholders, and Read Only users are read-only, including an assigned issue owner. Resolved and Cancelled issues are terminal and immutable; no role may reopen or permanently delete an issue.

### Project actions

Active organization Administrators and the assigned Project Manager may create, edit, assign, transition, complete, and cancel active project actions. An active Project Member may move only an action owned by their own active project membership among Open, In Progress, and Blocked, and may complete it with meaningful completion notes. Ownership grants no planning-field, cancellation, reopening, or broader project-management permission. Stakeholder and Read Only access is read-only. Completed and Cancelled actions are terminal.

Project membership has one of four access levels:

* `Project Manager`
* `Project Member`
* `Stakeholder`
* `Read Only`

Only active project memberships grant project access. A membership with `left_at` set is inactive unless a later documented rule explicitly provides otherwise.

### Project Manager

The assigned Project Manager may view and edit project details, manage project membership, and close or cancel the project. In the first vertical slice, project creation automatically creates an active Project Manager membership for the authenticated creator and assigns that user as the project's Project Manager.

### Project Member

A Project Member may view the project. Permissions to update assigned operational records will be defined with each later feature. Project Members cannot close or cancel a project.

### Stakeholder

A Stakeholder may view the project information explicitly made available to that access level. Feature-specific approval permissions will be defined with the relevant later feature. Stakeholders cannot close or cancel a project.

### Read Only

A Read Only user may view authorized project information but cannot create, update, close, or cancel project records.

## Access Precedence

Project access is granted when either condition is true:

1. The authenticated user has an active Administrator membership in the project's organization.
2. The authenticated user has an active project membership for that project and an active membership in the parent organization.

Ordinary organization membership alone is insufficient. Organization Administrator authority takes precedence over the absence of project membership, but never crosses the organization boundary.

## First-Slice Operation Matrix

| Operation | Organization Administrator | Assigned Project Manager | Project Member | Stakeholder | Read Only |
| --- | --- | --- | --- | --- | --- |
| Create an organization during first-user onboarding | Yes | Not applicable | Not applicable | Not applicable | Not applicable |
| Create a project | Yes | Yes, as an active organization member | No | No | No |
| View an authorized project | Yes | Yes | Yes | Yes | Yes |
| Edit project details and health | Yes | Yes | No | No | No |
| Manage project membership | Yes | Yes | No | No | No |
| Close or cancel a project | Yes | Yes | No | No | No |

The project-creation permission for a Project Manager means an active organization Member who is allowed to create a project and becomes its assigned Project Manager. The first onboarding user is already an Administrator.

## First-User Bootstrap

The first authenticated user completes a simple onboarding flow that creates an organization and an active Administrator organization membership for that user. The organization and membership must be created as one authorized operation so a partial setup does not leave an unowned organization.

Invitations, delegated provisioning, and advanced organization administration are deferred.

## Enforcement Requirements

Protected operations must:

1. Require an authenticated session.
2. Resolve identity from the trusted session rather than browser-supplied user IDs.
3. Verify active organization membership.
4. Apply Administrator precedence or verify active project membership.
5. Verify the operation is allowed for the effective role or access level.
6. Verify affected records belong to the authorized organization and project.
7. Validate new and changed ownership fields.
8. Return only authorized data.

Protected tables must use Row Level Security. Select, insert, update, and delete rules must be reviewed separately. Negative tests must cover unauthenticated access, cross-organization access, non-member project access, and attempts by restricted project roles to edit, close, or cancel projects.

## Deferred Permissions

Permissions for RAID records, milestones, deliverables, actions, decisions, status reports, change requests, closure items, feature-specific approvals, and other later modules will be defined with those vertical slices. No generic comment or approval permission is introduced now.
