---
description: Deliver a validated SDLC implementation by creating a branch, committing, pushing changes, and opening a pull request
---

# SDLC Delivery

Invoke the `delivery` agent.

The delivery agent is responsible for final Git delivery.

## Preconditions

Before delivery, verify:

REQUIREMENT = COMPLETED
PLANNING = COMPLETED
DESIGN = COMPLETED
IMPLEMENTATION = COMPLETED
TESTING = COMPLETED
CODE_REVIEW = COMPLETED

If any required stage is not COMPLETED:

DO NOT deliver.

Explain which stage is blocking delivery.

## Delivery

The delivery agent should:

1. Inspect the current Git status.
2. Inspect the local diff.
3. Verify the expected implementation changes.
4. Create a feature branch.
5. Stage only relevant files.
6. Create a commit.
7. Push the branch.
8. Create a pull request from the pushed branch.
9. Generate a delivery report.

## Git Restrictions

Do not:

- force push
- overwrite unrelated changes
- commit secrets
- commit `.env` files
- commit temporary files
- commit unrelated changes

## Output

Create:

.sdlc/delivery-summary.md

Return:

STATUS: COMPLETED

BRANCH: <branch>

COMMIT: <commit>

PUSH: SUCCESS

PR: <pull-request-url-or-number>