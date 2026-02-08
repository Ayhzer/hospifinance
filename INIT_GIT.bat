@echo off
echo ========================================
echo   INITIALISATION GIT & GITHUB
echo ========================================
echo.

REM Verification de git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Git n'est pas installe!
    echo.
    echo Installez Git depuis: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Git detecte:
git --version
echo.

REM Demander le username GitHub
set /p github_user="Entrez votre nom d'utilisateur GitHub: "
if "%github_user%"=="" (
    echo ERREUR: Le nom d'utilisateur est requis!
    pause
    exit /b 1
)

echo.
echo Configuration pour l'utilisateur: %github_user%
echo.

REM Initialiser Git si necessaire
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/5] Initialisation de Git...
    git init
    git branch -M main
) else (
    echo [1/5] Git deja initialise.
)

echo.
echo [2/5] Ajout des fichiers...
git add .

echo.
echo [3/5] Creation du premier commit...
git commit -m "Initial commit - Hospifinance v2.0 optimise"

echo.
echo [4/5] Ajout du depot distant...
git remote remove origin 2>nul
git remote add origin https://github.com/%github_user%/hospifinance.git

echo.
echo [5/5] Push vers GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   ERREUR lors du push!
    echo ========================================
    echo.
    echo Solutions possibles:
    echo.
    echo 1. Verifiez que le depot existe sur GitHub:
    echo    https://github.com/%github_user%/hospifinance
    echo.
    echo 2. Si le depot n'existe pas, creez-le sur GitHub:
    echo    - Allez sur https://github.com/new
    echo    - Repository name: hospifinance
    echo    - Public
    echo    - NE PAS initialiser avec README
    echo.
    echo 3. Configurez vos identifiants Git si necessaire:
    echo    git config --global user.name "Votre Nom"
    echo    git config --global user.email "votre@email.com"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCES!
echo ========================================
echo.
echo Le code est maintenant sur GitHub:
echo https://github.com/%github_user%/hospifinance
echo.
echo PROCHAINE ETAPE:
echo 1. Installez les dependances: npm install
echo 2. Deployez sur GitHub Pages: npm run deploy
echo    ou executez: DEPLOY_GITHUB.bat
echo.
echo Votre site sera alors accessible sur:
echo https://%github_user%.github.io/hospifinance/
echo.
pause
