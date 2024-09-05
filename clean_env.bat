@echo off
for /D %%d in (apps\*) do (
    if exist "%%d\.env" del /Q "%%d\.env"
    if exist "%%d\.dev.vars" del /Q "%%d\.dev.vars"
)