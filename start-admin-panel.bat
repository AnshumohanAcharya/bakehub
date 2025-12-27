@echo off
echo ========================================
echo Starting BakeHub Admin Panel
echo ========================================
echo.

echo [1/3] Starting Backend Server...
start "BakeHub Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Server...
start "BakeHub Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Browser...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo Admin Panel Starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Login with: admin@bakehub.com
echo.
echo Two command windows will open:
echo - Backend server (port 5000)
echo - Frontend server (port 5173)
echo.
echo Browser will open automatically in 5 seconds...
echo.
pause


