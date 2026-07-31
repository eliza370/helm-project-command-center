---

name: dashboard-feature-builder
description: Build or modify a complete end-to-end feature in Helm. Use when implementing pages, forms, tables, dashboard modules, or workflows that require coordinated interface, data, validation, authorization, and testing changes. Do not use for isolated styling changes, minor text edits, or product brainstorming.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Helm Dashboard Feature Builder

## Purpose

Build Helm features as small, complete vertical slices.

A vertical slice should deliver a usable outcome through the interface, application logic, data layer, permissions, and tests.

Do not create disconnected mock interfaces that cannot save, retrieve, validate, or protect real data.

## Required Reading

Before implementation, read:

* `AGENTS.md`
* `docs/product-brief.md`
* `docs/mvp-scope.md`
* `docs/domain-model.md`
* The skill files relevant to the requested feature
* Existing code related to the feature

## Core Principle

Implement the smallest complete version of the requested user outcome.

A complete feature normally includes:

* Data structure
* Database migration
* Server-side access
* Authorization
* Validation
* User interface
* Loading state
* Empty state
* Success feedback
* Error handling
* Automated tests
* Documentation updates where necessary

## Required Inputs

Identify these before beginning:

* User outcome
* Primary user role
* User story
* Acceptance criteria
* Relevant domain entities
* Required permissions
* Existing implementation constraints
* Explicitly excluded behavior

If an input is not supplied, infer the smallest reasonable version from the existing documentation and state the assumption.

## Feature Workflow

### 1. Read and Inspect

Read all required project documentation.

Inspect:

* Related routes
* Related components
* Existing database tables
* Existing migrations
* Existing TypeScript types
* Existing validation schemas
* Existing tests
* Existing authorization patterns

Do not assume a file or pattern does not exist without checking.

### 2. Define the User Outcome

Express the requested outcome in one sentence.

Example:

> A project manager can create a project and immediately view its project overview.

The outcome should describe what the user can accomplish, not what files will be created.

### 3. Define Acceptance Criteria

Write clear, testable acceptance criteria.

Acceptance criteria should cover:

* Successful workflow
* Required fields
* Validation
* Permissions
* Empty state
* Loading state
* Error state
* Responsive behavior where relevant

Avoid vague criteria such as “looks professional” without defining observable behavior.

### 4. Confirm the Domain Model

Identify:

* Entity or entities involved
* Required fields
* Optional fields
* Statuses
* Ownership
* Relationships
* Calculated fields
* Audit requirements

Use the `pm-domain-modeling` skill when project-management concepts are involved.

Do not create duplicate entities when an existing entity already serves the purpose.

### 5. Design the Data Change

For database-backed features:

* Create a version-controlled migration.
* Use clear table and column names.
* Define primary keys and foreign keys.
* Define required and optional fields deliberately.
* Add useful constraints.
* Add indexes where justified.
* Define delete behavior.
* Enable Row Level Security for protected tables.
* Add appropriate access policies.
* Preserve existing data during schema changes.

Do not manually change a production database without a corresponding migration.

### 6. Define Authorization

Identify who can:

* Create the record
* View the record
* Update the record
* Change its status
* Delete or archive the record

Enforce authorization in the database or server-side application logic.

Do not rely only on hiding buttons in the interface.

Test at least one unauthorized case for protected workflows.

### 7. Define Validation

Validate all user-controlled input.

Validation should include, where relevant:

* Required values
* Maximum lengths
* Valid dates
* Date relationships
* Allowed status values
* Numeric ranges
* Valid identifiers
* Organization and project relationships

Use a shared validation schema where both client and server need the same rules.

Never trust client-side validation alone.

### 8. Build the Interface

Use existing Helm components and design conventions.

The interface must:

* Use clear labels
* Use professional project-management terminology
* Show required fields clearly
* Preserve entered information after recoverable errors
* Give meaningful success feedback
* Show actionable error messages
* Work at desktop and smaller screen widths
* Support keyboard navigation
* Avoid using color as the only status indicator

Do not introduce unnecessary nautical labels.

### 9. Handle Application States

Every data-driven feature should deliberately handle:

#### Loading

Show that Helm is retrieving or saving information.

Avoid unexplained blank screens.

#### Empty

Explain why no records are present and provide the appropriate next action.

#### Success

Confirm that the requested action completed.

Update the visible interface without requiring unnecessary manual refreshes.

#### Error

Explain what failed in understandable language.

Preserve safe user input when possible.

Do not expose database details, stack traces, credentials, or internal implementation information.

#### Unauthorized

Show an appropriate access-denied response without exposing protected information.

### 10. Add Automated Tests

Add the smallest meaningful set of tests needed to protect the feature.

Tests should normally include:

* Successful primary workflow
* Required-field validation
* Important business rule
* Authorized access
* Unauthorized access
* Critical status or date behavior where relevant

Use end-to-end tests for important user workflows.

Do not claim a test passed unless it was run.

### 11. Run Quality Checks

Run the project’s available checks, including where configured:

```text
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Only run commands that exist in the project.

If a command does not exist, state that instead of inventing a successful result.

Fix failures caused by the feature before describing it as complete.

### 12. Review Scope

Before completion, confirm that:

* The acceptance criteria are met.
* No excluded MVP features were added.
* No unrelated functionality was changed.
* No temporary credentials or debugging code remain.
* No placeholder behavior is presented as complete.
* Authorization is enforced.
* Documentation matches accepted domain changes.

## Component Design Rules

Create a reusable component when:

* The same behavior appears in more than one place.
* The component represents a stable Helm design pattern.
* Reuse improves consistency or testability.

Do not create a generic abstraction for behavior used only once unless it meaningfully simplifies the code.

Prefer readable, focused components over large page files.

## Forms

Forms should:

* Use explicit labels
* Identify required fields
* Use appropriate input types
* Show field-level validation
* Prevent accidental duplicate submissions
* Show saving progress
* Preserve input after recoverable failures
* Redirect or update the interface after success
* Support keyboard completion

Do not silently discard user-entered data.

## Tables and Registers

Tables should support the user’s decision-making.

Where relevant, include:

* Clear column labels
* Sorting
* Filtering
* Status indicators
* Ownership
* Due dates
* Overdue indicators
* Empty-state guidance
* Accessible row actions

Avoid overcrowding tables with every available database field.

Use detail views or expandable content for secondary information.

## Dashboard Metrics

Dashboard metrics should:

* Have an identifiable source
* Use consistent definitions
* Link to the underlying records where practical
* Avoid double-counting
* Distinguish current state from historical trends
* Avoid presenting estimates as confirmed facts

Do not hard-code metrics that should come from project data.

## Performance

Avoid unnecessary data retrieval.

* Request only required fields where practical.
* Paginate large registers.
* Avoid repeated identical queries.
* Use server rendering appropriately.
* Do not expose sensitive data in browser payloads.
* Add indexes only when justified by actual query patterns.

Do not prematurely optimize a feature that does not yet work correctly.

## Accessibility

At minimum:

* Use semantic HTML.
* Associate labels with inputs.
* Provide visible keyboard focus.
* Support keyboard interaction.
* Give controls meaningful accessible names.
* Ensure status is understandable without color alone.
* Use headings in a logical order.
* Announce important form errors where practical.

## Completion Report

After implementation, report:

### User Outcome

What the user can now accomplish.

### Acceptance Criteria

Which criteria were completed.

### Files Changed

Files created, modified, or removed.

### Database Changes

Tables, columns, constraints, indexes, or migrations.

### Authorization Changes

Policies, permission checks, or access rules.

### Tests

Tests added or updated.

### Commands Run

The exact quality-check commands that were executed.

### Results

Passes, failures, and unresolved warnings.

### Known Limitations

Anything deliberately excluded or incomplete.

### Recommended Next Step

The next smallest vertical slice that logically follows.
