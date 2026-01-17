#!/bin/bash

# ============================================================================
# Douren Monorepo - Setup Script
# ============================================================================
# This script initializes a development environment, designed to work with
# both fresh clones and git worktrees.
#
# Usage:
#   ./setup.sh [options]
#
# Options:
#   --skip-env      Skip pulling environment variables from Infisical
#   --skip-build    Skip building packages (useful for quick setup)
#   --quick         Alias for --skip-build (minimal setup)
#   --no-version    Skip Node.js version check
#   --help          Show this help message
#
# For git worktree workflow:
#   git worktree add ../my-feature feature-branch
#   cd ../my-feature
#   ./setup.sh
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script options
SKIP_ENV=false
SKIP_BUILD=false
SKIP_VERSION_CHECK=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-env)
            SKIP_ENV=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --quick)
            SKIP_BUILD=true
            shift
            ;;
        --no-version)
            SKIP_VERSION_CHECK=true
            shift
            ;;
        --help)
            head -26 "$0" | tail -21
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Helper functions
log_step() {
    echo -e "\n${BLUE}==>${NC} ${GREEN}$1${NC}"
}

log_info() {
    echo -e "    ${BLUE}ℹ${NC} $1"
}

log_warn() {
    echo -e "    ${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "    ${RED}✖${NC} $1"
}

log_success() {
    echo -e "    ${GREEN}✔${NC} $1"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# ============================================================================
# Prerequisites Check
# ============================================================================
log_step "Checking prerequisites..."

# Check Node.js version
if ! command_exists node; then
    log_error "Node.js is not installed. Please install Node.js 22 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    if [ "$SKIP_VERSION_CHECK" = true ]; then
        log_warn "Node.js version 22+ recommended, but continuing with $(node -v) (--no-version flag)"
    else
        log_error "Node.js version 22 or higher is required. Current version: $(node -v)"
        log_info "Use --no-version flag to skip this check"
        exit 1
    fi
else
    log_success "Node.js $(node -v) detected"
fi

# Check pnpm version
if ! command_exists pnpm; then
    log_error "pnpm is not installed."
    log_info "Install pnpm: npm install -g pnpm"
    exit 1
fi
log_success "pnpm $(pnpm -v) detected"

# Check Infisical CLI (optional but recommended)
if ! command_exists infisical; then
    log_warn "Infisical CLI not found. Environment variables will need to be set manually."
    log_info "Install Infisical: https://infisical.com/docs/cli/overview"
    SKIP_ENV=true
else
    log_success "Infisical CLI detected"
fi

# ============================================================================
# Detect worktree environment
# ============================================================================
IS_WORKTREE=false
if [ -f ".git" ] && grep -q "gitdir:" ".git" 2>/dev/null; then
    IS_WORKTREE=true
    log_info "Git worktree detected"
else
    log_info "Standard git repository detected"
fi

# ============================================================================
# Install Dependencies
# ============================================================================
log_step "Installing dependencies..."

if [ -d "node_modules" ]; then
    log_info "node_modules exists, running pnpm install to update..."
else
    log_info "Installing fresh dependencies..."
fi

pnpm install
log_success "Dependencies installed"

# ============================================================================
# Setup Git Hooks (Husky)
# ============================================================================
log_step "Setting up Git hooks..."

# Husky prepare - this sets up the hooks
npx husky || true
log_success "Git hooks configured"

# ============================================================================
# Environment Variables
# ============================================================================
if [ "$SKIP_ENV" = false ]; then
    log_step "Setting up environment variables..."

    # Check if logged into Infisical
    if infisical export --format dotenv --env dev >/dev/null 2>&1; then
        log_info "Pulling environment variables from Infisical..."
        pnpm run env:pull
        log_success "Environment variables configured"
    else
        log_warn "Not logged into Infisical or cannot access workspace."
        log_info "Run 'pnpm run env:login' to authenticate, then 'pnpm run env:pull'"
        log_info "Creating placeholder .env file..."

        # Create placeholder .env if it doesn't exist
        if [ ! -f ".env" ]; then
            cat > .env << 'EOF'
# Placeholder environment file
# Run 'pnpm run env:login' followed by 'pnpm run env:pull' to populate
# Or manually configure your environment variables here
EOF
            log_success "Placeholder .env file created"
        fi
    fi
else
    log_step "Skipping environment setup (--skip-env flag)"
fi

# ============================================================================
# Build Packages
# ============================================================================
if [ "$SKIP_BUILD" = false ]; then
    log_step "Building packages in dependency order..."

    log_info "Building pkg/* packages..."
    pnpm run pkg

    log_info "Building lib/* libraries..."
    pnpm run lib

    log_info "Building be/* backend services..."
    pnpm run be

    log_success "All packages built successfully"

    # ============================================================================
    # Code Generation
    # ============================================================================
    log_step "Running code generation..."
    pnpm run codegen
    log_success "Code generation completed"
else
    log_step "Skipping package builds (--skip-build flag)"
    log_info "Run 'pnpm run all' later to build packages"
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo -e "${GREEN}============================================================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}============================================================================${NC}"
echo ""
echo "Next steps:"
echo ""

if [ "$SKIP_ENV" = true ] || ! infisical export --format dotenv --env dev >/dev/null 2>&1; then
    echo "  1. Configure environment variables:"
    echo "     pnpm run env:login    # Login to Infisical"
    echo "     pnpm run env:pull     # Pull environment variables"
    echo ""
fi

if [ "$SKIP_BUILD" = true ]; then
    echo "  2. Build packages:"
    echo "     pnpm run all          # Build all packages"
    echo "     pnpm run codegen      # Generate code/types"
    echo ""
fi

echo "  Start development:"
echo "     pnpm run dev      # Start all services"
echo "     pnpm run devfe    # Frontend only"
echo "     pnpm run devbe    # Backend only"
echo ""
echo "  Database operations:"
echo "     pnpm run db:migrate  # Run migrations"
echo "     pnpm run db:sync     # Sync production data"
echo ""

if [ "$IS_WORKTREE" = true ]; then
    echo -e "${BLUE}Worktree Tips:${NC}"
    echo "  - Each worktree has its own node_modules and .env"
    echo "  - Git hooks are shared with the main repository"
    echo "  - Use 'git worktree list' to see all worktrees"
    echo ""
fi
