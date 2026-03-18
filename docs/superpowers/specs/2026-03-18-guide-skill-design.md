# Guide Skill — Interactive Concierge for Non-Tech Users

## Problem

selfapp template has 33 skills and 10 commands. Non-tech users don't know:
- Where to start when they have an idea
- Which workflow applies to their situation
- Where they are in a multi-step process
- How to resume interrupted work

## Solution

A `guide` skill that acts as an interactive router/concierge. It speaks product language (never technical terms), detects current project state, and routes users to the right workflow automatically.

## Trigger Points

1. **Session start** (proactive) — AI reads project state and suggests next action
2. **User calls `/guide`** (on-demand) — AI asks what they want to do and routes them
3. **Implicit** — skill description triggers when user says things like "mình muốn...", "bắt đầu", "tiếp tục"

## Routing Table

| User intent (examples) | Detected as | Routes to | Confirmation |
|---|---|---|---|
| "Mình có ý tưởng mới", "thêm tính năng X" | New feature | brainstorming → writing-plans → executing-plans | Ask first |
| "App bị lỗi", "không hoạt động", "trang trắng" | Bug/error | debug | Auto-run |
| "Đưa lên mạng", "mọi người dùng được" | Deploy | release | Ask first |
| "Cài đặt", "chạy app", "bắt đầu" | Setup | setup | Auto-run |
| "Thay đổi giao diện", "đẹp hơn", "đổi màu" | Frontend change | frontend-design | Ask first |
| "Tiếp tục đi", "hồi nãy làm dở" | Resume work | detect state → appropriate skill | Context-dependent |

### Confirmation Rules

- **Auto-run** (low risk): debug, setup — reversible, no external impact
- **Ask first** (high risk): new features, deploy, frontend changes — significant scope or external visibility

## State Detection (Session Start)

On session start, AI checks these signals in order:

1. **Spec files** in `docs/superpowers/specs/` — ongoing feature design → offer to continue
2. **Build/lint errors** — run `bun run check` silently → offer to fix
3. **Uncommitted changes** — `git status` → ask: continue current work or start new?
4. **Clean state** — nothing pending → greet and ask what they want to do

Output example:
- "Mình thấy bạn đang thiết kế tính năng tìm kiếm. Muốn tiếp tục không?"
- "App đang có lỗi, để mình kiểm tra nhé."
- "App đang chạy tốt. Bạn muốn làm gì tiếp?"

## Voice & Tone

Follows CLAUDE.md guidelines:
- Friendly, concise, like texting a friend
- Uses "mình" / "bạn"
- NEVER exposes skill names, agent names, or technical terms
- NEVER says: "Invoking debug skill", "Running brainstorming workflow"
- Instead: "Để mình kiểm tra nhé", "Mình sẽ giúp bạn thiết kế tính năng này"

## Cleanup: Remove speckit

Speckit (9 skills + 9 commands + `.specify/` directory) is redundant with existing skills:
- speckit-specify/clarify → brainstorming
- speckit-plan → writing-plans
- speckit-implement → executing-plans
- speckit-analyze/checklist → requesting-code-review

### Files to remove

Skills (9):
- `.claude/skills/speckit-analyze/`
- `.claude/skills/speckit-checklist/`
- `.claude/skills/speckit-clarify/`
- `.claude/skills/speckit-constitution/`
- `.claude/skills/speckit-implement/`
- `.claude/skills/speckit-plan/`
- `.claude/skills/speckit-specify/`
- `.claude/skills/speckit-tasks/`
- `.claude/skills/speckit-taskstoissues/`

Commands (9):
- `.claude/commands/speckit.analyze.md`
- `.claude/commands/speckit.checklist.md`
- `.claude/commands/speckit.clarify.md`
- `.claude/commands/speckit.constitution.md`
- `.claude/commands/speckit.implement.md`
- `.claude/commands/speckit.plan.md`
- `.claude/commands/speckit.specify.md`
- `.claude/commands/speckit.tasks.md`
- `.claude/commands/speckit.taskstoissues.md`

Directory:
- `.specify/` (templates, memory, scripts)

CLAUDE.md references:
- Remove speckit entries from "Installed Skills & Commands" section

## Implementation Scope

1. Create `.claude/skills/guide/SKILL.md`
2. Remove speckit files (listed above)
3. Update CLAUDE.md to reflect changes
