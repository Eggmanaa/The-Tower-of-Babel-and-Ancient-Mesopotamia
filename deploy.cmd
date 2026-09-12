@echo off
setlocal
REM ============================================================
REM  The Tower of Babel - one-click publish
REM  Double-click this file. It commits your changes and pushes
REM  them to GitHub. Cloudflare Pages is connected to the repo and
REM  redeploys automatically about 1-3 minutes after every push:
REM      https://thetowerofbabel.pages.dev
REM  Build progress: Cloudflare dashboard > Workers & Pages > thetowerofbabel
REM ============================================================

cd /d "%~dp0"

echo.
echo ===== 1/2  GitHub login =====
gh auth status >nul 2>&1
if errorlevel 1 (
    echo Not logged in to GitHub - a browser window will open.
    gh auth login -h github.com -p https -w
    if errorlevel 1 goto :fail
)

echo.
echo ===== 2/2  Commit and push =====
git add -A
git diff --cached --quiet
if errorlevel 1 (
    for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set TODAY=%%a-%%b-%%c
    git commit -q -m "Update %TODAY% %time:~0,5%"
    echo Committed changes.
) else (
    echo Nothing new to commit - pushing anyway.
)
git push -u origin main
if errorlevel 1 goto :fail

echo.
echo ================================================
echo   Pushed!  Cloudflare is now rebuilding the site.
echo   In a few minutes play it at:
echo   https://thetowerofbabel.pages.dev
echo ================================================
echo.
pause
exit /b 0

:fail
echo.
echo *** Something went wrong - read the message above, then run this file again. ***
echo.
pause
exit /b 1
