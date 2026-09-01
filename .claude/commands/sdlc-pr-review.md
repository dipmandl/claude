---
description: Run PR feedback review and decide whether implementation must loop for additional fixes
---

# SDLC PR Review

Run PR feedback review for the active SDLC workflow.

Invoke the `pr-review-agent` agent.

Run this command directly without requiring `orchestrator-agent`.

This command is also the continuation entrypoint for PR-resolution work.
Do not require `/sdlc-resume` for PR-resolution loops.

This command must always start from the `PR_REVIEW` stage.

## Preconditions

Before running, verify:

- DELIVERY has created a PR and `.sdlc/delivery-summary.md` exists.
- `.sdlc/delivery-summary.md` includes OWNER, REPO, and PR_NUMBER.
- GitHub access is available for live PR read/write review operations.

If `.sdlc/workflow-state.json` exists, update state before execution:

- `current_stage = PR_REVIEW`
- `stages.PR_REVIEW.status = IN_PROGRESS`

If `.sdlc/workflow-state.json` is missing, return:

STATUS: NO_WORKFLOW
REASON: No existing SDLC workflow was found.

If there are no existing reviewer comments yet:

- do not stop
- perform an independent first-pass PR review on current PR diff
- post inline review comments for every finding
- generate `.sdlc/pr-change-required.md` from those findings

If live PR review operations are unavailable, return:

STATUS: FAILED
REASON: Unable to access GitHub PR review APIs.

## Review Scope

The PR Review Agent should:

- Verify every actionable PR comment is addressed.
- Confirm evidence in current code and tests.
- Mark unresolved comments clearly.
- Post inline review comments directly on PR diff.
- Produce a change-required list grouped into NEEDS_CODE_CHANGE and COMMENT_ONLY_RESOLUTION.

When no prior reviewer feedback exists, treat the agent's own inline comments as
the actionable review set for resolution planning.

## Human Selection Step

If status is `CHANGES_REQUESTED`, show `.sdlc/pr-change-required.md` to the user
and ask for explicit handling in this exact format:

- `resolve-with-dev: PR-COMMENT-001,PR-COMMENT-004`
- `resolve-comments-only: PR-COMMENT-002,PR-COMMENT-003`

Then save the selection to `.sdlc/pr-resolution-plan.md` and stop with:

STATUS: WAITING_FOR_RESOLUTION_SELECTION

To continue, run `/sdlc-pr-review` again with the selected IDs in the
arguments, for example:

- `resolve-with-dev: PR-COMMENT-001,PR-COMMENT-004`
- `resolve-comments-only: PR-COMMENT-002,PR-COMMENT-003`

On continuation runs, this command must:

- read `.sdlc/pr-resolution-plan.md` (or parse provided selection lines)
- if `resolve-with-dev` has IDs:
	- invoke `implementation`
	- then `tests`
	- then `code-review-agent`
	- then `delivery`
	- then `pr-review-agent`
- if only `resolve-comments-only` IDs are present:
	- invoke `pr-review-agent` directly to post resolution replies and resolve
		comment-only threads

After continuation processing, return status and next required action.

If `resolve-with-dev` has one or more IDs, perform implementation pipeline in
this command.
If only `resolve-comments-only` IDs are selected, perform PR-only resolution in
this command.

## Routing

- If PR review result is `APPROVED`:
	- set `stages.PR_REVIEW.status = COMPLETED`
	- set `stages.PR_REVIEW.artifact = .sdlc/pr-review-report.md`
	- keep workflow ready for final delivery closure

- If PR review result is `CHANGES_REQUESTED`:
	- set `stages.PR_REVIEW.status = FAILED`
	- set failure reason from unresolved comments
	- next `/sdlc-pr-review` continuation must follow `.sdlc/pr-resolution-plan.md`

## Output

Create:

.sdlc/pr-review-report.md
.sdlc/pr-change-required.md

Return:

STATUS: APPROVED

or:

STATUS: CHANGES_REQUESTED

If status is CHANGES_REQUESTED, continue using `/sdlc-pr-review` with
selection-based routing.
