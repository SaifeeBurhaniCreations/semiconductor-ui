@echo off

REM
if "%~1"=="" (
    echo Usage: auto_commit.bat "commit message"
    exit /b 1
)

set MESSAGE=%*

git add .
git commit -m "auto: %MESSAGE%"
git pull