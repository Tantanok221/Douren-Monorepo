#!/bin/bash

# ============================================================================
# Douren Monorepo - Git Worktree Management Script
# ============================================================================
# Simplifies git worktree workflow by combining worktree creation with setup.
#
# Usage:
#   ./scripts/worktree.sh <command> [options]
#
# Commands:
#   create <path> <branch>    Create a new worktree and set it up
#   add <path> <branch>       Alias for create
#   setup                     Run setup in current worktree
#   list                      List all worktrees
#   remove <path>             Remove a worktree
#   clean                     Remove all worktrees except main
#
# Examples:
#   ./scripts/worktree.sh create ../feature-auth feature/user-auth
#   ./scripts/worktree.sh create ../bugfix bugfix/login-issue -b  # create new branch
#   ./scripts/worktree.sh list
#   ./scripts/worktree.sh remove ../feature-auth
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

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

show_help() {
    head -27 "$0" | tail -24
    exit 0
}

# ============================================================================
# Create/Add Worktree
# ============================================================================
cmd_create() {
    local WORKTREE_PATH=""
    local BRANCH_NAME=""
    local CREATE_BRANCH=false
    local QUICK_SETUP=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -b|--new-branch)
                CREATE_BRANCH=true
                shift
                ;;
            --quick)
                QUICK_SETUP=true
                shift
                ;;
            --help)
                echo "Usage: worktree.sh create <path> <branch> [-b|--new-branch] [--quick]"
                echo ""
                echo "Options:"
                echo "  -b, --new-branch   Create a new branch from current HEAD"
                echo "  --quick            Skip building packages after setup"
                exit 0
                ;;
            *)
                if [ -z "$WORKTREE_PATH" ]; then
                    WORKTREE_PATH="$1"
                elif [ -z "$BRANCH_NAME" ]; then
                    BRANCH_NAME="$1"
                fi
                shift
                ;;
        esac
    done

    if [ -z "$WORKTREE_PATH" ] || [ -z "$BRANCH_NAME" ]; then
        log_error "Missing required arguments"
        echo "Usage: worktree.sh create <path> <branch> [-b|--new-branch]"
        exit 1
    fi

    # Resolve to absolute path
    WORKTREE_PATH="$(cd "$(dirname "$WORKTREE_PATH")" 2>/dev/null && pwd)/$(basename "$WORKTREE_PATH")" || WORKTREE_PATH="$(pwd)/$WORKTREE_PATH"

    log_step "Creating worktree at: $WORKTREE_PATH"
    log_info "Branch: $BRANCH_NAME"

    # Create the worktree
    if [ "$CREATE_BRANCH" = true ]; then
        log_info "Creating new branch..."
        git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH"
    else
        git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
    fi
    log_success "Worktree created"

    # Change to the worktree directory
    cd "$WORKTREE_PATH"

    log_step "Setting up worktree environment..."

    # Run the setup script
    if [ "$QUICK_SETUP" = true ]; then
        ./setup.sh --quick
    else
        ./setup.sh
    fi

    echo ""
    echo -e "${GREEN}============================================================================${NC}"
    echo -e "${GREEN}Worktree Ready!${NC}"
    echo -e "${GREEN}============================================================================${NC}"
    echo ""
    echo "Worktree location: $WORKTREE_PATH"
    echo ""
    echo "To start working:"
    echo "  cd $WORKTREE_PATH"
    echo "  pnpm run dev"
    echo ""
}

# ============================================================================
# List Worktrees
# ============================================================================
cmd_list() {
    log_step "Git Worktrees"
    echo ""
    git worktree list
    echo ""
}

# ============================================================================
# Remove Worktree
# ============================================================================
cmd_remove() {
    local WORKTREE_PATH="$1"
    local FORCE=false

    if [ "$2" = "-f" ] || [ "$2" = "--force" ]; then
        FORCE=true
    fi

    if [ -z "$WORKTREE_PATH" ]; then
        log_error "Missing worktree path"
        echo "Usage: worktree.sh remove <path> [-f|--force]"
        exit 1
    fi

    log_step "Removing worktree: $WORKTREE_PATH"

    if [ "$FORCE" = true ]; then
        git worktree remove "$WORKTREE_PATH" --force
    else
        git worktree remove "$WORKTREE_PATH"
    fi

    log_success "Worktree removed"
}

# ============================================================================
# Clean All Worktrees
# ============================================================================
cmd_clean() {
    log_step "Cleaning up worktrees..."

    echo ""
    log_warn "This will remove ALL worktrees except the main one."
    log_warn "Make sure you have committed and pushed any changes."
    echo ""
    read -p "Are you sure? (y/N) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Aborted"
        exit 0
    fi

    # Get the main worktree (first one is usually the main)
    MAIN_WORKTREE=$(git worktree list --porcelain | grep "^worktree " | head -1 | cut -d' ' -f2)

    # Prune stale worktrees first
    git worktree prune

    # List and remove other worktrees
    git worktree list --porcelain | grep "^worktree " | cut -d' ' -f2 | while read -r worktree; do
        if [ "$worktree" != "$MAIN_WORKTREE" ]; then
            log_info "Removing: $worktree"
            git worktree remove "$worktree" --force 2>/dev/null || true
        fi
    done

    log_success "Cleanup complete"
    echo ""
    cmd_list
}

# ============================================================================
# Setup Current Directory
# ============================================================================
cmd_setup() {
    local QUICK=false

    if [ "$1" = "--quick" ]; then
        QUICK=true
    fi

    if [ ! -f "setup.sh" ]; then
        log_error "setup.sh not found. Are you in the repository root?"
        exit 1
    fi

    if [ "$QUICK" = true ]; then
        ./setup.sh --quick
    else
        ./setup.sh
    fi
}

# ============================================================================
# Main
# ============================================================================
COMMAND="${1:-}"
shift 2>/dev/null || true

case "$COMMAND" in
    create|add)
        cmd_create "$@"
        ;;
    list|ls)
        cmd_list
        ;;
    remove|rm)
        cmd_remove "$@"
        ;;
    clean)
        cmd_clean
        ;;
    setup)
        cmd_setup "$@"
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        show_help
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        echo "Use 'worktree.sh help' for usage information"
        exit 1
        ;;
esac
