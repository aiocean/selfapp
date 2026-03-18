# Guide Skill Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an interactive concierge skill that helps non-tech users navigate the selfapp workflow, and remove redundant speckit ecosystem.

**Architecture:** Single SKILL.md file with routing table, state detection logic, and voice guidelines. Cleanup removes 9 speckit skills, 9 commands, `.specify/` directory, and CLAUDE.md references.

**Tech Stack:** Markdown (skill definition), bash (file cleanup)

---

## Chunk 1: Create guide skill + cleanup speckit

### Task 1: Create guide skill

**Files:**

- Create: `.claude/skills/guide/SKILL.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p .claude/skills/guide
```

- [ ] **Step 2: Write SKILL.md**

Create `.claude/skills/guide/SKILL.md` with:
- Skill frontmatter: name `guide`, description targeting non-tech trigger phrases ("mình muốn", "bắt đầu", "tiếp tục", "app bị lỗi", "đưa lên mạng", "thay đổi giao diện")
- Session start behavior: state detection from files (specs, git status, build errors)
- Routing table: 6 intents mapped to skills (brainstorming, debug, release, setup, frontend-design, resume)
- Confirmation rules: auto-run for debug/setup, ask-first for features/deploy/frontend
- Voice rules: Vietnamese product language, never expose skill/agent names
- Full content specified in spec at `docs/superpowers/specs/2026-03-18-guide-skill-design.md`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/guide/SKILL.md
git commit -m "feat: add guide skill — interactive concierge for non-tech users"
```

### Task 2: Remove speckit skills

**Files:**

- Delete: `.claude/skills/speckit-analyze/`
- Delete: `.claude/skills/speckit-checklist/`
- Delete: `.claude/skills/speckit-clarify/`
- Delete: `.claude/skills/speckit-constitution/`
- Delete: `.claude/skills/speckit-implement/`
- Delete: `.claude/skills/speckit-plan/`
- Delete: `.claude/skills/speckit-specify/`
- Delete: `.claude/skills/speckit-tasks/`
- Delete: `.claude/skills/speckit-taskstoissues/`

- [ ] **Step 1: Remove all speckit skill directories**

```bash
rm -rf .claude/skills/speckit-analyze .claude/skills/speckit-checklist .claude/skills/speckit-clarify .claude/skills/speckit-constitution .claude/skills/speckit-implement .claude/skills/speckit-plan .claude/skills/speckit-specify .claude/skills/speckit-tasks .claude/skills/speckit-taskstoissues
```

- [ ] **Step 2: Verify removal**

```bash
ls .claude/skills/ | grep speckit
```

Expected: no output (all removed)

- [ ] **Step 3: Commit**

```bash
git add -A .claude/skills/speckit-*
git commit -m "chore: remove speckit skills — redundant with brainstorming + writing-plans + executing-plans"
```

### Task 3: Remove speckit commands

**Files:**

- Delete: `.claude/commands/speckit.analyze.md`
- Delete: `.claude/commands/speckit.checklist.md`
- Delete: `.claude/commands/speckit.clarify.md`
- Delete: `.claude/commands/speckit.constitution.md`
- Delete: `.claude/commands/speckit.implement.md`
- Delete: `.claude/commands/speckit.plan.md`
- Delete: `.claude/commands/speckit.specify.md`
- Delete: `.claude/commands/speckit.tasks.md`
- Delete: `.claude/commands/speckit.taskstoissues.md`

- [ ] **Step 1: Remove all speckit command files**

```bash
rm -f .claude/commands/speckit.*.md
```

- [ ] **Step 2: Verify removal**

```bash
ls .claude/commands/ | grep speckit
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add -A .claude/commands/speckit.*
git commit -m "chore: remove speckit commands"
```

### Task 4: Remove .specify directory

**Files:**

- Delete: `.specify/`

- [ ] **Step 1: Remove .specify directory**

```bash
rm -rf .specify
```

- [ ] **Step 2: Commit**

```bash
git add -A .specify/
git commit -m "chore: remove .specify directory — speckit fully removed"
```

### Task 5: Update CLAUDE.md

**Files:**

- Modify: `CLAUDE.md`

- [ ] **Step 1: Update Installed Skills & Commands section**

In CLAUDE.md, update the skills list:
- Remove all speckit entries from the skills list
- Remove `/speckit.*` from the commands list
- Add `guide/` skill entry: "guide/ — Concierge giúp bạn tìm đúng bước tiếp theo, tự phát hiện trạng thái project"

- [ ] **Step 2: Verify CLAUDE.md is valid**

Read the file and confirm the speckit references are gone and guide is listed.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md — add guide skill, remove speckit references"
```
