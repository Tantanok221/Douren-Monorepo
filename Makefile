# Detect the operating system
ifeq ($(OS),Windows_NT)
    detected_OS := Windows
else
    detected_OS := $(shell uname -s)
endif

# Python executable
PYTHON := python
all: copy-env
.PHONY: copy-env

create-vault:
	npx dotenv-vault new
	npx dotenv-vault login
	npx dotenv-vault push

redis:
	docker run \
        -it -d -p 8080:80 --name srh \
        -e SRH_MODE=env \
        -e SRH_TOKEN=admin \
        -e SRH_CONNECTION_STRING="redis://localhost:6379" \
        hiett/serverless-redis-http:latest

test-stg-deployment:
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

copy-env:
	@echo "Detected OS: $(detected_OS)"
ifeq ($(detected_OS),Windows)
	@echo "Running Windows batch file..."
	@cmd /c copy_env.bat
else
	@echo "Merging and copying environment files..."
	# Merge base .env with .env.be into backend directories, but don't modify .env
	@for dir in be/*; do \
		if [ -d "$$dir" ]; then \
	        cp .env "$$dir/.env"; \
	        cp .env "$$dir/.dev.vars"; \
		fi; \
	done
	# Merge base .env with .env.fe into frontend directories, but don't modify .env
	@for dir in fe/*; do \
		if [ -d "$$dir" ]; then \
	        cp .env "$$dir/.env"; \
		fi; \
	done
	# Only copy .env to lib directories (do not merge or modify it)
	@for dir in lib/*; do \
		if [ -d "$$dir" ]; then \
			cp .env "$$dir/.env"; \
		fi; \
	done
	# Only copy .env to pkg directories (do not merge or modify it)
	@for dir in pkg/*; do \
		if [ -d "$$dir" ]; then \
			cp .env "$$dir/.env"; \
		fi; \
	done
	@rm -f .env.temp
	npx turbo build --filter="./pkg/env"
	npm install
	@echo "Environment files merged and copied successfully."
	@echo "TypeScript constants file generated in pkg/env/src/index.ts"
endif

# Help target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  help  - Show this help message"
	@echo "  copy-env - Copy environment files to backend, frontend, and package directories"