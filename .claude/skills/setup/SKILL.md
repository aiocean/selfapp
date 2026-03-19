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

## Phase 3 — Phỏng vấn mục đích app

**Gate check:** Đọc CLAUDE.md phần `App Identity`. Nếu các giá trị đã điền (không phải `__PLACEHOLDER__`) → bỏ qua phase này.

### Cách phỏng vấn

Dùng AskUserQuestion để hỏi từng câu. Giọng thân thiện, như đang trò chuyện.

**Câu mở đầu:**

> Chào bạn! Trước khi bắt đầu, mình cần hiểu bạn muốn làm app gì. Mình sẽ hỏi vài câu ngắn nhé — trả lời thoải mái, không cần biết kỹ thuật gì cả.

**Hỏi tuần tự, mỗi lần 1 câu:**

1. **Tên app**: "Bạn muốn đặt tên app là gì? Ví dụ: 'Nhật ký sức khoẻ', 'Quản lý chi tiêu', 'Sổ tay nấu ăn'..."

2. **Mục đích**: "App này sẽ giúp bạn làm gì? Mô tả ngắn gọn thôi, ví dụ: 'ghi lại chi tiêu hàng ngày để biết tiền đi đâu'"

3. **Vấn đề cần giải quyết**: "Hiện tại bạn đang gặp khó khăn gì mà muốn app giải quyết?"

4. **Ai dùng**: "Ai sẽ dùng app này? Chỉ mình bạn, hay chia sẻ với người khác nữa?"

5. **Tính năng chính**: "Nếu app chỉ có thể làm 1-2 việc, bạn muốn nó làm gì nhất?"

### Quy tắc

- Hỏi TỪNG CÂU MỘT, chờ trả lời rồi mới hỏi tiếp
- Nếu chưa rõ → hỏi lại nhẹ nhàng, đưa ví dụ cụ thể
- Nếu user trả lời dài → tóm tắt lại: "Mình hiểu là... đúng không?"
- KHÔNG hỏi về kỹ thuật, tech stack, cấu trúc dữ liệu
- KHÔNG gợi ý tính năng phức tạp

### Sau khi hỏi xong — tóm tắt và xác nhận

> Mình hiểu rồi! Tóm lại:
> - **Tên app**: [tên]
> - **Mục đích**: [mục đích]
> - **Vấn đề giải quyết**: [vấn đề]
> - **Người dùng**: [ai dùng]
> - **Tính năng chính**: [tính năng]
>
> Đúng chưa? Có gì muốn thay đổi không?

Chờ user xác nhận trước khi sang Phase 4.

---

## Phase 4 — Cập nhật CLAUDE.md

Cập nhật block `App Identity` trong CLAUDE.md:

```yaml
app_name: "[tên app từ phỏng vấn]"
app_goal: "[mục đích từ phỏng vấn]"
problem_statement: "[vấn đề từ phỏng vấn]"
```

Thêm context bổ sung vào CLAUDE.md nếu hữu ích (ai dùng, tính năng chính mong muốn).

**KHÔNG làm gì thêm ngoài cập nhật CLAUDE.md.**

---

## Báo kết quả

> Xong rồi! Mình đã:
> - Cài đặt mọi thứ cần thiết trên máy bạn
> - Hiểu được bạn muốn app [tên app] để [mục đích]
>
> Khi nào muốn bắt đầu xây app, cứ nói "mình muốn thêm tính năng [gì đó]" nhé!

**DỪNG LẠI Ở ĐÂY.** Không tự động chuyển sang workflow khác.

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
