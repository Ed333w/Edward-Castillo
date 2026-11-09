#!/usr/bin/env bash
# ============================================================
#  Laboratorio integrador · Corte 3 · Algoritmos y Estructura de Datos
#  Uso:   bash verificar.sh          (los cuatro retos)
#         bash verificar.sh R3       (solo uno)
# ============================================================
cd "$(dirname "$0")" || exit 1
PY=$(command -v python3 || command -v python)
GXX=$(command -v g++)
LISTA=${1:-"R1 R2 R3 R4"}

for R in $LISTA; do
  echo ""
  echo "============================================================"
  echo "  $R"
  echo "============================================================"
  case $R in
    R1) [ -z "$PY" ] && { echo "  No se encontro python3."; continue; }
        ( cd R1 && "$PY" pruebas_r1.py ) ;;
    R3) [ -z "$PY" ] && { echo "  No se encontro python3."; continue; }
        ( cd R3 && "$PY" pruebas_r3.py ) ;;
    R2) [ -z "$GXX" ] && { echo "  No se encontro g++."; continue; }
        ( cd R2 && "$GXX" -std=c++17 -g -o pruebas_r2 balanceo.cpp pruebas_r2.cpp \
            && ./pruebas_r2 || echo "  [FALLA] el codigo no compila" ) ;;
    R4) [ -z "$GXX" ] && { echo "  No se encontro g++."; continue; }
        ( cd R4 && "$GXX" -std=c++17 -g -o pruebas_r4 conectividad.cpp pruebas_r4.cpp \
            && ./pruebas_r4 || echo "  [FALLA] el codigo no compila" ) ;;
    *)  echo "  Reto desconocido: $R" ;;
  esac
done
echo ""
echo "============================================================"
echo "  Copie los codigos de cierre en su hoja de respuestas."
echo "============================================================"
