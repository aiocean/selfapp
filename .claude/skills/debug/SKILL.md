---
name: debug
description: Use when user reports bugs, errors, "app bị lỗi", "không hoạt động", "trang trắng", "debug", "fix", "troubleshoot", "sửa lỗi". AI tự kiểm tra toàn bộ hệ thống, tìm lỗi và sửa mà không cần user biết kỹ thuật.
---

# Debug SelfApp

**Nguyên tắc: Tự làm hết.** User không biết kỹ thuật. Không hỏi user "lỗi gì", "log nói gì", "console có gì". AI tự đi kiểm tra tất cả, tự tìm nguyên nhân, tự sửa. Chỉ hỏi user khi cần mô tả triệu chứng ("bạn thấy gì trên màn hình?").

## Bước 1: Hỏi user đúng 1 câu

> "Bạn gặp vấn đề gì? Kể cho mình nghe bạn đang làm gì thì lỗi xảy ra."

Chỉ cần biết triệu chứng. Phần còn lại AI tự điều tra.

## Bước 2: Quét toàn bộ hệ thống

Chạy TẤT CẢ các lệnh sau **song song** — không chờ, không hỏi, không bỏ qua:

### TypeScript errors (BE + FE)

```bash
# BE types
bunx tsc --noEmit 2>&1

# FE types
cd fe && bunx tsc --noEmit 2>&1
```

### Build check

```bash
bun run build 2>&1
```

### Wrangler config

```bash
# Kiểm tra wrangler.jsonc hợp lệ
bunx wrangler deploy --dry-run 2>&1 | head -20
```

### Database state

```bash
# Đọc tên DB từ wrangler.jsonc rồi chạy:
bunx wrangler d1 execute <db-name> --local --command "SELECT name FROM sqlite_master WHERE type='table'"
bunx wrangler d1 execute <db-name> --local --command "SELECT count(*) as total FROM <main-table>"

# Migrations đã apply
bunx wrangler d1 migrations list <db-name> --local
```

### Secrets

```bash
bunx wrangler secret list 2>&1
```

### Server logs (production)

```bash
# Tail live logs từ production — chạy 10 giây rồi dừng
timeout 10 bunx wrangler tail --format json 2>&1 | head -50
```

### Server logs (local dev)

```bash
# Nếu đang chạy wrangler dev, kiểm tra process
ps aux | grep wrangler | grep -v grep

# Test REST API endpoint trực tiếp
curl -s http://localhost:8787/api/notes 2>&1

# Test chat endpoint (nếu có)
curl -s -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}' 2>&1 | head -20
```

### Frontend runtime

```bash
# Kiểm tra dist tồn tại
ls -la fe/dist/index.html 2>&1

# Kiểm tra assets
ls fe/dist/assets/ 2>&1 | head -10
```

### Dependencies

```bash
# All deps (bun workspaces — single install at root covers be/ + fe/)
bun install --dry-run 2>&1 | head -5
```

### Source code scan

```bash
# Tìm lỗi phổ biến trong code
# 1. process.env (không có trong Workers)
grep -r "process\.env" be/ shared/ 2>/dev/null

# 2. Destructure ctx (crash)
grep -r "const.*{.*}.*=.*ctx" be/ 2>/dev/null

# 3. Module-level mutable state
grep -rn "^const.*=.*\[\]$\|^const.*=.*{}$\|^let " be/ 2>/dev/null

# 4. Missing await
grep -rn "\.prepare(.*\.all\b\|\.prepare(.*\.first\b\|\.prepare(.*\.run\b" be/ 2>/dev/null | grep -v await

# 5. String interpolation in SQL (injection risk)
grep -rn '`.*\$.*`' be/routes/ 2>/dev/null
```

## Bước 3: Đọc code liên quan

Dựa trên triệu chứng + kết quả quét, đọc các file liên quan:

| Triệu chứng     | Đọc file                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------- |
| Trang trắng     | `fe/src/main.ts`, `fe/src/App.vue`, `fe/index.html`                                           |
| Data không hiện | `shared/types.ts`, route tương ứng trong `be/routes/`, composable trong `fe/src/composables/` |
| Chat/AI lỗi     | `be/chat.ts` (hoặc file AI), kiểm tra env bindings                                            |
| Lưu data lỗi    | `be/routes/`, `db/migrations/`, kiểm tra schema vs query                                      |
| Deploy lỗi      | `wrangler.jsonc`, `package.json` scripts                                                      |

**Đọc cả `shared/types.ts`** để hiểu toàn bộ data model — lỗi API thường do mismatch giữa FE gọi và BE xử lý.

## Bước 4: Chẩn đoán

Từ tất cả data thu thập, xác định:

1. **Layer nào lỗi**: FE / REST API / BE / D1 / AI / Deploy
2. **Root cause**: nguyên nhân gốc, không phải triệu chứng
3. **Fix cần làm**: liệt kê cụ thể file nào, dòng nào

### Bảng chẩn đoán nhanh

| Lỗi                                         | Root cause thường gặp               | Fix                                                       |
| ------------------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| `TypeError: Cannot read properties of null` | D1 `.first()` trả null, không check | Thêm null check                                           |
| `404 Not Found`                             | URL sai hoặc route chưa register    | Check `be/routes/` + route registration trong `worker.ts` |
| `D1_ERROR: no such table`                   | Migration chưa apply                | `bunx wrangler d1 migrations apply`                       |
| `D1_ERROR: no such column`                  | Schema outdated                     | Tạo migration mới                                         |
| Trang trắng, console lỗi                    | Import sai, component crash         | Check `bunx tsc --noEmit` trong fe/                       |
| 401 từ AI API                               | Secret chưa set hoặc hết hạn        | `wrangler secret put`                                     |
| Stream ngắt giữa chừng                      | Worker timeout (CPU limit)          | Optimize hoặc dùng Durable Objects                        |
| Data mất sau restart local                  | Local D1 bị reset                   | Check `.wrangler/` folder                                 |
| CORS error                                  | Endpoint thiếu headers              | Thêm CORS headers trong worker.ts                         |
| `process is not defined`                    | Dùng process.env trong Workers      | Đổi sang `env.` từ handler param                          |

## Bước 5: Sửa lỗi

**Tự sửa luôn.** Không hỏi user "mình sửa nhé?". Cứ sửa.

Sau khi sửa, chạy lại kiểm tra:

```bash
# 1. TypeScript clean
bunx tsc --noEmit 2>&1
cd fe && bunx tsc --noEmit 2>&1

# 2. FE build OK
bun run build 2>&1

# 3. Test endpoint bị lỗi
curl -s http://localhost:8787/api/notes

# 4. Nếu đổi schema → tạo migration + apply
bunx wrangler d1 migrations apply <db-name> --local
```

Nếu sửa xong mà vẫn lỗi → lặp lại từ Bước 2 với thông tin mới.

## Bước 6: Báo kết quả cho user

> "Mình đã tìm ra và sửa xong vấn đề rồi. [Giải thích 1 câu đơn giản]. Bạn thử lại xem nhé!"

Ví dụ:

- "App không hiện dữ liệu vì cơ sở dữ liệu chưa được cập nhật. Mình đã cập nhật xong rồi."
- "Trang bị trắng vì có lỗi nhỏ trong code hiển thị. Mình đã sửa, bạn reload lại trang nhé."
- "Chat không hoạt động vì khóa AI hết hạn. Bạn cần dán khóa mới vào — mình hướng dẫn nhé."

**KHÔNG BAO GIỜ:**

- Show stack trace cho user
- Nói "API handler throw error"
- Nói "migration 003 thiếu column xyz"
- Giải thích kỹ thuật trừ khi user hỏi

## Debug Production (app đã deploy)

Khi lỗi xảy ra trên production (không phải local dev):

```bash
# 1. Live logs — xem request/error real-time
bunx wrangler tail --format pretty 2>&1

# 2. Kiểm tra production database
bunx wrangler d1 execute <db-name> --remote --command "SELECT count(*) FROM <table>"

# 3. Test production endpoint
curl -s https://<app>.workers.dev/api/notes

# 4. Kiểm tra production secrets
bunx wrangler secret list

# 5. Kiểm tra deployment status
bunx wrangler deployments list
```

So sánh local vs production:

- Migration local OK nhưng production lỗi → `bunx wrangler d1 migrations apply <db-name> --remote`
- Secret local có nhưng production thiếu → `bunx wrangler secret put <name>`
- Code local mới nhưng production cũ → `bun run deploy`

## Gotchas

- **Local D1 và Production D1 là hoàn toàn riêng biệt**: Fix lỗi trên local xong nhưng production vẫn lỗi? Migration chưa apply cho production. Chạy `bunx wrangler d1 migrations apply <db-name> --remote`.
- **`wrangler dev` dùng port 8787 mặc định**: Nếu port bị chiếm, wrangler sẽ chọn port khác. Kiểm tra output để biết port thực tế.
- **FE dev server (vite-plus) proxy `/api` sang 8787**: Nếu BE chạy port khác, FE sẽ không gọi được API. Kiểm tra `fe/vite.config.ts` phần `server.proxy`.
- **`ctx` trong Workers KHÔNG được destructure**: `const { waitUntil } = ctx` sẽ crash. Luôn dùng `ctx.waitUntil()`.
- **`console.log` trong Workers chỉ thấy qua `wrangler tail`**: Không có terminal output như Node.js thường. Dùng `bunx wrangler tail --format pretty` để xem log production.

## Config

Lưu thông tin debug environment vào `.claude/skills/debug/config.local.md`:

```yaml
---
production_url: ""
local_port: 8787
d1_database_name: selfapp-db
main_table: notes
health_check_path: /api/notes
---
```

AI dùng config này để biết kiểm tra endpoint nào, database nào mà không cần đoán.
