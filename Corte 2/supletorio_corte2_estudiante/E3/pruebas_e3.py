# NO MODIFIQUE ESTE ARCHIVO. Alterarlo se considera fraude academico
# segun la seccion 13 de la guia de asignatura.
import random, time
from orden import fusionar, ordenar_contando, comparaciones_insercion

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

print("EJERCICIO 3 · ordenamiento e inversiones · verificacion")
r = []
r.append(chk("fusionar basico", lambda: fusionar([2,5,9],[3,5,11]), [2,3,5,5,9,11]))
r.append(chk("fusionar con vacia", lambda: fusionar([], [4,4,4]), [4,4,4]))
r.append(chk("fusionar una sola", lambda: fusionar([1],[]), [1]))

r.append(chk("ordenar [3,1,2]", lambda: ordenar_contando([3,1,2]), ([1,2,3], 2)))
r.append(chk("ya ordenada", lambda: ordenar_contando([1,2,3,4,5]), ([1,2,3,4,5], 0)))
r.append(chk("al reves (maximo desorden)", lambda: ordenar_contando([5,4,3,2,1]), ([1,2,3,4,5], 10)))
r.append(chk("con repetidos", lambda: ordenar_contando([4,2,4,1,2]), ([1,2,2,4,4], 6)))
r.append(chk("lista vacia", lambda: ordenar_contando([]), ([], 0)))
r.append(chk("un elemento", lambda: ordenar_contando([7]), ([7], 0)))

r.append(chk("insercion ya ordenada [1,2,3]", lambda: comparaciones_insercion([1,2,3]), 2))
r.append(chk("insercion al reves [3,2,1]", lambda: comparaciones_insercion([3,2,1]), 3))
r.append(chk("insercion [42,17,93,8,55,31]", lambda: comparaciones_insercion([42,17,93,8,55,31]), 11))

# --- control de complejidad: debe ser O(n log n), no O(n^2) ---
random.seed(13)
grande = [random.randint(1, 10**6) for _ in range(60000)]
try:
    t0 = time.perf_counter()
    orden_g, inv_g = ordenar_contando(grande)
    dt = time.perf_counter() - t0
    ok_grande = (orden_g == sorted(grande))
    rapido = dt < 8.0
    print(f"  [{'OK ' if ok_grande else 'FALLA'}] 60.000 elementos: quedan ordenados")
    print(f"  [{'OK ' if rapido else 'FALLA'}] 60.000 elementos en tiempo razonable: {dt:.2f} s"
          + ("" if rapido else "  (la solucion parece cuadratica)"))
except Exception as ex:
    ok_grande = rapido = False
    print(f"  [FALLA] 60.000 elementos: quedan ordenados  (lanzo {type(ex).__name__})")
    print(f"  [FALLA] 60.000 elementos en tiempo razonable")
r.append(ok_grande)
r.append(rapido)

if all(r):
    # el codigo se DERIVA de los resultados correctos: no esta escrito aqui
    cod = (f"2253-{ordenar_contando([5,4,3,2,1])[1]}{ordenar_contando([4,2,4,1,2])[1]}"
           f"{comparaciones_insercion([42,17,93,8,55,31])}")
    print(f"\n  EJERCICIO 3 CERRADO — codigo de cierre: {cod}")
else:
    print("\n  Ejercicio ABIERTO. Corrija y vuelva a ejecutar.")
