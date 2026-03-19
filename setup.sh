#!/bin/bash
set -e

# selfapp — One-line setup
# Chay: curl -fsSL https://raw.githubusercontent.com/aiocean/selfapp/main/template/setup.sh | bash
# Hoac: bash setup.sh ten-app-cua-toi

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[+]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[x]${NC} $1"; exit 1; }

# --- 1. Install Bun ---
if ! command -v bun &>/dev/null; then
  info "Cai dat Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
info "Bun $(bun --version)"

# --- 2. Check Git ---
if ! command -v git &>/dev/null; then
  error "Chua co Git. Vui long cai Git truoc: https://git-scm.com"
fi

# --- 3. Clone repo ---
APP_DIR="${1:-my-selfapp}"

if [ -d "$APP_DIR" ]; then
  warn "Thu muc '$APP_DIR' da ton tai. Su dung thu muc hien co."
else
  info "Tai template ve thu muc '$APP_DIR'..."
  git clone --depth 1 https://github.com/aiocean/selfapp.git "$APP_DIR"
fi

cd "$APP_DIR/template"

# --- 4. Install project dependencies ---
info "Cai dat dependencies..."
bun install

# --- 5. Install oh-my-claudecode (AI orchestration) ---
info "Cai dat oh-my-claudecode..."
bun add -g oh-my-claude-sisyphus 2>/dev/null || npm install -g oh-my-claude-sisyphus 2>/dev/null || {
  warn "Khong cai duoc qua bun/npm. Thu cach khac..."
  curl -fsSL https://raw.githubusercontent.com/yeachan-heo/oh-my-claudecode/main/install.sh | bash
}

# Run omc setup to install all components (skills, agents, hooks, MCP)
if command -v omc &>/dev/null; then
  info "Cai dat OMC components (skills, agents, hooks, MCP)..."
  omc setup --force 2>/dev/null || omc install 2>/dev/null || warn "omc setup that bai. Chay 'omc setup' thu cong sau."
else
  warn "Khong tim thay lenh 'omc'. Chay 'omc setup' thu cong sau khi restart terminal."
fi

# --- 6. Install gitnexus (code intelligence) ---
if ! command -v gitnexus &>/dev/null; then
  info "Cai dat GitNexus..."
  bun add -g gitnexus 2>/dev/null || npm install -g gitnexus 2>/dev/null || warn "Khong cai duoc gitnexus. Chay: npm install -g gitnexus"
fi

# --- 7. Setup local database ---
info "Tao database cuc bo..."
bun run db:migrate 2>/dev/null || warn "Chua tao duoc database. Chay 'bun run db:migrate' sau."

# --- 8. Index codebase ---
if command -v gitnexus &>/dev/null; then
  info "Index codebase..."
  npx gitnexus analyze 2>/dev/null || true
fi

# --- 9. Done ---
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup xong!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "  Thu muc: $(pwd)"
echo ""
echo "  Buoc tiep theo:"
echo "    cd $(pwd) && claude"
echo ""
echo "  Cac lenh co ban:"
echo "    bun run dev        — Chay app tren may"
echo "    bun run deploy     — Dua app len mang"
echo "    omc doctor         — Kiem tra OMC hoat dong dung"
echo ""
echo "  Mo ta app ban muon lam, AI se lo phan con lai!"
echo ""
