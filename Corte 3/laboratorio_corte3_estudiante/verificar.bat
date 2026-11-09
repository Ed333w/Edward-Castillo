@echo off
REM ============================================================
REM  Laboratorio integrador . Corte 3 . Algoritmos y Estructura de Datos
REM  Uso:   verificar.bat          (los cuatro retos)
REM         verificar.bat R3       (solo uno)
REM ============================================================
setlocal
cd /d "%~dp0"
set LISTA=%1
if "%LISTA%"=="" set LISTA=R1 R2 R3 R4

where python >nul 2>&1 && (set PY=python) || (set PY=py)
where g++ >nul 2>&1 || echo   AVISO: no se encontro g++ en el PATH. Los retos R2 y R4 no se podran compilar.

for %%R in (%LISTA%) do (
  echo.
  echo ============================================================
  echo   %%R
  echo ============================================================
  if /I "%%R"=="R1" ( pushd R1 & %PY% pruebas_r1.py & popd )
  if /I "%%R"=="R3" ( pushd R3 & %PY% pruebas_r3.py & popd )
  if /I "%%R"=="R2" ( pushd R2 & g++ -std=c++17 -g -o pruebas_r2.exe balanceo.cpp pruebas_r2.cpp && pruebas_r2.exe || echo   [FALLA] el codigo no compila & popd )
  if /I "%%R"=="R4" ( pushd R4 & g++ -std=c++17 -g -o pruebas_r4.exe conectividad.cpp pruebas_r4.cpp && pruebas_r4.exe || echo   [FALLA] el codigo no compila & popd )
)
echo.
echo ============================================================
echo   Copie los codigos de cierre en su hoja de respuestas.
echo ============================================================
endlocal
