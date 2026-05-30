@echo off
setlocal
echo Starting Build and Deployment to Cloudflare Pages...

echo Step 1: Building project with Vite...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed.
    pause
    exit /b %errorlevel%
)

echo Step 2: Deploying to Cloudflare Pages...
call npx wrangler pages deploy dist
if %errorlevel% neq 0 (
    echo Error: Cloudflare deployment failed.
    echo Tip: Make sure you are logged into Wrangler (npx wrangler login).
    pause
    exit /b %errorlevel%
)

echo Deployment successful!
pause
exit /b 0
