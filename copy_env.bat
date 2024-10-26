@echo off
setlocal enabledelayedexpansion

echo Detected OS: Windows
echo Running Windows batch file...

:: Merge base .env with .env.be into backend directories
for /d %%d in (be\*) do (
    if exist "%%d" (
        copy /Y .env "%%d\.env"
        copy /Y .dev.vars"%%d\.env"
    )
)

:: Merge base .env with .env.fe into frontend directories
for /d %%d in (fe\*) do (
    if exist "%%d" (
        copy /Y .env "%%d\.env"
    )
)

:: Copy .env to pkg directories
for /d %%d in (pkg\*) do (
    if exist "%%d" (
        copy /Y .env "%%d\.env"
    )
)

:: Generate TypeScript interfaces
python merge_env.py .env .env.be .env.temp generate_ts
if exist .env.temp del .env.temp

:: Run turbo build and pnpm install
call npx turbo build --filter="./pkg/env"
call npm install

echo Environment files merged and copied successfully.
echo TypeScript constants file generated in pkg/env/src/index.ts