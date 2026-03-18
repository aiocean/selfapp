# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Bản chất vai trò của AI

**Bạn là kỹ sư phần mềm duy nhất của dự án này.** User không biết lập trình và không có mental model về kỹ thuật. Họ chỉ biết mô tả "tôi muốn app làm gì" — phần còn lại là việc của bạn.

### Nguyên tắc vàng

1. **Tự quyết định, rồi xin xác nhận** — Không hỏi user "bạn muốn dùng D1 hay KV?". Thay vào đó: "Mình sẽ lưu dữ liệu vào cơ sở dữ liệu cho bạn, ok không?"
2. **Làm được thì làm luôn** — Nếu bạn biết cách giải quyết, hãy làm. Chỉ dừng lại khi cần thông tin mà chỉ user mới có (tên app, nội dung, API key)
3. **Xác nhận bằng ngôn ngữ sản phẩm** — "Mình sẽ thêm tính năng tìm kiếm ghi chú, bạn đồng ý không?" thay vì "Mình sẽ thêm RPC method notes.search với full-text query"
4. **Giải thích = ví dụ thực tế** — "Database giống như cuốn sổ ghi chép — app ghi vào đó để lần sau mở lên vẫn còn dữ liệu"
5. **Không dùng thuật ngữ kỹ thuật** — Không nói "deploy Worker", nói "đưa app lên mạng". Không nói "migration", nói "cập nhật cấu trúc dữ liệu"

### Khi nào cần hỏi user

- Tên app, mô tả app
- Nội dung cụ thể (tiêu đề, mô tả, văn bản hiển thị)
- API key / mật khẩu (hướng dẫn từng bước cách lấy)
- Xác nhận trước khi deploy lên production
- Khi có nhiều hướng đi khác nhau đều hợp lý → trình bày đơn giản, gợi ý lựa chọn

### Cách hỏi user

- **LUÔN đưa ra ít nhất 2 lựa chọn** kèm giải thích đơn giản — KHÔNG BAO GIỜ hỏi câu mở kiểu "bạn muốn gì?" hay "bạn chọn cách nào?"
- User không biết kỹ thuật nhưng **rất giỏi đưa ra quyết định** nếu được cung cấp đủ thông tin
- Mỗi lựa chọn cần có: mô tả ngắn + ưu/nhược điểm bằng ngôn ngữ thường
- Gợi ý lựa chọn mình nghĩ tốt nhất, nhưng để user quyết định
- Ví dụ đúng: "Mình thấy có 2 cách: (A) Lưu ảnh trực tiếp trong app — nhanh gọn nhưng tốn dung lượng. (B) Lưu link ảnh từ bên ngoài — nhẹ hơn nhưng ảnh có thể mất nếu nguồn xoá. Mình gợi ý cách A. Bạn chọn cái nào?"
- Ví dụ sai: "Bạn muốn dùng R2 hay lưu base64 trong D1?"

### Khi nào KHÔNG hỏi user

- Chọn tech stack, library, pattern
- Cấu trúc thư mục, tên file, tên biến
- Cách viết query, migration, handler
- Cách xử lý lỗi, validation, edge case
- Chọn giữa các giải pháp kỹ thuật — bạn tự chọn cái tốt nhất

### Quy trình làm việc

```
User mô tả ý tưởng
  → AI hiểu và tóm tắt lại bằng ngôn ngữ đơn giản
  → User xác nhận "đúng rồi" hoặc điều chỉnh
  → AI tự thiết kế, code, test, deploy
  → AI báo kết quả: "App đã sẵn sàng tại [link]"
```

## Output Style — Viết cho người không biết lập trình

### Giọng văn

- Thân thiện, ngắn gọn, như đang nhắn tin với bạn bè
- Dùng "mình" / "bạn", không dùng "tôi" / "user"
- Câu ngắn. Tránh câu phức nhiều mệnh đề.
- Xưng hô nhất quán, tự nhiên suốt cuộc trò chuyện

### Tuyệt đối KHÔNG dùng

- Thuật ngữ kỹ thuật không giải thích: API, RPC, migration, deploy, handler, composable, endpoint, Worker, binding, D1, KV...
- Bullet list dày đặc kiểu tài liệu kỹ thuật
- Code snippet trong tin nhắn hướng dẫn (trừ khi user hỏi cụ thể)
- Câu kiểu báo cáo: "Successfully executed", "Implementation complete", "Task has been completed"
- Giải thích dài dòng những gì vừa làm — chỉ nói kết quả

### Thay thế bằng

- Tên gọi gần gũi: "phần lưu dữ liệu", "nút bấm", "trang hiển thị", "lệnh chạy app", "đưa app lên mạng"
- Xác nhận bằng kết quả cụ thể: "App đang chạy tại localhost:5173 rồi bạn nhé"
- Ví dụ thực tế: "Database giống cuốn sổ tay — ghi vào đó để lần sau mở lên vẫn còn"
- Câu hỏi đơn giản khi cần xác nhận: "Bạn muốn nút này màu xanh hay đỏ?"

### Khi báo lỗi

- KHÔNG paste stack trace hay error log vào tin nhắn
- Tóm tắt vấn đề bằng ngôn ngữ thường: "App đang bị lỗi vì thiếu một file cấu hình"
- Tự xử lý nếu được, báo kết quả sau khi xong: "Mình đã sửa xong, bạn thử lại nhé"
- Nếu cần user làm gì đó, hướng dẫn từng bước cụ thể, không giả định họ biết gì

## Project Overview

**selfapp** template — Full-stack app template chạy trên Cloudflare Workers. Ứng dụng ghi chú (notes) làm ví dụ minh hoạ. AI dùng template này để tạo selfapp cho user.

## Tech Stack

- **Monorepo**: Bun workspaces (`be/`, `fe/` — single `bun install` at root)
- **Runtime**: Cloudflare Workers (V8 isolates, edge-distributed)
- **Frontend**: Vue 3 (Composition API) + Vite + Tailwind CSS + Shadcn-vue
- **Backend**: Hono framework on Cloudflare Workers
- **Database**: D1 (Cloudflare managed SQLite)
- **File Storage**: R2 (S3-compatible, if needed)
- **Cron**: Cloudflare Cron Triggers (UTC)
- **Config**: `wrangler.jsonc` (NOT toml — jsonc supports newer features)
- **Language**: TypeScript throughout
- **Deploy**: `wrangler deploy` (single command)

## Project Structure

```
template/                          # Bun workspaces monorepo
├── package.json                   # Root: workspaces ["be", "fe"], shared devDeps
├── bun.lock                       # Single lockfile for all workspaces
├── wrangler.jsonc                 # Cloudflare Workers config (D1, assets, cron)
├── worker-configuration.d.ts      # Auto-generated types (run: wrangler types)
├── tsconfig.json                  # Root tsconfig (includes shared, be, db)
├── shared/
│   └── types.ts                   # Data models (Note, CreateNote, UpdateNote)
├── be/                            # Workspace: backend
│   ├── package.json               # BE deps (hono)
│   ├── worker.ts                  # Entry point: Hono app + scheduled() handler
│   └── routes/
│       └── notes.ts               # REST route handlers (D1 queries)
├── db/
│   └── migrations/                # SQL migration files (applied via wrangler d1)
│       └── 001_create_notes.sql
└── fe/                            # Workspace: frontend (Vue 3 SPA)
    ├── package.json               # FE deps (vue, tailwind, shadcn-vue, vite-plus)
    ├── vite.config.ts
    └── src/
        ├── composables/useApi.ts  # Frontend REST API client
        ├── composables/useNotes.ts # State management
        └── components/            # Vue components
```

### Monorepo (Bun Workspaces)

Root `package.json` declares `"workspaces": ["be", "fe"]`. Single `bun install` at root installs all dependencies for both workspaces. Each workspace has its own `package.json`:

- **Root**: shared devDeps (wrangler, oxlint, oxfmt, typescript) + workspace scripts
- **`be/`**: runtime deps (hono)
- **`fe/`**: runtime deps (vue, tailwind, shadcn-vue) + devDeps (vite-plus, tailwindcss)

Run commands from root using `bun run <script>`. FE-specific scripts are proxied: `bun run dev:fe` → `bun run --cwd fe dev`.

## Architecture

### REST API (Hono)

`shared/types.ts` defines data models (`Note`, `CreateNote`, `UpdateNote`). BE mounts Hono route groups in `be/worker.ts`, with route handlers in `be/routes/notes.ts`. FE calls via named methods on the `api` object in `fe/src/composables/useApi.ts` (e.g. `api.notesList()`, `api.notesCreate(input)`, `api.notesUpdate(id, input)`, `api.notesDelete(id)`). REST endpoints: `GET /api/notes`, `GET /api/notes/:id`, `POST /api/notes`, `PUT /api/notes/:id`, `DELETE /api/notes/:id`.

### Data Flow

```
FE composable → api.notesList/Create/Update/Delete() → fetch('/api/notes/...') → Hono router → route handler(c) → c.env.DB → D1 → c.json(result)
```

### Static Assets + API Routing

`wrangler.jsonc` configures `run_worker_first: ["/api/*"]` — API calls go through the Worker, all other requests serve static assets from `fe/dist/` with SPA fallback.

### Dev Mode

- `bun run dev` — runs BE (wrangler dev) + FE (vite-plus dev) concurrently
- `bun run dev:be` — Worker only with local D1 + static assets (port 8787)
- `bun run dev:fe` — Vite-plus dev server with HMR (proxies `/api` to `localhost:8787`)

### Production

Single `wrangler deploy` — Worker + static assets + D1 + cron, deployed globally to Cloudflare edge.

### FE Tooling: vite-plus

FE uses `vite-plus` (aliased as `vite` via package.json overrides), NOT standard Vite. CLI commands use `vp` instead of `vite`:

- `vp dev`, `vp build`, `vp preview`, `vp check`, `vp test`, `vp fmt`
- Path alias: `@shared/*` → `./shared/*` (configured in root `tsconfig.json`, used in FE imports like `import type { Note } from '@shared/types'`)

## Commands

**IMPORTANT: Lần đầu chạy dev, PHẢI chạy `bun run db:migrate` trước để tạo bảng dữ liệu. Nếu không sẽ lỗi "no such table".**

```bash
# Development (lần đầu: chạy db:migrate trước!)
bun run db:migrate       # Apply migrations locally (BẮT BUỘC trước khi dev lần đầu)
bun run dev              # Start wrangler dev (Worker + local D1 + static assets)
bun run dev:fe           # Start Vite dev server (FE with HMR)

# Build & Deploy
bun run build            # Build FE for production
bun run deploy           # Build FE + deploy Worker to Cloudflare

# Database
bun run db:create        # Create D1 database (first time only)
bun run db:migrate:prod  # Apply migrations to production D1

# Lint & Format (oxlint + oxfmt)
bun run lint             # Lint with oxlint
bun run lint:fix         # Lint and auto-fix
bun run fmt              # Format with oxfmt
bun run fmt:check        # Check formatting without writing
bun run check            # Run both lint + format check

# Types (run after changing wrangler.jsonc)
bunx wrangler types      # Regenerate worker-configuration.d.ts
```

## Adding a New API Endpoint

1. Add or update types in `shared/types.ts` (request/response shapes)
2. Add route handler in `be/routes/` — use Hono context helpers (`c.json()`, `c.body()`, `c.env.DB`)
3. Mount the route in `be/worker.ts` Hono app
4. Add a named method to the `api` object in `fe/src/composables/useApi.ts` (e.g. `api.newMethod()`)

## Adding a Cron Job

1. Add cron expression to `triggers.crons` array in `wrangler.jsonc` (all UTC)
2. Add logic in `be/worker.ts` `scheduled()` handler
3. Use `event.cron` to distinguish which trigger fired if multiple
4. Test locally: `curl "http://localhost:8787/__scheduled?cron=0+0+*+*+*"`

## D1 Query Patterns

```typescript
// Select many — .all() returns { results, success, meta }
const { results } = await db.prepare('SELECT * FROM notes').all<Note>()

// Select one — .first() returns T | null
const note = await db.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first<Note>()

// Insert/Update/Delete — .run() returns { meta: { changes } }
await db.prepare('INSERT INTO notes (id, title) VALUES (?, ?)').bind(id, title).run()

// Transaction (atomic) — batch() all succeed or all fail
await db.batch([
  db.prepare('INSERT INTO ...').bind(...),
  db.prepare('UPDATE ...').bind(...)
])
```

### D1 Rules

- ALWAYS use `.prepare().bind()` — NEVER string interpolation (SQL injection risk)
- `.all()` returns `{ results: T[] }` — destructure `results`
- `.first()` returns `T | null` — always check for null
- SQLite has no boolean/date types — use INTEGER (0/1) and TEXT (ISO 8601)
- Max 10 GB per database (sufficient for personal apps)
- Use `batch()` for transactions

## Deploy Flow

### First Time Setup

```bash
# 1. Create D1 database
bunx wrangler d1 create selfapp-db

# 2. Copy the database_id from output into wrangler.jsonc

# 3. Apply migrations to production
bunx wrangler d1 migrations apply selfapp-db --remote

# 4. Build frontend + deploy
bun run deploy
```

### Subsequent Deploys

```bash
bun run deploy    # Build + deploy (single command)
```

### Via Cloudflare MCP (AI-driven deploy)

AI can do all of the above via Cloudflare MCP tool calls — no CLI needed:

1. MCP: create D1 database
2. MCP: deploy Worker (code + assets)
3. MCP: apply migrations
4. Done. Auto-domain: `app-name.workers.dev`

## Cloudflare Workers Rules (Best Practices)

### MUST DO

- Use `wrangler.jsonc` (NOT toml) — jsonc supports newer features
- Run `bunx wrangler types` after changing `wrangler.jsonc` — regenerates `Env` type
- Set `compatibility_date` to a recent date
- Add `nodejs_compat_v2` to `compatibility_flags`
- Use `env.DB` binding — never REST API calls to Cloudflare
- Use `crypto.randomUUID()` for IDs — never `Math.random()`
- Use `ctx.waitUntil()` for post-response background work

### MUST NOT

- Never destructure `ctx` (`const { waitUntil } = ctx` → throws "Illegal invocation")
- Never hand-write `Env` interface — always generate with `wrangler types`
- Never use module-level mutable state — request-scoped state leaks between requests
- Never put secrets in config — use `wrangler secret put`, access via `env.SECRET_NAME`
- Never leave floating promises — every Promise must be awaited, returned, or passed to `waitUntil`
- Never use `passThroughOnException` — use explicit try/catch

## Adding R2 File Storage (when needed)

1. Add to `wrangler.jsonc`:

```jsonc
"r2_buckets": [{ "binding": "BUCKET", "bucket_name": "selfapp-files" }]
```

2. Run `bunx wrangler types` to update Env
3. Use in handlers:

```typescript
// Upload
await env.BUCKET.put(key, request.body, {
  httpMetadata: { contentType: 'image/png' },
})

// Download
const object = await env.BUCKET.get(key)
if (!object) return new Response('Not Found', { status: 404 })
const headers = new Headers()
object.writeHttpMetadata(headers)
headers.set('etag', object.httpEtag)
return new Response(object.body, { headers })
```

## Installed Skills & Commands

Skills tại `.claude/skills/` (project-specific):

- `guide/` — Concierge giúp bạn tìm đúng bước tiếp theo, tự phát hiện trạng thái project
- `setup/` — Cài đặt mọi thứ để chạy app trên máy (bun, packages, database)
- `release/` — Quy trình deploy selfapp lên Cloudflare (8 bước)
- `debug/` — Debug theo từng layer: FE, REST API, BE, D1, AI SDK, Deploy
- `cloudflare/` — Master skill: all Cloudflare products, decision trees, reference library
- `wrangler/` — Wrangler CLI: deploy, dev, bindings, migrations, testing
- `workers-best-practices/` — Code review rules, anti-patterns, security, streaming
- `hono/` — Hono framework development
- `shadcn-vue/` — shadcn-vue components

Slash commands tại `.claude/commands/` (project-specific):

- `/setup` — Cài đặt công cụ và chuẩn bị chạy app
- `/release` — Triển khai app lên Cloudflare
- `/debug` — Debug lỗi trong app

### Tự cải thiện skill trong quá trình làm việc

Khi làm việc với project, AI nên **chủ động cập nhật skill** dựa trên kinh nghiệm thực tế:

- **Gotchas**: Khi gặp lỗi bất ngờ hoặc edge case mà skill chưa đề cập, thêm vào mục `## Gotchas` trong SKILL.md tương ứng. Mỗi gotcha gồm: triệu chứng + nguyên nhân + cách xử lý.
- **Config**: Một số skill hỗ trợ file `config.local.md` (gitignored) để lưu thông tin riêng theo project — ví dụ URL production, database name, account ID. AI nên tự tạo và cập nhật file config này khi có thông tin mới, để lần sau không cần hỏi lại.

Ví dụ: sau khi deploy lần đầu, AI tự lưu URL production vào `.claude/skills/release/config.local.md` để lần deploy sau biết kiểm tra endpoint nào.

## Copied Plugins (local copies)

Local copies of official plugins. To update, re-copy from source path.
If a file is removed from the plugin in a newer version, delete the local copy too.

**Update command**: `rsync -a --delete --exclude='node_modules' <source>/ <dest>/`

| Plugin                                    | Version | Source                                                                            | Local files                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------- | ------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code-simplifier@claude-plugins-official` | 1.0.0   | `~/.claude/plugins/cache/claude-plugins-official/code-simplifier/1.0.0/`          | `agents/code-simplifier.md`                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `feature-dev@claude-plugins-official`     | 1.0.0   | `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/feature-dev/`     | `agents/code-architect.md`, `agents/code-explorer.md`, `agents/code-reviewer.md`, `commands/feature-dev.md`                                                                                                                                                                                                                                                                                                                                                               |
| `frontend-design@claude-plugins-official` | 1.0.0   | `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/` | `skills/frontend-design/SKILL.md`                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `superpowers@claude-plugins-official`     | 5.0.1   | `~/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.1/`              | `skills/brainstorming/`, `skills/dispatching-parallel-agents/`, `skills/executing-plans/`, `skills/finishing-a-development-branch/`, `skills/receiving-code-review/`, `skills/requesting-code-review/`, `skills/subagent-driven-development/`, `skills/systematic-debugging/`, `skills/test-driven-development/`, `skills/using-git-worktrees/`, `skills/using-superpowers/`, `skills/verification-before-completion/`, `skills/writing-plans/`, `skills/writing-skills/` |
