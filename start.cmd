@echo off
cd /d "%~dp0"
if not exist "node_modules" (
  echo Dependencies not found. Installing...
  call npm.cmd install
  if errorlevel 1 pause & exit /b 1
)
echo Starting Practice 5 - Ledenev Gleb
echo URL: http://localhost:8080
call npm.cmd start
pause
