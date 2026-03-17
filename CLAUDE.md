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

## Project Overview

**selfapp** template — Full-stack app template chạy trên Cloudflare Workers. Ứng dụng ghi chú (notes) làm ví dụ minh hoạ. AI dùng template này để tạo selfapp cho user.

## Tech Stack

- **Runtime**: Cloudflare Workers (V8 isolates, edge-distributed)
- **Frontend**: Vue 3 (Composition API) + Vite + Tailwind CSS + Shadcn-vue
- **Backend**: Cloudflare Workers fetch handler
- **Database**: D1 (Cloudflare managed SQLite)
- **File Storage**: R2 (S3-compatible, if needed)
- **Cron**: Cloudflare Cron Triggers (UTC)
- **Config**: `wrangler.jsonc` (NOT toml — jsonc supports newer features)
- **Language**: TypeScript throughout
- **Deploy**: `wrangler deploy` (single command)

## Project Structure

```
template/
├── wrangler.jsonc              # Cloudflare Workers config (D1, assets, cron)
├── worker-configuration.d.ts   # Auto-generated types (run: wrangler types)
├── package.json
├── tsconfig.json
├── shared/
│   └── types.ts                # Data models + API contract (RpcMap)
├── be/
│   ├── worker.ts               # Entry point: fetch() + scheduled() handlers
│   ├── router.ts               # RPC handler registry + dispatcher
│   └── handlers/
│       └── notes.ts            # RPC handler implementations (D1 queries)
├── db/
│   └── migrations/             # SQL migration files (applied via wrangler d1)
│       └── 001_create_notes.sql
└── fe/                         # Vue 3 SPA (served via Workers Static Assets)
    ├── src/
    │   ├── composables/useRpc.ts   # Frontend RPC client
    │   ├── composables/useNotes.ts # State management
    │   └── components/             # Vue components
    ├── vite.config.ts
    └── package.json
```

## Architecture

### RPC System (type-safe FE ↔ BE)

`shared/types.ts` defines data models and the API contract (`RpcMap`). BE registers handlers via `rpc()` in `be/router.ts`. FE calls via `rpc()` in `fe/src/composables/useRpc.ts`. Single endpoint: `POST /api/rpc` with `{ method, input }`.

### Data Flow

```
FE composable → fetch('/api/rpc') → Worker fetch handler → router → handler(input, db) → D1 → response
```

### Static Assets + API Routing

`wrangler.jsonc` configures `run_worker_first: ["/api/*"]` — API calls go through the Worker, all other requests serve static assets from `fe/dist/` with SPA fallback.

### Dev Mode

- `wrangler dev` — runs Worker locally with local D1 + static assets
- `bun run dev:fe` — Vite dev server with HMR, proxies `/api` to `localhost:8787`

### Production

Single `wrangler deploy` — Worker + static assets + D1 + cron, deployed globally to Cloudflare edge.

## Commands

```bash
# Development
bun run dev              # Start wrangler dev (Worker + local D1 + static assets)
bun run dev:fe           # Start Vite dev server (FE with HMR)

# Build & Deploy
bun run build            # Build FE for production
bun run deploy           # Build FE + deploy Worker to Cloudflare

# Database
bun run db:create        # Create D1 database (first time only)
bun run db:migrate       # Apply migrations locally
bun run db:migrate:prod  # Apply migrations to production D1

# Types (run after changing wrangler.jsonc)
bunx wrangler types      # Regenerate worker-configuration.d.ts
```

## Adding a New RPC Method

1. Add type to `shared/types.ts` → `RpcMap`
2. Add handler in `be/handlers/` — handler signature: `async (input, db: D1Database) => output`
3. Call from FE via `rpc('method.name', input)` — fully typed end-to-end

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
  httpMetadata: { contentType: 'image/png' }
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

Skills tại `.claude/skills/`:
- `cloudflare/` — Master skill: all Cloudflare products, decision trees, reference library
- `wrangler/` — Wrangler CLI: deploy, dev, bindings, migrations, testing
- `workers-best-practices/` — Code review rules, anti-patterns, security, streaming
- `release/` — Quy trình deploy selfapp lên Cloudflare (8 bước)
- `debug/` — Debug theo từng layer: FE, RPC, BE, D1, AI SDK, Deploy

Slash commands tại `.claude/commands/`:
- `/release` — Triển khai app lên Cloudflare
- `/debug` — Debug lỗi trong app
- `/speckit.*` — Feature planning workflow (analyze, clarify, plan, implement, v.v.)
