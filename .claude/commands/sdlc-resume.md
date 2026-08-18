---
description: Resume an existing SDLC workflow from the last incomplete or failed stage
---

# SDLC Resume

Resume the existing SDLC workflow.

## Instructions

Run resume directly without using `orchestrator-agent`.

The workflow runner MUST:

1. Check whether `.sdlc/workflow-state.json` exists.
2. If missing, do not create a new workflow and return:
   STATUS: NO_WORKFLOW
   REASON: No existing SDLC workflow was found.
3. If present, read state and resume from the first stage marked FAILED, IN_PROGRESS, or NOT_STARTED.
4. Do not rerun COMPLETED stages unless later-stage failure requires rework.
5. Resume from IMPLEMENTATION when failure cause is implementation defect, TESTING implementation defect, or CODE_REVIEW CHANGES_REQUESTED.
6. If workflow is COMPLETED, return STATUS: ALREADY_COMPLETED.
7. If workflow is BLOCKED, return STATUS: BLOCKED with reason and do not continue automatically.
8. Persist state after each stage transition.
9. Execute only one stage per resume invocation, then stop and return STATUS: WAITING_FOR_HUMAN_APPROVAL.

## Stage agent mapping

- REQUIREMENT -> `requirement-agent`
- PLANNING -> `planning`
- DESIGN -> `design-agent`
- IMPLEMENTATION -> `implementation`
- TESTING -> `tests`
- CODE_REVIEW -> `code-review-agent`
- DELIVERY -> `delivery`

## Important

The command must:

- read state
- determine the resume stage
- handle retry counts
- invoke the correct stage agent
- update state
- stop after one stage and wait for explicit human approval