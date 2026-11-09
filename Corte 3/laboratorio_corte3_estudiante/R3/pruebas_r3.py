# NO MODIFIQUE ESTE ARCHIVO. Alterarlo se considera fraude academico
# segun la seccion 13 de la guia de asignatura.
from rutas import NOMBRES, ARISTAS, N, construir, bfs, camino, por_niveles

def chk(nombre, fn, esperado):
    try:
        obtenido = fn()
    except Exception as ex:
        print(f"  [FALLA] {nombre}: lanzo {type(ex).__name__}")
        return False
    ok = obtenido == esperado
    print(f"  [{'OK ' if ok else 'FALLA'}] {nombre}: obtuvo {obtenido}")
    if not ok:
        print(f"          esperaba {esperado}")
    return ok

print("RETO 3 · rutas minimas (BFS) · verificacion")
r = []

r.append(chk("vecinos de ACOPIO", lambda: construir()[0], [1, 2, 3]))
r.append(chk("vecinos de PUERTO (ordenados)", lambda: construir()[7], [2, 4, 8]))
r.append(chk("grado de VEREDA", lambda: len(construir()[8]), 1))
r.append(chk("total de referencias = 2E", lambda: sum(len(x) for x in construir()), 22))

r.append(chk("orden del BFS desde ACOPIO", lambda: [NOMBRES[i] for i in bfs(0)[0]],
             ["ACOPIO","NORTE","SUR","ORIENTE","OCCIDENTE","PLANTA","PUERTO","TALLER","VEREDA","MINA"]))
r.append(chk("distancias desde ACOPIO", lambda: bfs(0)[1], [0,1,1,1,2,2,2,2,3,3]))
r.append(chk("niveles", lambda: por_niveles(bfs(0)[1]),
             [["ACOPIO"],["NORTE","SUR","ORIENTE"],["OCCIDENTE","PLANTA","TALLER","PUERTO"],["VEREDA","MINA"]]))
r.append(chk("ruta minima ACOPIO -> VEREDA", lambda: camino(8, bfs(0)[2]),
             ["ACOPIO","SUR","PUERTO","VEREDA"]))
r.append(chk("ruta minima ACOPIO -> MINA", lambda: camino(9, bfs(0)[2]),
             ["ACOPIO","ORIENTE","TALLER","MINA"]))
r.append(chk("distancias desde VEREDA", lambda: bfs(8)[1], [3, 3, 2, 4, 2, 4, 5, 1, 0, 6]))

if all(r):
    # el codigo se DERIVA de los resultados correctos: no esta escrito aqui
    d = bfs(0)[1]
    cod = f"3303-{max(d)}{sum(d)}{len(por_niveles(d))}{len(camino(9, bfs(0)[2]))}"
    print(f"\n  RETO 3 CERRADO — codigo de cierre: {cod}")
else:
    print("\n  Reto ABIERTO. Corrija y vuelva a ejecutar.")
