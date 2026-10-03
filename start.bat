@echo off
cd /d "%~dp0"
title Drukspil - server
echo.
echo   Drukspil - lokal server
echo   ----------------------------------
echo   Adresse: http://127.0.0.1:3002
echo   (brug 127.0.0.1, ikke localhost: Spotify-login i Hitster kraever det)
echo   Paa telefonen (samme wifi): http://DIN-PC-IP:3002
echo   Stop:    luk dette vindue eller tryk Ctrl+C
echo.
start "" "http://127.0.0.1:3002"
where python >nul 2>nul
if %errorlevel%==0 (
    python -m http.server 3002 --bind 0.0.0.0
) else (
    py -m http.server 3002 --bind 0.0.0.0
)
