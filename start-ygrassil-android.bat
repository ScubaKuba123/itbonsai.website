@echo off
setlocal

cd /d "%~dp0"

echo.
echo YGRASSIL phone preview
echo =====================
echo.
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /R /C:"IPv4 Address" /C:"IPv4-Adresse"') do (
  for /f "tokens=*" %%B in ("%%A") do echo Open on your Android phone: http://%%B:5173/ygrassil/
)
echo.
echo Keep this window open while testing.
echo Both devices must be connected to the same Wi-Fi network.
echo Press Ctrl+C to stop the server.
echo.

call npm.cmd run dev -- --host 0.0.0.0 --port 5173

echo.
echo Server stopped.
pause
