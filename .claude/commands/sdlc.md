---
description: Start or resume the SDLC workflow
argument-hint: <requirement>
---

# SDLC

User request:

$ARGUMENTS

Run SDLC directly without using `orchestrator-agent`.

## Input normalization

- If input is a Jira URL, extract the issue key (for example CS-50).
- Keep only issue key plus one-line objective.
- Do not include large pasted logs or full document content.

## State and stage selection

- Read `.sdlc/workflow-state.json` if it exists.
- If missing, initialize workflow in `.sdlc/workflow-state.json` with:
	- `workflow_status: IN_PROGRESS`
	- `current_stage: REQUIREMENT`
	- all stages initialized with status `NOT_STARTED`
- Determine next stage as the first stage in order with status `FAILED`, `IN_PROGRESS`, or `NOT_STARTED`:
	- REQUIREMENT -> PLANNING -> DESIGN -> IMPLEMENTATION -> TESTING -> CODE_REVIEW -> DELIVERY

## Single-stage execution mode

- Execute exactly one stage per invocation.
- Before stage run, mark that stage `IN_PROGRESS` and persist state.
- Invoke the corresponding agent directly:
	- REQUIREMENT -> `requirement-agent`
	- PLANNING -> `planning`
	- DESIGN -> `design-agent`
	- IMPLEMENTATION -> `implementation`
	- TESTING -> `tests`
	- CODE_REVIEW -> `code-review-agent`
	- DELIVERY -> `delivery`
- Verify expected artifact exists in `.sdlc/`.
- On success: mark stage `COMPLETED`, set reason/artifact/completed_at, and persist state.
- On failure: mark stage `FAILED`, capture reason, set artifact `null` if missing, increment retry_count, and persist state.

## Human gate

After stage completion, stop and ask for explicit review:

Review this stage before continuing.

- Type approve to proceed
- Type update: <feedback> to rerun the same stage
- Type reject to stop

Do not auto-run the next stage in the same invocation.