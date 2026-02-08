@echo off
echo ========================================
echo   DEPLOIEMENT GITHUB PAGES
echo ========================================
echo.

REM Verification de git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Git n'est pas installe!
    echo Installez Git depuis: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Verification de node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe!
    pause
    exit /b 1
)

echo [1/6] Verification du depot Git...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Initialisation de Git...
    git init
    git branch -M main
)

echo.
echo [2/6] Installation des dependances...
if not exist "node_modules\" (
    call npm install
)

echo.
echo [3/6] Ajout des fichiers...
git add .

echo.
echo [4/6] Creation du commit...
set /p commit_msg="Entrez un message de commit (ou Entree pour message par defaut): "
if "%commit_msg%"=="" set commit_msg=Update Hospifinance
git commit -m "%commit_msg%"

echo.
echo [5/6] Push vers GitHub main...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ATTENTION: Le push a echoue.
    echo Verifiez que vous avez configure le remote:
    echo   git remote add origin https://github.com/VOTRE-USERNAME/hospifinance.git
    echo.
    pause
    exit /b 1
)

echo.
echo [6/6] Deploiement sur GitHub Pages...
call npm run deploy

if %errorlevel% neq 0 (
    echo.
    echo ERREUR lors du deploiement!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE!
echo ========================================
echo.
echo Votre site sera disponible dans 1-2 minutes sur:
echo https://VOTRE-USERNAME.github.io/hospifinance/
echo.
echo Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub.
echo.
pause
