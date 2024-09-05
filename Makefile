# Makefile to copy .env to subdirectories as .dotenv and .dev.vars

ifeq ($(OS),Windows_NT)
    SHELL := cmd.exe
    COPY_CMD := call copy_env.bat
    CLEAN_CMD := call clean_env.bat
else
    COPY_CMD := for dir in apps/*/; do \
        cp .env "$$dir.env"; \
        echo "Copied .env to $$dir.env"; \
        cp .env "$$dir.dev.vars"; \
        echo "Copied .env to $$dir.dev.vars"; \
    done
    CLEAN_CMD := find apps -name ".env" -type f -delete && find apps -name ".dev.vars" -type f -delete
endif

# Default target
all: copy-env

# Check if .env exists
check-env:
ifeq ($(OS),Windows_NT)
	@if not exist .env (echo Error: .env file not found in the root directory & exit 1)
else
	@if [ ! -f ".env" ]; then echo "Error: .env file not found in the root directory"; exit 1; fi
endif

# Copy .env to subdirectories
copy-env: check-env
	@echo Copying files...
	@$(COPY_CMD)
	@echo Copying process completed

# Clean up (remove all .dotenv and .dev.vars files)
clean:
	@echo Cleaning up...
	@$(CLEAN_CMD)
	@echo Cleaned up .dotenv and .dev.vars files

.PHONY: all check-env copy-env clean