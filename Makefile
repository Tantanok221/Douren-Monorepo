# Detect OS
ifeq ($(OS),Windows_NT)
    COPY_ENV_CMD = copy_env.bat
else
    # Copy to immediate subdirectories only
    COPY_ENV_CMD = \
        for dir in pkg/* fe/* be/* lib/*; do \
            if [ -d "$$dir" ]; then \
                cp .env "$$dir/.env"; \
                echo "Copied to $$dir/.env"; \
            fi \
        done
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
	@echo "Copying .env files to immediate subdirectories..."
ifeq ($(OS),Windows_NT)
	@cmd /C $(COPY_ENV_CMD)
else
	@mkdir -p ./pkg ./fe ./be ./lib
	@$(COPY_ENV_CMD)
endif
	@echo "Environment files copied successfully!"

# Help target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  help  - Show this help message"
	@echo "  copy-env - Copy environment files to backend, frontend, and package directories"
