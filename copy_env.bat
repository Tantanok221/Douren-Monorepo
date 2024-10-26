@echo off
setlocal enabledelayedexpansion

echo Checking for .env file...
if not exist .env (
    echo Error: .env file not found in root directory!
    exit /b 1
)

echo Creating main directories if they don't exist...
if not exist pkg mkdir pkg
if not exist fe mkdir fe
if not exist be mkdir be
if not exist lib mkdir lib

echo Copying .env files to all workspaces and subdirectories...

for %%d in (pkg fe be lib) do (
    echo Processing %%d directory...
    for /f "tokens=*" %%i in ('dir /b /s /ad "%%d" ^| findstr /v /i "node_modules" ^| findstr /v /i "\.git"') do (
        echo Copying to: %%i
        copy /Y .env "%%i\.env" > nul
    )
)

echo Environment files copied successfully!
endlocal