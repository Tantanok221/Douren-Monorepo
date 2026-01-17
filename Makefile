# Detect the operating system
ifeq ($(OS),Windows_NT)
    detected_OS := Windows
else
    detected_OS := $(shell uname -s)
endif

# Python executable
PYTHON := python

# ============================================================================
# Setup and Environment
# ============================================================================
.PHONY: all setup copy-env worktree-create worktree-list worktree-remove

all: copy-env

# Full setup - run this after cloning or creating a worktree
setup:
	@./setup.sh

# Quick setup - skip building packages
setup-quick:
	@./setup.sh --quick

# Copy environment variables from Infisical to .env file
copy-env:
	@echo "Pulling environment variables from Infisical..."
	@npm run env:pull || echo "Warning: Could not pull env from Infisical. Run 'npm run env:login' first."

# ============================================================================
# Git Worktree Management
# ============================================================================
# Usage: make worktree-create PATH=../my-feature BRANCH=feature/my-feature
# Add NEW=1 to create a new branch: make worktree-create PATH=../my-feature BRANCH=feature/my-feature NEW=1
worktree-create:
ifndef PATH
	$(error PATH is required. Usage: make worktree-create PATH=../my-feature BRANCH=feature/my-feature)
endif
ifndef BRANCH
	$(error BRANCH is required. Usage: make worktree-create PATH=../my-feature BRANCH=feature/my-feature)
endif
ifdef NEW
	@./scripts/worktree.sh create $(PATH) $(BRANCH) -b
else
	@./scripts/worktree.sh create $(PATH) $(BRANCH)
endif

worktree-list:
	@git worktree list

worktree-remove:
ifndef PATH
	$(error PATH is required. Usage: make worktree-remove PATH=../my-feature)
endif
	@./scripts/worktree.sh remove $(PATH)

worktree-clean:
	@./scripts/worktree.sh clean

# ============================================================================
# Vault Management
# ============================================================================
create-vault:
	npx dotenv-vault new
	npx dotenv-vault login
	npx dotenv-vault push

st-stg-deployment:
	act --secret-file .env -j "stg-deploy"

test-prd-deployment:
	act --secret-file .env -j "prod-Deploy"

test-fe-stg-deployment:
	act --secret-file .env -j "fe-stg-deploy"

db-sync:
	from-env pg_dump %PRD_DATABASE_URL -Fc --schema=public --data-only -f data.dump
	from-env pg_dump %PRD_DATABASE_URL -Fc --schema=public --schema-only -f schema.dump
	from-env pg_restore -d %LOCAL_DATABASE_URL --schema-only --no-privileges -c schema.dump
	from-env pg_restore -d %LOCAL_DATABASE_URL --data-only --no-privileges data.dump
	rimraf schema.dump data.dump

stg-db-sync:
	from-env pg_dump %PRD_DATABASE_URL -Fc --schema=public --data-only -f data.dump
	from-env pg_dump %PRD_DATABASE_URL -Fc --schema=public --schema-only -f schema.dump
	from-env pg_restore -d %STG_DATABASE_URL --schema-only --no-privileges -c schema.dump
	from-env pg_restore -d %STG_DATABASE_URL --data-only --no-privileges data.dump
	rimraf schema.dump data.dump
