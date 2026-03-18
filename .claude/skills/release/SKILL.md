---
name: release
description: Use when user says "release", "deploy", "publish", "go live", "đưa app lên mạng", "triển khai". Hướng dẫn AI thực hiện toàn bộ quy trình release selfapp lên Cloudflare Workers cho user không biết kỹ thuật.
---

# Release SelfApp

Skill này hướng dẫn AI thực hiện toàn bộ quy trình release một selfapp lên Cloudflare Workers. User không cần biết gì về technical — AI tự xử lý hết.

## Quy trình

Chạy tuần tự từ trên xuống. Bỏ qua các bước đã hoàn thành (kiểm tra trước khi chạy).

### Bước 1: Kiểm tra trạng thái hiện tại

```bash
# Kiểm tra wrangler đã cài chưa
bunx wrangler --version

# Kiểm tra đã login Cloudflare chưa
bunx wrangler whoami
```

Nếu chưa login:

```bash
bunx wrangler login
```

Thông báo user: "Mình cần bạn đăng nhập Cloudflare trong trình duyệt vừa mở. Đăng nhập xong quay lại đây nhé."

### Bước 2: Tạo database (lần đầu)

Kiểm tra `wrangler.jsonc` — nếu `database_id` đang rỗng (`""`), cần tạo mới:

```bash
# Đọc tên database từ wrangler.jsonc
bunx wrangler d1 create <database_name>
```

**Quan trọng:** Copy `database_id` từ output vào `wrangler.jsonc`.

Nếu `database_id` đã có giá trị → bỏ qua bước này.

### Bước 3: Tạo R2 bucket (nếu cần)

Kiểm tra `wrangler.jsonc` — nếu có `r2_buckets` config với bucket chưa tồn tại:

```bash
bunx wrangler r2 bucket create <bucket_name>
```

Nếu không có R2 config → bỏ qua.

### Bước 4: Cài đặt secrets

Kiểm tra code xem có dùng `env.` nào là secret không (API keys, tokens, v.v.).

Danh sách secrets phổ biến:

- `ANTHROPIC_API_KEY` — nếu dùng Claude AI
- `GOOGLE_GENERATIVE_AI_API_KEY` — nếu dùng Gemini
- `OPENAI_API_KEY` — nếu dùng OpenAI

Với mỗi secret cần set:

```bash
bunx wrangler secret put <SECRET_NAME>
```

Thông báo user: "Mình cần bạn dán API key vào terminal. Key này sẽ được lưu an toàn trên Cloudflare, không ai thấy được."

**Kiểm tra secret đã set chưa:**

```bash
bunx wrangler secret list
```

### Bước 5: Apply database migrations (production)

```bash
# Đọc tên database từ wrangler.jsonc
bunx wrangler d1 migrations apply <database_name> --remote
```

Xác nhận khi được hỏi "About to apply N migration(s)".

### Bước 6: Build frontend

```bash
bun run build
```

Kiểm tra `fe/dist/` được tạo thành công:

```bash
ls fe/dist/index.html
```

### Bước 7: Deploy

```bash
bunx wrangler deploy
```

Hoặc dùng script nếu có:

```bash
bun run deploy
```

### Bước 8: Xác nhận deployment

Từ output của `wrangler deploy`, lấy URL (dạng `https://<name>.workers.dev`).

```bash
# Kiểm tra app hoạt động
curl -s -o /dev/null -w "%{http_code}" <deployed_url>
```

Kỳ vọng: HTTP 200.

Thông báo user: "App của bạn đã được triển khai thành công! Truy cập tại: <deployed_url>"

## Deploy tiếp theo (đã setup rồi)

Chỉ cần chạy:

```bash
bun run deploy
```

Một lệnh duy nhất: build frontend + deploy lên Cloudflare.

## Xử lý lỗi thường gặp

### "Not logged in"

```bash
bunx wrangler login
```

### "Database not found"

Database chưa được tạo hoặc `database_id` sai. Chạy lại Bước 2.

### "Missing secret"

Secret chưa được set. Chạy lại Bước 4.

### Build lỗi

```bash
bun install && bun run build
```

### "Worker size limit exceeded"

Frontend chưa được build hoặc bundle quá lớn. Kiểm tra `fe/dist/` và optimize nếu cần.

## Gotchas

- **`wrangler deploy` fail thầm nếu `fe/dist/` trống hoặc không tồn tại**: Luôn chạy `bun run build` trước deploy. Kiểm tra `ls fe/dist/index.html` trước khi deploy.
- **D1 migration order quan trọng**: Mỗi migration file có số thứ tự (001, 002...). KHÔNG BAO GIỜ đổi tên hoặc xoá file migration đã apply. Chỉ thêm file mới.
- **`compatibility_date` quá cũ gây lỗi runtime**: Nếu gặp lỗi lạ trên production, kiểm tra `compatibility_date` trong `wrangler.jsonc` — nên dùng ngày gần đây (trong vòng 3 tháng).
- **Deploy lần đầu cần tạo D1 + apply migration TRƯỚC**: Nếu deploy code trước khi tạo database, app sẽ crash ngay lập tức với lỗi "no such table".
- **Secret chỉ tồn tại trên production**: `wrangler secret put` chỉ set cho production. Local dev dùng file `.dev.vars` (không commit!).

## Quy trình qua Cloudflare MCP (thay thế CLI)

Nếu có Cloudflare MCP server kết nối, AI có thể deploy hoàn toàn qua MCP tools mà không cần CLI:

1. `mcp__cloudflare__execute` — tạo D1 database
2. `mcp__cloudflare__execute` — deploy Worker (code + assets)
3. `mcp__cloudflare__execute` — apply migrations
4. Xong. Domain tự động: `<app-name>.workers.dev`

## Giao tiếp với user

- **KHÔNG** dùng thuật ngữ kỹ thuật với user
- Nói "triển khai app" thay vì "deploy Worker"
- Nói "cơ sở dữ liệu" thay vì "D1 database"
- Nói "khóa bí mật" thay vì "API key / secret"
- Khi cần user nhập gì, hướng dẫn cụ thể từng bước
- Luôn thông báo kết quả cuối cùng kèm URL truy cập

## Config

Nếu project đã deploy, lưu thông tin deployment vào `.claude/skills/release/config.local.md` (file này nằm trong .gitignore):

```yaml
---
worker_name: selfapp
cloudflare_account_id: ""
custom_domain: ""
d1_database_name: selfapp-db
d1_database_id: ""
r2_bucket_name: ""
production_url: ""
---
```

AI đọc file này để biết thông tin deployment mà không cần hỏi lại user mỗi lần.
