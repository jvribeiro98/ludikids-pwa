@echo off
setlocal
REM Ludikids • Build Runner (Windows)
powershell -ExecutionPolicy Bypass -File "%~dp0build.ps1" %*
endlocal

