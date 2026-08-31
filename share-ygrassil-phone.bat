@echo off
setlocal

cd /d "%~dp0"

echo.
echo YGRASSIL phone sharing
echo =====================
echo.
echo Starting the local app...
start "Ygrassil Vite Server" /min "%ComSpec%" /c "cd /d ""%~dp0"" && call npm.cmd run dev -- --host 0.0.0.0 --port 5173"

timeout /t 3 /nobreak >nul

echo.
echo Creating a temporary public link...
echo Keep this window open while testing.
echo.
call npx.cmd --yes localtunnel --port 5173

echo.
echo Sharing stopped.
pause
