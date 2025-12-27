@echo off
echo ========================================
echo Creating Super Admin User
echo ========================================
echo.

cd backend

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Checking .env file...
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please configure backend\.env first
    echo.
    pause
    exit /b 1
)

echo Creating super admin user...
echo.
call npm run create-admin

echo.
echo ========================================
echo Admin User Created!
echo ========================================
echo.
echo You can now login with:
echo Email: admin@bakehub.com
echo.
echo Steps to access admin panel:
echo 1. Start backend: cd backend ^&^& npm run dev
echo 2. Start frontend: cd frontend ^&^& npm run dev
echo 3. Go to http://localhost:5173
echo 4. Login with admin@bakehub.com
echo 5. Click profile icon -^> Admin Panel
echo.
pause


