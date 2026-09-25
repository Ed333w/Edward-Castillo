#!/bin/bash
# TCK-4422 · verificacion
g++ -std=c++17 -fsanitize=address -g -o catalogo catalogo.cpp 2>/dev/null || { echo "  [FALLA] no compila"; exit 1; }
SAL=$(./catalogo 2>/dev/null)
OK=1
echo "$SAL" | grep -q "Libro LF-002 de Borges"  || { echo "  [FALLA] falta la descripcion de LibroFisico"; OK=0; }
echo "$SAL" | grep -q "Equipo EQ-003 (12h)"     || { echo "  [FALLA] falta la descripcion de Equipo"; OK=0; }
echo "$SAL" | grep -q "Recurso generico RG-001" || { echo "  [FALLA] falta el recurso generico"; OK=0; }
echo "$SAL" | grep -q "\[PRESTADO\]"            || { echo "  [FALLA] ningun recurso figura como prestado"; OK=0; }
FUGAS=$(./catalogo 2>&1 | grep -c "ERROR: AddressSanitizer")
[ "$FUGAS" -eq 0 ] || { echo "  [FALLA] el sanitizer reporta problemas de memoria"; OK=0; }
if [ "$OK" -eq 1 ]; then
  echo "$SAL"
  echo ""
  N=$(echo "$SAL" | grep -c "")
  P=$(echo "$SAL" | grep -c "PRESTADO")
  H=$(echo "$SAL" | grep -o "([0-9]*h)" | grep -o "[0-9]*")
  echo "  TICKET CERRADO — codigo de cierre: 4422-${N}${P}${H}"
else
  echo "  Ticket ABIERTO. Corrija y vuelva a ejecutar."
fi
