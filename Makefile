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
