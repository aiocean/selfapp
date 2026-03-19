---
name: cloudflare-account
description: >
  Use when user chưa có tài khoản Cloudflare, khi wrangler deploy/login thất bại vì chưa đăng ký,
  hoặc khi user hỏi "tạo tài khoản", "đăng ký Cloudflare", "sign up", "không deploy được",
  "wrangler login lỗi". Hướng dẫn user tạo tài khoản Cloudflare từ đầu.
---

# Tạo tài khoản Cloudflare

Skill này hướng dẫn user (không biết kỹ thuật) tạo tài khoản Cloudflare miễn phí để có thể đưa app lên mạng.

## Khi nào cần chạy skill này

- User chưa có tài khoản Cloudflare
- `bunx wrangler whoami` báo lỗi hoặc không nhận được account
- `bunx wrangler login` thất bại
- `bunx wrangler deploy` thất bại vì chưa đăng nhập hoặc chưa có account

## Quy trình hướng dẫn user

### Bước 1: Kiểm tra user đã có tài khoản chưa

Hỏi user (dùng AskUserQuestion):

> Bạn đã có tài khoản Cloudflare chưa?
>
> 1. **Chưa có** — Mình sẽ hướng dẫn bạn tạo tài khoản miễn phí (mất khoảng 2 phút)
> 2. **Có rồi** — Mình sẽ giúp bạn đăng nhập để tiếp tục

Nếu user chọn "Có rồi" → chạy `bunx wrangler login` và hướng dẫn đăng nhập → quay lại release skill.

### Bước 2: Hướng dẫn tạo tài khoản

Thông báo user:

> Mình cần bạn tạo một tài khoản Cloudflare miễn phí. Đây là nơi app của bạn sẽ chạy — nhanh, miễn phí, và ổn định.
>
> **Làm theo 4 bước sau:**
>
> 1. Mở trang này trong trình duyệt: **https://dash.cloudflare.com/sign-up**
> 2. Nhập email và mật khẩu → bấm **Create Account**
> 3. Vào email để xác nhận (check cả thư mục spam)
> 4. Quay lại đây báo mình khi xong

Dùng AskUserQuestion để chờ user xác nhận đã tạo xong.

### Bước 3: Đăng nhập Cloudflare từ máy

Sau khi user xác nhận đã tạo tài khoản:

```bash
bunx wrangler login
```

Thông báo user:

> Trình duyệt sẽ mở ra để bạn đăng nhập Cloudflare. Đăng nhập bằng tài khoản vừa tạo, rồi bấm **Allow** khi được hỏi.

### Bước 4: Xác nhận thành công

```bash
bunx wrangler whoami
```

Nếu thấy account name và account ID → thành công.

Thông báo user:

> Xong rồi! Tài khoản Cloudflare đã sẵn sàng. Giờ mình có thể đưa app lên mạng cho bạn.

Nếu vẫn lỗi → hướng dẫn user thử lại `bunx wrangler login`.

## Xử lý lỗi

### "Email already registered"

User đã có tài khoản nhưng quên. Hướng dẫn:

> Có vẻ bạn đã từng đăng ký Cloudflare. Thử đăng nhập tại **https://dash.cloudflare.com/login**. Nếu quên mật khẩu, bấm "Forgot password" để lấy lại.

### "Email not verified"

> Bạn cần xác nhận email trước. Kiểm tra hộp thư (cả spam) để tìm email từ Cloudflare, rồi bấm link xác nhận trong đó.

### Wrangler login mở trình duyệt nhưng không redirect

> Nếu trình duyệt không tự mở, copy đường link hiện trong terminal rồi dán vào trình duyệt.

## Giao tiếp với user

- Gọi Cloudflare là "nơi chạy app" hoặc "dịch vụ hosting miễn phí"
- KHÔNG nói "Workers", "edge network", "CDN", "V8 isolates"
- Nhấn mạnh: **miễn phí**, **nhanh**, **2 phút là xong**
- Kiên nhẫn — đây có thể là lần đầu user tạo tài khoản dịch vụ cloud
