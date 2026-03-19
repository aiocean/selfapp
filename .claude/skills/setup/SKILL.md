---
name: setup
description: Use when user first opens the project, says "setup", "cài đặt", "chạy app", "bắt đầu", "install", "get started", or when missing tools cause errors (command not found, no such table, MODULE_NOT_FOUND)
---

# Setup — Cài đặt công cụ và tìm hiểu mục đích app

Skill này giúp user non-tech cài đặt công cụ cần thiết, cài skills/plugins cho AI, và phỏng vấn user để hiểu họ muốn app làm gì. Chạy lại lần 2+ chỉ cài thêm phần thiếu.

**Ngôn ngữ:** Luôn nói chuyện bằng tiếng Việt, giọng thân thiện. KHÔNG dùng thuật ngữ kỹ thuật. Xem CLAUDE.md phần "Output Style".

**Quan trọng:** Skill này CHỈ cài đặt công cụ + thu thập mục đích. KHÔNG code, KHÔNG plan, KHÔNG tạo database, KHÔNG build gì hết.

## Tổng quan

```
Phase 1: Cài công cụ (bun, packages)
  → Phase 2: Cài skills/plugins cho AI
  → Phase 3: Phỏng vấn mục đích app (nếu chưa có)
  → Phase 4: Cập nhật CLAUDE.md
  → Báo kết quả. DỪNG.
```

---

## Phase 1 — Cài công cụ

### 1.1 Bun

```bash
bun --version
```

Nếu `command not found`:

```bash
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"
```

Nói với user: "Mình vừa cài xong một công cụ cần thiết để chạy app."

### 1.2 Cài packages

```bash
bun install
```

Một lệnh duy nhất cài tất cả. Nói với user: "Đang cài đặt các phần cần thiết cho app..."

---

## Phase 2 — Cài skills & plugins cho AI

Kiểm tra và cài các skill/plugin cần thiết.

### Plugins (qua `claude plugin install`)

```bash
claude plugin install frontend-design@claude-plugins-official
claude plugin install superpowers@claude-plugins-official
claude plugin install code-simplifier@claude-plugins-official
claude plugin install feature-dev@claude-plugins-official
claude plugin install typescript-lsp@claude-plugins-official
```

### Skills (qua `npx skills add`)

```bash
npx skills add "https://github.com/cloudflare/skills" --skill "wrangler" --agent claude-code --yes --copy
npx skills add "https://github.com/cloudflare/cloudflare-docs" --skill "workers-best-practices" --agent claude-code --yes --copy
npx skills add "https://github.com/cloudflare/cloudflare-docs" --skill "cloudflare" --agent claude-code --yes --copy
```

Nếu lệnh nào lỗi → bỏ qua, báo user tên skill chưa cài được để chạy thủ công sau.

Nói với user: "Mình đang cài thêm kỹ năng cần thiết..."

---

## Phase 3 — Phỏng vấn: hiểu WORKFLOW của user

**Gate check:** Đọc CLAUDE.md phần `App Identity`. Nếu các giá trị đã điền (không phải `__PLACEHOLDER__`) → bỏ qua phase này.

### Triết lý phỏng vấn

User không biết mình muốn "app gì" — nhưng RẤT BIẾT mình đang làm gì hàng ngày mà mệt. Hỏi về WORKFLOW (việc lặp đi lặp lại), KHÔNG hỏi về features hay app.

Dùng AskUserQuestion để hỏi từng câu. Giọng thân thiện, như đang trò chuyện.

**Câu mở đầu:**

> Chào bạn! Trước khi bắt đầu, mình muốn hiểu bạn đang cần gì. Mình sẽ hỏi vài câu ngắn — trả lời thoải mái bằng ngôn ngữ hàng ngày nhé, không cần biết kỹ thuật gì cả.

**Hỏi tuần tự, mỗi lần 1 câu:**

1. **Việc lặp đi lặp lại**: "Trong công việc hoặc cuộc sống hàng ngày, có việc gì bạn phải làm đi làm lại mà thấy mất thời gian không? Ví dụ: ghi chi tiêu vào Excel, tổng hợp báo cáo từ nhiều nguồn, theo dõi thói quen..."

2. **Cách làm hiện tại**: "Hiện tại bạn đang làm việc đó bằng cách nào? Dùng giấy, Excel, app nào đó, hay nhờ người khác?"

3. **Điểm khó chịu nhất**: "Phần nào trong quy trình đó khiến bạn khó chịu nhất? Chỗ nào tốn thời gian nhất?"

4. **Kết quả mong muốn**: "Nếu có app tự làm hộ bạn, sau khi dùng xong bạn muốn THẤY gì? Ví dụ: 'biết tháng này tiêu bao nhiêu', 'có danh sách việc cần làm hôm nay', 'bảng tổng hợp tuần'..."

5. **Ai dùng**: "Chỉ mình bạn dùng thôi, hay muốn chia sẻ với ai nữa?"

### Quy tắc

- Hỏi TỪNG CÂU MỘT, chờ trả lời rồi mới hỏi tiếp
- Nếu user nói chung chung → hỏi lại cụ thể: "Bạn cho mình ví dụ hôm qua bạn làm việc đó như nào?"
- Nếu user trả lời dài → tóm tắt lại: "Mình hiểu là... đúng không?"
- KHÔNG hỏi về kỹ thuật, tech stack, cấu trúc dữ liệu
- KHÔNG gợi ý tính năng phức tạp — để user mô tả bằng ngôn ngữ của họ
- KHÔNG hỏi "bạn muốn app gì?" — hỏi "bạn đang LÀM gì?"

### Sau khi hỏi xong — tóm tắt bằng ngôn ngữ workflow

> Mình hiểu rồi! Tóm lại:
> - **Việc bạn muốn app giúp**: [workflow cụ thể]
> - **Hiện tại đang làm bằng**: [cách hiện tại]
> - **Phần khó chịu nhất**: [pain point]
> - **Kết quả mong muốn**: [output user muốn thấy]
> - **Người dùng**: [ai dùng]
>
> Đúng chưa? Có gì muốn thay đổi không?

Chờ user xác nhận trước khi sang Phase 4.

### Show-and-Refine — build rough draft NGAY

Sau khi user xác nhận, KHÔNG lên kế hoạch dài dòng. Thay vào đó:

1. AI tự đặt tên app dựa trên workflow (ví dụ: "Quản lý chi tiêu" nếu user theo dõi tiền)
2. AI tự quyết định data model + UI cơ bản nhất
3. Build rough draft chỉ với 1-2 tính năng cốt lõi
4. Show cho user ngay: "Mình vừa tạo bản nháp đầu tiên — bạn mở trình duyệt xem thử nhé!"
5. User react với cái THẬT, không phải tưởng tượng
6. AI hỏi: "Bạn thấy sao? Có gì muốn thêm bớt không?"

**Nguyên tắc: Xem rồi góp ý — dễ hơn tưởng tượng từ đầu.**

---

## Phase 4 — Cập nhật CLAUDE.md

Cập nhật block `App Identity` trong CLAUDE.md:

```yaml
app_name: "[AI tự đặt dựa trên workflow]"
app_goal: "[workflow cụ thể user muốn tự động hoá]"
problem_statement: "[pain point chính từ phỏng vấn]"
current_process: "[cách user đang làm hiện tại]"
desired_output: "[kết quả user muốn thấy]"
```

Thêm context bổ sung vào CLAUDE.md nếu hữu ích (ai dùng, tần suất dùng).

### Cập nhật tên app trong project

Sau khi cập nhật CLAUDE.md, AI cần đổi tên app trong các file config cho khớp:

1. **Tạo slug** từ `app_name` — viết thường, bỏ dấu, thay space bằng `-`. Ví dụ: "Quản lý chi tiêu" → `quan-ly-chi-tieu`

2. **`wrangler.jsonc`** — đổi 2 chỗ:
   - `"name"`: từ `"selfapp"` → `"<slug>"` (tên Worker trên Cloudflare)
   - `"database_name"`: từ `"selfapp-db"` → `"<slug>-db"`
   - `"database_id"`: reset về `""` (sẽ tạo database mới khi deploy)

3. **`package.json`** — đổi 3 scripts có chứa `selfapp-db` → `<slug>-db`:
   - `db:create`
   - `db:migrate`
   - `db:migrate:prod`

**Ví dụ:** Nếu app tên "Sổ tay nấu ăn" → slug = `so-tay-nau-an`:
```json
// wrangler.jsonc
"name": "so-tay-nau-an",
"database_name": "so-tay-nau-an-db",
"database_id": "",

// package.json
"db:create": "wrangler d1 create so-tay-nau-an-db",
"db:migrate": "wrangler d1 migrations apply so-tay-nau-an-db --local",
"db:migrate:prod": "wrangler d1 migrations apply so-tay-nau-an-db --remote",
```

**KHÔNG làm gì thêm ngoài cập nhật CLAUDE.md + config.**

---

## Báo kết quả

> Xong rồi! Mình đã:
> - Cài đặt mọi thứ cần thiết trên máy bạn
> - Hiểu được bạn muốn app giúp [workflow cụ thể]
> - Tạo bản nháp đầu tiên — bạn mở trình duyệt xem thử nhé!
>
> Xem xong cho mình biết: thấy ổn không? Muốn thêm bớt gì?

**DỪNG LẠI Ở ĐÂY.** Chờ user phản hồi về rough draft. Không tự động thêm tính năng.

---

## Xử lý lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `command not found: bun` | Chưa cài bun | Chạy lại Phase 1.1 |
| `MODULE_NOT_FOUND` | Chưa cài packages | Chạy lại Phase 1.2 |
| `EACCES permission denied` | Thiếu quyền | `sudo chown -R $(whoami) ~/.bun` |
| `claude plugin install` lỗi | Claude Code chưa cài | `npm install -g @anthropic-ai/claude-code` |

## Gotchas

- **bun cài xong nhưng vẫn `command not found`**: Mở terminal mới hoặc `export PATH="$HOME/.bun/bin:$PATH"`.
- **`vite-plus` khác với `vite`**: FE dùng `vp` thay vì `vite`. Đừng cài `vite` riêng.
- **Phase 3 bỏ qua nếu App Identity đã điền**: Không hỏi lại nếu đã phỏng vấn rồi.
