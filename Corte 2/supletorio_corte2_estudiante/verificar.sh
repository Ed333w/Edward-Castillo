#!/usr/bin/env bash
# ============================================================
#  Supletorio · Segundo corte · Algoritmos y Estructura de Datos
#  Uso:   bash verificar.sh          (los cinco ejercicios)
#         bash verificar.sh E3       (solo uno)
# ============================================================
cd "$(dirname "$0")" || exit 1
PY=$(command -v python3 || command -v python)
GXX=$(command -v g++)
LISTA=${1:-"E1 E2 E3 E4 E5"}

for E in $LISTA; do
  echo ""
  echo "============================================================"
  echo "  $E"
  echo "============================================================"
  case $E in
    E1) [ -z "$PY" ] && { echo "  No se encontro python3."; continue; }
        ( cd E1 && "$PY" pruebas_e1.py ) ;;
    E3) [ -z "$PY" ] && { echo "  No se encontro python3."; continue; }
        ( cd E3 && "$PY" pruebas_e3.py ) ;;
    E5) [ -z "$PY" ] && { echo "  No se encontro python3."; continue; }
        ( cd E5 && "$PY" pruebas_e5.py ) ;;
    E2) [ -z "$GXX" ] && { echo "  No se encontro g++."; continue; }
        ( cd E2 && "$GXX" -std=c++17 -O1 -g -o pruebas_e2 rangos.cpp pruebas_e2.cpp \
            && ./pruebas_e2 || echo "  [FALLA] el codigo no compila" ) ;;
    E4) [ -z "$GXX" ] && { echo "  No se encontro g++."; continue; }
        ( cd E4 && "$GXX" -std=c++17 -g -o pruebas_e4 turnos.cpp pruebas_e4.cpp \
            && ./pruebas_e4 || echo "  [FALLA] el codigo no compila" ) ;;
    *)  echo "  Ejercicio desconocido: $E" ;;
  esac
done
echo ""
echo "============================================================"
echo "  Copie los codigos de cierre en su hoja de respuestas."
echo "============================================================"
