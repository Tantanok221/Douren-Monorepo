---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees in ~/c/douren-worktree/<ticket-context> with mandatory setup verification
---

# Using Git Worktrees

## Overview

Git worktrees create isolated workspaces sharing the same repository, allowing work on multiple branches simultaneously without switching.

**Core principle:** Fixed repo convention + consistent setup = reliable isolation.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Directory Convention

For this repository, always create worktrees at:

`~/c/douren-worktree/<ticket-context>`

Examples:
- `~/c/douren-worktree/pr-217-image-fallback`
- `~/c/douren-worktree/fix-douren-v2-fallback`

`<ticket-context>` should be short, lowercase, and derived from ticket/branch context.

No `.gitignore` checks are needed because this path is outside the repository.

## Creation Steps

### 1. Derive context and create path

```bash
ticket_context="<ticket-context>"
path="$HOME/c/douren-worktree/$ticket_context"
mkdir -p "$(dirname "$path")"
```

### 2. Create worktree on target branch

```bash
git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

### 3. Run Project Setup

For this repository, this is mandatory:

```bash
./setup.sh
```

### 4. Verify Clean Baseline

Run project checks to ensure worktree starts clean:

```bash
pnpm run test
```

**If tests fail:** Report failures, ask whether to proceed or investigate.

**If tests pass:** Report ready.

### 5. Report Location

```
Worktree ready at <full-path>
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## Quick Reference

| Situation | Action |
|-----------|--------|
| Starting isolated work | Create at `~/c/douren-worktree/<ticket-context>` |
| Worktree just created | Run `./setup.sh` immediately |
| Tests fail during baseline | Report failures + ask |

## Common Mistakes

### Using the wrong directory root

- **Problem:** Inconsistent worktree sprawl and hard-to-find branches
- **Fix:** Always use `~/c/douren-worktree/<ticket-context>`

### Skipping setup after creating worktree

- **Problem:** Missing deps/env causes false failures later
- **Fix:** Always run `./setup.sh` immediately after `git worktree add`

### Proceeding with failing baseline tests

- **Problem:** Can't distinguish new bugs from pre-existing issues
- **Fix:** Report failures, get explicit permission to proceed

## Example Workflow

```
You: I'm using the using-git-worktrees skill to set up an isolated workspace.

[Create worktree path: ~/c/douren-worktree/fix-douren-v2-fallback]
[Create worktree: git worktree add ~/c/douren-worktree/fix-douren-v2-fallback -b fix/douren-v2-fallback]
[Run ./setup.sh]
[Run pnpm run test - passing]

Worktree ready at /Users/<user>/c/douren-worktree/fix-douren-v2-fallback
Baseline tests passing
Ready to implement fallback changes
```

## Red Flags

**Never:**
- Create worktrees outside `~/c/douren-worktree/<ticket-context>` for this repo
- Skip `./setup.sh` after creating a new worktree
- Skip baseline test verification
- Proceed with failing tests without asking

**Always:**
- Use `~/c/douren-worktree/<ticket-context>`
- Run `./setup.sh` right after creation
- Verify clean test baseline

## Integration

**Called by:**
- **brainstorming** (Phase 4) - REQUIRED when design is approved and implementation follows
- Any skill needing isolated workspace

**Pairs with:**
- **finishing-a-development-branch** - REQUIRED for cleanup after work complete
- **executing-plans** or **subagent-driven-development** - Work happens in this worktree
