#!/bin/bash
set -e

# selfapp — One-line setup
# Chạy: curl -fsSL https://raw.githubusercontent.com/aiocean/selfapp/main/template/setup.sh | bash
# Hoặc: bash setup.sh ten-app-cua-toi

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[+]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[x]${NC} $1"; exit 1; }

# --- 1. Cài đặt Bun ---
if ! command -v bun &>/dev/null; then
  info "Cài đặt Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
info "Bun $(bun --version)"

# --- 2. Kiểm tra Git ---
if ! command -v git &>/dev/null; then
  error "Chưa có Git. Vui lòng cài Git trước: https://git-scm.com"
fi

# --- 3. Tải template ---
APP_DIR="${1:-my-selfapp}"

if [ -d "$APP_DIR" ]; then
  warn "Thư mục '$APP_DIR' đã tồn tại. Sử dụng thư mục hiện có."
else
  info "Tải template về thư mục '$APP_DIR'..."
  git clone --depth 1 https://github.com/aiocean/selfapp.git "$APP_DIR"
fi

cd "$APP_DIR"

# --- 4. Cài đặt các gói phần mềm ---
info "Cài đặt các gói phần mềm..."
bun install

# --- 5. Cài đặt oh-my-claudecode (AI orchestration) ---
info "Cài đặt oh-my-claudecode..."
bun add -g oh-my-claude-sisyphus 2>/dev/null || npm install -g oh-my-claude-sisyphus 2>/dev/null || {
  warn "Không cài được qua bun/npm. Thử cách khác..."
  curl -fsSL https://raw.githubusercontent.com/yeachan-heo/oh-my-claudecode/main/install.sh | bash
}

# Chạy omc setup để cài toàn bộ components (skills, agents, hooks, MCP)
if command -v omc &>/dev/null; then
  info "Cài đặt OMC components (skills, agents, hooks, MCP)..."
  omc setup --force 2>/dev/null || omc install 2>/dev/null || warn "omc setup thất bại. Chạy 'omc setup' thủ công sau."
else
  warn "Không tìm thấy lệnh 'omc'. Chạy 'omc setup' thủ công sau khi restart terminal."
fi

# --- 6. Cài đặt Skills ---
info "Cài đặt frontend-design skill..."
npx skills add https://github.com/anthropics/skills --skill frontend-design --agent claude-code --yes --copy 2>/dev/null || warn "Không cài được frontend-design skill. Chạy thủ công sau."

info "Cài đặt superpowers skills..."
npx skills add obra/superpowers --agent claude-code --yes --copy 2>/dev/null || warn "Không cài được superpowers skills. Chạy thủ công sau."

info "Cài đặt wrangler skill..."
npx skills add https://github.com/cloudflare/skills --skill wrangler --agent claude-code --yes --copy 2>/dev/null || warn "Không cài được wrangler skill. Chạy thủ công sau."

info "Cài đặt workers-best-practices skill..."
npx skills add https://github.com/cloudflare/cloudflare-docs --skill workers-best-practices --agent claude-code --yes --copy 2>/dev/null || warn "Không cài được workers-best-practices skill. Chạy thủ công sau."

info "Cài đặt cloudflare skill..."
npx skills add https://github.com/cloudflare/cloudflare-docs --skill cloudflare --agent claude-code --yes --copy 2>/dev/null || warn "Không cài được cloudflare skill. Chạy thủ công sau."

# --- 7. Cài đặt GitNexus (code intelligence) ---
if ! command -v gitnexus &>/dev/null; then
  info "Cài đặt GitNexus..."
  bun add -g gitnexus 2>/dev/null || npm install -g gitnexus 2>/dev/null || warn "Không cài được gitnexus. Chạy: npm install -g gitnexus"
fi

# --- 8. Index codebase ---
if command -v gitnexus &>/dev/null; then
  info "Đánh index codebase..."
  npx gitnexus analyze 2>/dev/null || true
fi

# --- 9. Hoàn tất ---
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Cài đặt xong!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "  Thư mục: $(pwd)"
echo ""
echo "  Bước tiếp theo:"
echo "    cd $(pwd) && claude"
echo ""
echo "  Các lệnh cơ bản:"
echo "    bun run dev        — Chạy app trên máy"
echo "    bun run deploy     — Đưa app lên mạng"
echo "    omc doctor         — Kiểm tra OMC hoạt động đúng"
echo ""
echo "  Mô tả app bạn muốn làm, AI sẽ lo phần còn lại!"
echo ""
