@echo off
setlocal
REM ============================================================
REM  The Tower of Babel - one-click publish
REM  Double-click this file. It will:
REM    1. log you in to GitHub / Cloudflare if needed (browser opens)
REM    2. create the GitHub repo the first time
REM    3. commit + push everything to GitHub
REM    4. deploy the site to Cloudflare Pages -> thetowerofbabel.pages.dev
REM ============================================================

cd /d "%~dp0"
set PROJECT=thetowerofbabel
set REPO=The-Tower-of-Babel-and-Ancient-Mesopotamia

echo.
echo ===== 1/4  GitHub login =====
gh auth status >nul 2>&1
if errorlevel 1 (
    echo Not logged in to GitHub - a browser window will open.
    gh auth login -h github.com -p https -w
    if errorlevel 1 goto :fail
)

echo.
echo ===== 2/4  Commit and push to GitHub =====
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo First run: creating the GitHub repository "%REPO%"...
    gh repo create "%REPO%" --public --source=. --remote=origin
    if errorlevel 1 goto :fail
)
git add -A
git diff --cached --quiet
if errorlevel 1 (
    for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set TODAY=%%a-%%b-%%c
    git commit -q -m "Update %TODAY% %time:~0,5%"
)
git push -u origin main
if errorlevel 1 goto :fail

echo.
echo ===== 3/4  Cloudflare login =====
call npx wrangler whoami 2>&1 | findstr /i "You are logged in" >nul
if errorlevel 1 (
    echo Not logged in to Cloudflare - a browser window will open.
    call npx wrangler login
    if errorlevel 1 goto :fail
)

echo.
echo ===== 4/4  Deploy to Cloudflare Pages =====
REM create the project the first time (harmless if it already exists)
call npx wrangler pages project create %PROJECT% --production-branch main >nul 2>&1
call npx wrangler pages deploy . --project-name %PROJECT% --branch main --commit-dirty=true
if errorlevel 1 goto :fail

echo.
echo ================================================
echo   Done!  Play it at https://%PROJECT%.pages.dev
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
