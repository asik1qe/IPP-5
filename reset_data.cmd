@echo off
chcp 65001 >nul
cd /d "%~dp0"
copy /Y data\contacts.seed.json data\contacts.json >nul
echo Данные практической №5 восстановлены.
pause
