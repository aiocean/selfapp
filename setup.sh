#!/bin/bash
set -e

# selfapp — One-line setup cho người không biết lập trình
# Chạy: curl -fsSL https://raw.githubusercontent.com/aiocean/selfapp/main/template/setup.sh | bash
# Hoặc: bash setup.sh ten-app-cua-toi

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
fail()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }
step()  { echo -e "\n${BLUE}──── $1 ────${NC}"; }

# Chỉ hỗ trợ macOS
if [ "$(uname -s)" != "Darwin" ]; then
  fail "Script này chỉ chạy trên macOS."
fi

# ============================================================
step "1/8  Kiểm tra & cài đặt công cụ cơ bản"
# ============================================================

# --- Git ---
if ! command -v git &>/dev/null; then
  info "Đang cài Git..."
  xcode-select --install 2>/dev/null || true
  until command -v git &>/dev/null; do
    echo "  Đang chờ cài Git xong... (bấm 'Install' nếu có popup hiện lên)"
    sleep 5
  done
fi
info "Git $(git --version | cut -d' ' -f3)"

# --- curl (macOS luôn có sẵn, kiểm tra cho chắc) ---
if ! command -v curl &>/dev/null; then
  fail "curl không có sẵn. Đây là lỗi bất thường trên macOS."
fi

# --- Node.js (cần cho npx) ---
if ! command -v node &>/dev/null; then
  info "Đang cài Node.js..."
  curl -fsSL https://fnm.vercel.app/install | bash
  export PATH="$HOME/.local/share/fnm:$PATH"
  eval "$(fnm env)" 2>/dev/null || true
  fnm install --lts
  fnm use lts-latest
fi
info "Node $(node --version)"

# --- Bun ---
if ! command -v bun &>/dev/null; then
  info "Đang cài Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
info "Bun $(bun --version)"

# ============================================================
step "2/8  Tải template về máy"
# ============================================================

APP_DIR="${1:-my-selfapp}"

if [ -d "$APP_DIR" ]; then
  warn "Thư mục '$APP_DIR' đã tồn tại — dùng thư mục này luôn."
else
  info "Tải template về '$APP_DIR'..."
  git clone --depth 1 https://github.com/aiocean/selfapp.git "$APP_DIR"
fi

cd "$APP_DIR/template"

# ============================================================
step "3/8  Cài đặt các gói phần mềm"
# ============================================================

info "Đang cài đặt..."
bun install

# ============================================================
step "4/8  Cài đặt Claude Code (AI kỹ sư)"
# ============================================================

if ! command -v claude &>/dev/null; then
  info "Đang cài Claude Code..."
  npm install -g @anthropic-ai/claude-code 2>/dev/null || bun add -g @anthropic-ai/claude-code 2>/dev/null || {
    warn "Không cài được Claude Code tự động."
    warn "Chạy thủ công: npm install -g @anthropic-ai/claude-code"
  }
fi

if command -v claude &>/dev/null; then
  info "Claude Code $(claude --version 2>/dev/null || echo 'đã cài')"
else
  warn "Claude Code chưa sẵn sàng — restart terminal rồi chạy: npm install -g @anthropic-ai/claude-code"
fi

# ============================================================
step "5/8  Cài đặt oh-my-claudecode (AI orchestration)"
# ============================================================

if ! command -v omc &>/dev/null; then
  info "Đang cài oh-my-claudecode..."
  npm install -g oh-my-claude-sisyphus 2>/dev/null || bun add -g oh-my-claude-sisyphus 2>/dev/null || {
    warn "Không cài được oh-my-claudecode. Thử lại sau: npm install -g oh-my-claude-sisyphus"
  }
fi

if command -v omc &>/dev/null; then
  info "Cài đặt OMC components..."
  omc setup --force 2>/dev/null || omc install 2>/dev/null || warn "omc setup thất bại. Chạy 'omc setup' thủ công sau."
else
  warn "Không tìm thấy omc — restart terminal rồi chạy 'omc setup'."
fi

# ============================================================
step "6/8  Cài đặt Skills (kỹ năng cho AI)"
# ============================================================

install_skill() {
  local name="$1"
  local source="$2"
  local skill_flag="$3"

  info "Cài skill: $name..."
  if [ -n "$skill_flag" ]; then
    npx skills add "$source" --skill "$skill_flag" --agent claude-code --yes --copy 2>/dev/null || warn "Không cài được $name — chạy thủ công sau."
  else
    npx skills add "$source" --agent claude-code --yes --copy 2>/dev/null || warn "Không cài được $name — chạy thủ công sau."
  fi
}

install_skill "frontend-design"       "https://github.com/anthropics/skills"       "frontend-design"
install_skill "superpowers"           "obra/superpowers"                           ""
install_skill "wrangler"              "https://github.com/cloudflare/skills"       "wrangler"
install_skill "workers-best-practices" "https://github.com/cloudflare/cloudflare-docs" "workers-best-practices"
install_skill "cloudflare"            "https://github.com/cloudflare/cloudflare-docs" "cloudflare"

# ============================================================
step "7/8  Cài đặt GitNexus (code intelligence)"
# ============================================================

if ! command -v gitnexus &>/dev/null; then
  info "Đang cài GitNexus..."
  npm install -g gitnexus 2>/dev/null || bun add -g gitnexus 2>/dev/null || warn "Không cài được gitnexus."
fi

if command -v gitnexus &>/dev/null; then
  info "Đánh index codebase..."
  npx gitnexus analyze 2>/dev/null || true
fi

# ============================================================
step "8/8  Hoàn tất!"
# ============================================================

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       Cài đặt xong! Sẵn sàng rồi!      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "  📁 Thư mục app: $(pwd)"
echo ""
echo "  👉 Bước tiếp theo — chạy 2 lệnh này:"
echo ""
echo "     cd $(pwd)"
echo "     claude"
echo ""
echo "  Sau đó mô tả app bạn muốn làm, AI sẽ lo phần còn lại!"
echo ""
