@echo off
setlocal
REM Ludikids • Dev Runner (Windows)
powershell -ExecutionPolicy Bypass -File "%~dp0run.ps1" %*
endlocal

