---
name: workflow
description: >
  Use when user opens a new session (SessionStart), says "mình muốn", "bắt đầu", "tiếp tục",
  "app bị lỗi", "không hoạt động", "đưa lên mạng", "thay đổi giao diện", "chạy app",
  "cài đặt", "trang trắng", "sửa lỗi", "thêm tính năng", "sửa lại", "thay đổi",
  "cái này chưa đúng", "muốn khác đi", "không phải vậy", "chưa ổn", or any Vietnamese
  describing what they want to do or change. Opinionated workflow navigator that chains
  skills together — user always knows where they are and what comes next.
---

# Workflow — Navigator cho người dùng

Bạn là navigator — không chỉ chỉ đường mà DẪN ĐƯỜNG. Mỗi workflow là một chuỗi skill được chain lại. User luôn biết mình đang ở bước nào và bước tiếp theo là gì.

## Skill Graph

```
                        ┌──────────────────────────────┐
                        │     WORKFLOW (you are here)   │
                        │  Detect intent → chain skills │
                        └──────────────┬───────────────┘
                                       │
     ┌────────────┬───────────────┼───────────────┬──────────┬──────────┐
     ▼            ▼               ▼               ▼          ▼          ▼
┌────────┐  ┌──────────┐  ┌───────────┐  ┌────────┐  ┌─────────┐  ┌─────────┐
│ WF1    │  │ WF2      │  │ WF3       │  │ WF4    │  │ WF5     │  │ WF6     │
│Khởi tạo│  │Tính năng │  │Sửa lỗi   │  │Deploy  │  │Giao diện│  │Iteration│
└────────┘  └──────────┘  └───────────┘  └────────┘  └─────────┘  └─────────┘
```

### Tất cả skill được dùng trong workflows

| Category | Skill | Vai trò |
|----------|-------|---------|
| **Setup** | `setup` | Cài tools, packages, database |
| **Thinking** | `superpowers:brainstorming` | Khám phá ý tưởng trước khi code |
| | `superpowers:writing-plans` | Viết kế hoạch implementation |
| | `superpowers:executing-plans` | Thực thi kế hoạch |
| **Verify** | `superpowers:verification-before-completion` | Xác nhận xong thật trước khi báo done |
| | `superpowers:test-driven-development` | Viết test trước, code sau |
| **Debug** | `debug` | Auto-diagnose & fix cho non-tech user |
| | `superpowers:systematic-debugging` | Debug 4 pha khi lỗi phức tạp |
| **Backend** | `hono` | API routes, middleware, handlers |
| **Frontend** | `shadcn-vue` | UI components (Button, Dialog, Form...) |
| | `frontend-design:frontend-design` | Thiết kế giao diện đẹp |
| | `ai-annotator` | Feedback trực tiếp từ browser |
| **AI** | `claude-api` | Tích hợp Claude AI vào app |
| **Deploy** | `release` | Deploy lên Cloudflare Workers |
| **Code Intel** | `gitnexus-impact-analysis` | Blast radius trước khi sửa code cũ |
| | `gitnexus-debugging` | Trace bug qua call graph |
| | `gitnexus-exploring` | Hiểu kiến trúc code |
| **Git** | `commit-commands:commit` | Tạo git commit |
| **Reference** | `cloudflare` | Cloudflare products reference |
| | `wrangler` | Wrangler CLI reference |
| | `workers-best-practices` | Anti-patterns, security |

---

## WF1: Khởi tạo — "Bắt đầu từ đầu"

**Trigger**: "cài đặt", "chạy app", "bắt đầu", "setup", "lần đầu", SessionStart khi chưa setup
**Confirm**: TỰ CHẠY

```
Gate Check (App Identity trong CLAUDE.md)
  │
  ├─ Có __PLACEHOLDER__? → Phỏng vấn user trước
  │                         → Cập nhật App Identity
  │                         → Rồi mới tiếp tục ↓
  ▼
setup                         ← Cài bun, packages, database
  │
  ▼
Verify: chạy `bun run dev`   ← Xác nhận app hoạt động
  │
  ▼
✅ "App đã sẵn sàng trên máy bạn! Bạn muốn làm gì tiếp?"
```

**Done khi**: App chạy được trên localhost, không lỗi.

---

## WF2: Thêm tính năng — "Mình muốn thêm..."

**Trigger**: "mình muốn thêm...", "có ý tưởng", "làm thêm...", "tạo tính năng...", "mình muốn app có..."
**Confirm**: HỎI trước — "Hay đó! Mình sẽ giúp bạn xây tính năng này. Bắt đầu nhé?"

```
superpowers:brainstorming             ← Khám phá: user thực sự cần gì?
  │
  ▼
superpowers:writing-plans             ← Viết kế hoạch chi tiết
  │
  ▼
superpowers:executing-plans           ← Thực thi từng bước
  │
  ├── Cần backend API?
  │   └── hono                        ← Route, middleware, handler
  │
  ├── Cần UI components?
  │   └── shadcn-vue                  ← Button, Dialog, Form, Table...
  │
  ├── Cần thiết kế giao diện?
  │   └── frontend-design:frontend-design  ← Design production-grade
  │
  ├── Cần tích hợp AI?
  │   └── claude-api                  ← Claude SDK integration
  │
  └── Sửa code hiện có?
      └── gitnexus-impact-analysis    ← Check blast radius TRƯỚC khi sửa
  │
  ▼
superpowers:verification-before-completion  ← Chạy app, confirm OK
  │
  ▼
commit-commands:commit                ← Save tiến độ
  │
  ▼
✅ "Tính năng [X] đã xong! Bạn thử dùng xem nhé."
```

**Done khi**: Feature hoạt động, đã commit, app chạy không lỗi.

### Sizing — không phải lúc nào cũng cần full workflow

| Size | Dấu hiệu | Dùng | Bỏ qua |
|------|-----------|------|--------|
| **Nhỏ** | 1 file, thay đổi đơn giản | code → verify → commit | brainstorm, plan |
| **Vừa** | 2-5 files, 1 feature rõ ràng | brainstorm → code → verify → commit | plan |
| **Lớn** | 5+ files, hệ thống mới | Full workflow | Không bỏ gì |

**Mặc định VỪA**, chỉ scale khi cần.

---

## WF3: Sửa lỗi — "App bị lỗi!"

**Trigger**: "bị lỗi", "không hoạt động", "trang trắng", "sửa lỗi", "hỏng rồi", "lỗi", "bug"
**Confirm**: TỰ CHẠY — "Để mình kiểm tra nhé."

```
debug                                 ← Hỏi user 1 câu: "Bạn thấy lỗi gì?"
  │                                      Rồi tự scan toàn bộ hệ thống
  ▼
gitnexus-debugging                    ← Trace bug qua call graph
  │
  ▼
gitnexus-impact-analysis              ← Check blast radius trước khi sửa
  │
  ▼
Fix code                              ← Sửa root cause, không patch symptom
  │
  ▼
superpowers:verification-before-completion  ← Chạy lại, confirm hết lỗi
  │
  ▼
commit-commands:commit                ← Save fix
  │
  ▼
✅ "Đã sửa xong! [Giải thích ngắn bằng ngôn ngữ thường]"
```

**Done khi**: Lỗi hết, app chạy bình thường, đã commit.

**Escalation**: Nếu debug thường không tìm ra:
```
debug → không ra
  → superpowers:systematic-debugging   ← Debug 4 pha có evidence
  → gitnexus-exploring                 ← Hiểu kiến trúc liên quan
```

---

## WF4: Đưa lên mạng — "Mọi người dùng được"

**Trigger**: "đưa lên mạng", "mọi người dùng được", "publish", "ra mắt", "deploy", "go live"
**Confirm**: HỎI trước — "Mình sẽ đưa app lên mạng. Sẵn sàng chưa?"

```
superpowers:verification-before-completion  ← Pre-flight: app chạy OK trên máy?
  │
  ├─ Có lỗi? → Chuyển sang WF3 trước
  │
  ▼
release                               ← Deploy lên Cloudflare (login, db, build, deploy)
  │
  ▼
Verify live                           ← Mở URL production, kiểm tra
  │
  ├─ Lỗi production? → debug + release lại
  │
  ▼
✅ "App đã online tại [URL]! Ai cũng truy cập được rồi."
```

**Done khi**: App live, truy cập được, không lỗi.

---

## WF5: Thay đổi giao diện — "Muốn đẹp hơn"

**Trigger**: "thay đổi giao diện", "đẹp hơn", "đổi màu", "sửa giao diện", "thêm nút", "UI", "layout"
**Confirm**: HỎI trước — "Bạn muốn thay đổi chỗ nào? Mô tả cho mình nhé."

```
superpowers:brainstorming             ← Hiểu user muốn gì, tại sao
  │
  ▼
frontend-design:frontend-design       ← Thiết kế giao diện mới
  │
  ▼
shadcn-vue                            ← Dùng components có sẵn
  │
  ▼
Implement                             ← Code giao diện
  │
  ├── Cần feedback từ browser?
  │   └── ai-annotator                ← User chỉ trực tiếp trên screen
  │
  ▼
superpowers:verification-before-completion  ← Xem trên browser, confirm OK
  │
  ▼
commit-commands:commit
  │
  ▼
✅ "Giao diện mới đã sẵn sàng! Refresh trình duyệt xem nhé."
```

**Done khi**: Giao diện hiển thị đúng, responsive, không broken.

---

## WF6: Sửa / cải thiện app — "Mình muốn thay đổi..."

**Trigger**: "sửa lại", "thay đổi", "cái này chưa đúng", "muốn khác đi", "không phải vậy", "muốn bỏ...", "thêm...", "bớt...", feedback sau khi xem rough draft

**Confirm**: TỰ CHẠY — "OK, mình sửa lại nhé."

Đây là workflow quan trọng nhất sau creation — user sẽ dùng workflow này HÀNG NGÀY.

```
User mô tả muốn thay đổi gì
  │
  ▼
AI hỏi 1 câu duy nhất (nếu chưa rõ):
  "Bạn muốn kết quả cuối cùng trông như nào?"
  │
  ▼
gitnexus-impact-analysis              ← Check: thay đổi này ảnh hưởng tới đâu?
  │
  ▼
Fix / modify code                     ← Sửa ngay, không plan dài dòng
  │
  ├── Thay đổi nhỏ (1-2 files)?
  │   → Sửa trực tiếp
  │
  ├── Thay đổi vừa (data model + UI)?
  │   → Migration nếu cần → BE → FE
  │
  └── Thay đổi lớn (feature mới)?
  │   → Chuyển sang WF2 (Thêm tính năng)
  │
  ▼
superpowers:verification-before-completion  ← App chạy OK, thay đổi đúng ý?
  │
  ▼
Show-and-refine: "Mình vừa sửa xong — bạn xem thử nhé!"
  │
  ├── User OK → commit-commands:commit → ✅ Done
  └── User muốn sửa thêm → lặp lại WF6 (KHÔNG cần confirm)
```

**Nguyên tắc iteration:**
- **Sửa nhanh, show ngay** — không plan dài dòng cho thay đổi nhỏ-vừa
- **Loop tự nhiên** — user nói "chưa đúng" → sửa → show → user nói "OK" → commit. Vòng lặp này phải mượt, không hỏi "bạn có muốn mình sửa không?"
- **Commit khi user happy** — KHÔNG commit từng bước nhỏ, commit khi user xác nhận kết quả

---

## WF7: Tiếp tục việc dở — "Hồi nãy làm dở"

**Trigger**: "tiếp tục", "hồi nãy", "làm dở", "tiếp đi"

```
Detect state:
  │
  ├── Có uncommitted changes?
  │   → Phân tích changes → đoán workflow → confirm với user → resume
  │
  ├── Có plan đang thực thi?
  │   → superpowers:executing-plans → tiếp tục
  │
  ├── Có lỗi chưa fix?
  │   → WF3 (Sửa lỗi)
  │
  └── Không tìm thấy gì?
      → "Mình không thấy việc dở nào. Bạn muốn làm gì tiếp?"
```

---

## Chuyển workflow

Workflow có thể nhảy sang nhau khi cần:

```
WF1 (Khởi tạo) ──rough draft xong──▶ WF6 (Iteration) ──user happy──▶ WF4 (Deploy)
WF2 (Tính năng) ──gặp lỗi──▶ WF3 (Sửa lỗi) ──xong──▶ quay lại WF2
WF2 (Tính năng) ──xong──▶ WF6 (Iteration) ──user refine──▶ loop
WF4 (Deploy) ──pre-flight fail──▶ WF3 (Sửa lỗi) ──xong──▶ quay lại WF4
WF5 (Giao diện) ──cần API mới──▶ WF2 (Tính năng) mini
WF6 (Iteration) ──cần feature mới──▶ WF2 (Tính năng)
WF6 (Iteration) ──gặp lỗi──▶ WF3 (Sửa lỗi) ──xong──▶ quay lại WF6
```

**WF6 là workflow "mặc định" sau creation.** Sau WF1 hoặc WF2, user thường rơi vào vòng lặp WF6 (sửa → xem → sửa → xem) cho đến khi happy.

**Luôn nói cho user biết khi chuyển**:
- "Mình phát hiện lỗi, để sửa trước rồi tiếp tục nhé."
- "Xong rồi, quay lại tính năng đang làm dở nha."

---

## Sau khi invoke skill

1. Skill tiếp quản hoàn toàn
2. Workflow chờ skill hoàn thành
3. Skill xong → workflow chuyển sang bước tiếp theo
4. Skill fail → workflow xử lý (retry hoặc chuyển WF3)