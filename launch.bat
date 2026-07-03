@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Starting Git Manager...
start "" /min node server.js
timeout /t 2 /nobreak >nul
start http://localhost:3000
echo Done!
