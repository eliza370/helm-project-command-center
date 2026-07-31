---

name: quality-gate
description: Review and verify a Helm feature before it is described as complete. Use after implementation, before merging, or when asked to inspect quality, tests, accessibility, responsiveness, security, or acceptance criteria. Do not use as a substitute for implementing missing work.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Helm Quality Gate

## Purpose

Verify that a Helm feature is complete, reliable, secure, accessible, and consistent with the documented product requirements before it is described as finished.

A feature does not pass merely because the page renders.

## Required Reading

Before reviewing a feature, read:

* `AGENTS.md`
* `docs/product-brief.md`
* `docs/mvp-scope.md`
* `docs/domain-model.md`
* Relevant skill files
* The feature request
* Acceptance criteria
* Files changed
* Existing tests related to the feature

## Core Principle

Evaluate evidence, not intention.

Do not report that something works unless it was inspected or tested.

Do not report that a command passed unless it was actually run.

If a check cannot be completed, clearly mark it as unverified.

## Review Categories

The quality gate covers:

1. Product scope
2. User workflow
3. Domain accuracy
4. Data integrity
5. Authorization and security
6. Validation
7. Interface states
8. Accessibility
9. Responsive behavior
10. Automated testing
11. Code quality
12. Documentation
13. Build readiness

## 1. Product Scope Review

Confirm that:

* The feature supports Helm’s documented product vision.
* The work matches the requested user outcome.
* The acceptance criteria are clear and testable.
* The feature stays within the MVP boundaries.
* No excluded feature was added without explicit approval.
* No unrelated functionality was changed.
* The implementation is a complete vertical slice rather than a disconnected mockup.

Mark the scope review as failed when the feature introduces major unrequested functionality or leaves the primary workflow incomplete.

## 2. User Workflow Review

Test the primary workflow from beginning to end.

Confirm that the user can:

* Find the feature
* Understand what to do
* Enter or view the required information
* Submit or complete the action
* Receive clear feedback
* Return to or continue the workflow
* See persisted results where applicable

Also inspect:

* Cancelling
* Navigating back
* Refreshing the page
* Revisiting the saved record
* Recovering from a correctable error

A successful API response alone does not prove the user workflow works.

## 3. Domain Accuracy Review

Confirm that:

* Project-management terminology matches `docs/domain-model.md`.
* Risks and issues are treated as different concepts.
* Actions, milestones, deliverables, and decisions are not used interchangeably.
* Statuses are meaningful and consistent.
* Ownership is clear.
* Dates have correct meanings.
* Closed records remain available where required.
* Calculated fields come from valid source records.
* Relationships between records make sense.

Use the `pm-domain-modeling` skill for detailed domain review.

## 4. Data Integrity Review

Confirm that:

* Required fields are enforced.
* Foreign keys are defined where appropriate.
* Invalid statuses cannot be stored.
* Invalid numeric ranges are prevented.
* Date relationships are validated.
* Duplicate memberships or equivalent records are prevented where required.
* Ownership fields reference valid users or project members.
* Records cannot be assigned to unrelated projects or organizations.
* Schema changes use migrations.
* Existing data is not unnecessarily destroyed.

Review delete behavior deliberately.

## 5. Authorization and Security Review

Use the `database-security` skill for protected features.

Confirm that:

* Authentication is required where expected.
* Authorization is enforced in trusted server-side logic or the database.
* The interface is not the only security barrier.
* Row Level Security is enabled for protected tables.
* Select, insert, update, and delete permissions were reviewed separately.
* Cross-organization access is blocked.
* Cross-project access is blocked.
* Role-restricted actions are protected.
* User-controlled IDs are validated.
* Secrets are not exposed.
* Service-role credentials are not included in browser code.
* Environment files containing secrets are ignored.
* Error messages do not reveal protected implementation details.

At least one unauthorized-access test should exist for important protected workflows.

## 6. Validation Review

Confirm that validation exists on the trusted server or database layer.

Where relevant, test:

* Missing required fields
* Excessively long values
* Invalid dates
* Invalid date order
* Invalid status values
* Invalid numeric values
* Invalid IDs
* Invalid project relationships
* Duplicate submissions
* Unexpected empty values

Client-side validation improves the experience but does not replace server-side validation.

Validation messages should explain what the user needs to correct.

## 7. Application State Review

### Loading State

Confirm that the user sees meaningful feedback while:

* A page loads
* Data is fetched
* A form is submitted
* A record is updated

Avoid unexplained blank content.

### Empty State

Confirm that empty states:

* Explain why no data appears
* Avoid looking like an error
* Provide the correct next action when the user has permission
* Do not offer actions the user cannot perform

### Success State

Confirm that:

* The user receives clear confirmation
* Saved results appear in the interface
* Duplicate submission is prevented
* Navigation after success is predictable

### Error State

Confirm that:

* Errors are written in understandable language
* Safe user input is preserved where practical
* The user knows what to do next
* Internal stack traces and database messages are hidden
* Retrying is possible where appropriate

### Unauthorized State

Confirm that:

* Protected information is not displayed
* The message is clear
* The application does not reveal whether an inaccessible record exists unnecessarily

## 8. Accessibility Review

At minimum, verify:

* Semantic HTML is used.
* Heading levels are logical.
* Form fields have visible labels.
* Labels are associated with inputs.
* Required fields are identified.
* Keyboard focus is visible.
* Interactive controls work with a keyboard.
* Buttons have meaningful names.
* Links describe their destination.
* Form errors are discoverable.
* Status is not communicated through color alone.
* Icons have accessible labels when needed.
* Decorative icons are hidden from assistive technology where appropriate.
* Dialogs manage focus correctly.
* Tables use appropriate headings.
* Text contrast appears sufficient.

Do not approve accessibility based only on visual appearance.

## 9. Responsive Review

Review the feature at:

* Desktop width
* Tablet-like width
* Mobile width

Confirm that:

* Content does not overflow horizontally without reason.
* Forms remain usable.
* Tables have an intentional small-screen behavior.
* Important actions remain visible.
* Navigation remains understandable.
* Text does not overlap.
* Status indicators remain legible.
* Dialogs fit within the viewport.
* Touch targets are reasonably usable.

Do not assume Tailwind classes automatically guarantee responsive behavior.

## 10. Automated Test Review

Identify the available test commands from `package.json`.

Where configured, run relevant commands such as:

```text
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Do not run commands that do not exist.

Relevant tests should normally cover:

* Successful primary workflow
* Required-field validation
* Important business rule
* Authorized access
* Unauthorized access
* Persistence or retrieval
* Critical date or status behavior

A test that only checks that a component renders may not sufficiently protect an important workflow.

## 11. Code Quality Review

Confirm that:

* TypeScript types are meaningful.
* Avoidable `any` usage is not introduced.
* Components remain focused.
* Large files are split where it improves clarity.
* Existing components are reused where appropriate.
* Business rules are not duplicated.
* Sensitive logic is not placed in browser-only code.
* Errors are handled deliberately.
* Debug logging is removed.
* Commented-out code is removed.
* Temporary placeholders are removed or clearly documented.
* New dependencies are justified.
* Naming is clear and consistent.
* Unrelated refactoring is avoided.

Do not demand abstraction merely for abstraction’s sake.

## 12. Documentation Review

Confirm that documentation is updated when the implementation changes:

* Domain entities
* Status values
* Permissions
* Architecture
* Environment setup
* Commands
* Feature scope
* Known limitations

Documentation should describe the implemented behavior, not an aspirational future state.

## 13. Build Readiness Review

Confirm that:

* The production build succeeds.
* Required environment variables are documented.
* Missing environment variables fail safely.
* No local-only paths are hard-coded.
* No development secrets are committed.
* Database migrations are included.
* Seed or demo data is safe and clearly separated from production data.
* The application starts using documented commands.
* Critical warnings are resolved or documented.

## Severity Levels

Classify findings as:

### Blocker

The feature must not be described as complete.

Examples:

* Primary workflow does not work
* Unauthorized data access
* Exposed credentials
* Data loss
* Production build failure
* Required migration missing

### Major

The feature is materially incomplete or unreliable.

Examples:

* Missing validation
* Missing error state
* Critical workflow lacks tests
* Incorrect domain behavior
* Mobile layout unusable

### Minor

The feature works but needs improvement.

Examples:

* Inconsistent spacing
* Noncritical wording issue
* Secondary test gap
* Small documentation omission

### Observation

A useful recommendation that does not prevent acceptance.

## Quality Gate Decision

Use one of these outcomes:

### Pass

All required checks completed successfully, with no blocker or major findings.

### Conditional Pass

The feature works, but minor findings or clearly documented verification gaps remain.

### Fail

One or more blocker or major findings remain.

Do not issue a pass when required checks were skipped without a clear reason.

## Required Output

Report the quality review using this structure:

### Decision

Pass, Conditional Pass, or Fail.

### User Outcome Reviewed

The user workflow that was evaluated.

### Commands Run

List the exact commands executed.

### Test Results

Report passed, failed, skipped, or unavailable checks.

### Acceptance Criteria

Mark each criterion as met, unmet, or unverified.

### Findings

For every finding, include:

* Severity
* Area
* Description
* Evidence
* Recommended correction

### Security Review

Summarize authorization, Row Level Security, secrets, and negative-access testing.

### Accessibility and Responsiveness

Summarize what was checked and any limitations.

### Known Verification Gaps

List anything that could not be inspected or tested.

### Recommended Next Action

State the smallest action needed to reach or maintain a passing result.
