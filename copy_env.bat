@echo off
for /D %%d in (apps\*) do (
    copy /Y .env "%%d\.env"
    echo Copied .env to %%d\.env
    copy /Y .env "%%d\.dev.vars"
    echo Copied .env to %%d\.dev.vars
)