---
description: Run the Code Review Agent against the current local working tree
---

# SDLC Local Code Review

Run a local code review against the current working tree.

Invoke the `code-review-agent` agent.

## Review Source

The review MUST use the local Git working tree.

Do NOT require:

- Pull Request
- Remote branch
- GitHub
- GitLab
- Existing PR

The Code Review Agent should inspect:

git status --short

git diff

git diff --cached

git diff --name-only

## Required Context

The Code Review Agent should read, when available:

.sdlc/requirements.md
.sdlc/plan.md
.sdlc/design.md

## Review

Review:

- Correctness
- Requirements compliance
- Design compliance
- Security
- Error handling
- Maintainability
- Performance
- Test coverage
- Unintended changes

## Output

Create:

.sdlc/code-review.md

Return:

STATUS: APPROVED

or:

STATUS: CHANGES_REQUESTED

Do not modify application source code during the review.