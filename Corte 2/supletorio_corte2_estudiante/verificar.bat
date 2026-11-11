@echo off
REM ============================================================
REM  Supletorio . Segundo corte . Algoritmos y Estructura de Datos
REM  Uso:   verificar.bat          (los cinco ejercicios)
REM         verificar.bat E3       (solo uno)
REM ============================================================
setlocal
cd /d "%~dp0"
set LISTA=%1
if "%LISTA%"=="" set LISTA=E1 E2 E3 E4 E5

where python >nul 2>&1 && (set PY=python) || (set PY=py)
where g++ >nul 2>&1 || echo   AVISO: no se encontro g++ en el PATH. Los ejercicios E2 y E4 no se podran compilar.

for %%E in (%LISTA%) do (
  echo.
  echo ============================================================
  echo   %%E
  echo ============================================================
  if /I "%%E"=="E1" ( pushd E1 & %PY% pruebas_e1.py & popd )
  if /I "%%E"=="E3" ( pushd E3 & %PY% pruebas_e3.py & popd )
  if /I "%%E"=="E5" ( pushd E5 & %PY% pruebas_e5.py & popd )
  if /I "%%E"=="E2" ( pushd E2 & g++ -std=c++17 -O1 -g -o pruebas_e2.exe rangos.cpp pruebas_e2.cpp && pruebas_e2.exe || echo   [FALLA] el codigo no compila & popd )
  if /I "%%E"=="E4" ( pushd E4 & g++ -std=c++17 -g -o pruebas_e4.exe turnos.cpp pruebas_e4.cpp && pruebas_e4.exe || echo   [FALLA] el codigo no compila & popd )
)
echo.
echo ============================================================
echo   Copie los codigos de cierre en su hoja de respuestas.
echo ============================================================
endlocal
