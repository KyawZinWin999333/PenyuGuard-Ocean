@echo off
cd /d "%~dp0"
echo.
echo =========================================================
echo       PENYUGUARD - OCEAN GALLERY V6 - BILINGUAL EN / BM - WINDOWS READY
 echo =========================================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 18 or later is required.
  echo Download Node.js from https://nodejs.org/
  pause
  exit /b 1
)
if not exist "package.json" (
 echo ERROR: package.json was not found in this folder.
 echo Please open the extracted ZIP folder and run START_HERE_WINDOWS.bat there.
 pause
 exit /b 1
)
echo Starting local web server on http://127.0.0.1:5186/
echo Original QHD film, five photos, English and Bahasa Melayu are bundled.
start "PenyuGuard Ocean Gallery V6 Server" cmd /k "node serve.mjs"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5186/"
echo.
echo Keep the server window open while presenting PenyuGuard.
pause
