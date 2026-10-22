@echo off
title APEX Ultra Highway Racing - Local Server
cd /d "%~dp0"
where py >nul 2>nul
if errorlevel 1 (
  echo Python launcher "py" was not found.
  echo Install free Python from https://www.python.org/downloads/ and enable Python in PATH.
  echo Then double-click START_GAME.bat again.
  pause
  exit /b 1
)
py run_game.py
pause