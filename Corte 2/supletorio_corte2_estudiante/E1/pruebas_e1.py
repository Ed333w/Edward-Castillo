# NO MODIFIQUE ESTE ARCHIVO. Alterarlo se considera fraude academico
# segun la seccion 13 de la guia de asignatura.
from seleccion import contar_combinaciones, menor_combinacion, contar_podas

def chk(nombre, fn, esperado):
    try:
        obtenido = fn()
    except RecursionError:
        print(f"  [FALLA] {nombre}: RecursionError (la recursion no termina)")
        return False
    except Exception as ex:
        print(f"  [FALLA] {nombre}: lanzo {type(ex).__name__}")
        return False
    ok = obtenido == esperado
    print(f"  [{'OK ' if ok else 'FALLA'}] {nombre}: obtuvo {obtenido}")
    if not ok:
        print(f"          esperaba {esperado}")
    return ok

A = [2, 3, 5, 7]
B = [1, 2, 3, 4, 5]
C = [4, 4, 4]

print("EJERCICIO 1 · seleccion de lotes (backtracking) · verificacion")
r = []
r.append(chk("contar A objetivo 10",     lambda: contar_combinaciones(A, 10), 2))
r.append(chk("contar A objetivo 0",      lambda: contar_combinaciones(A, 0), 1))
r.append(chk("contar A objetivo 1",      lambda: contar_combinaciones(A, 1), 0))
r.append(chk("contar B objetivo 5",      lambda: contar_combinaciones(B, 5), 3))
r.append(chk("contar C objetivo 8 (repetidos)", lambda: contar_combinaciones(C, 8), 3))
r.append(chk("contar lista vacia obj 0", lambda: contar_combinaciones([], 0), 1))

r.append(chk("menor combinacion A obj 10", lambda: menor_combinacion(A, 10), (3, 7)))
r.append(chk("menor combinacion B obj 9",  lambda: menor_combinacion(B, 9), (4, 5)))
r.append(chk("menor combinacion A obj 1",  lambda: menor_combinacion(A, 1), None))
r.append(chk("menor combinacion obj 0",    lambda: menor_combinacion(A, 0), ()))

r.append(chk("podas A objetivo 10", lambda: contar_podas(A, 10), 4))
r.append(chk("podas A objetivo 4",  lambda: contar_podas(A, 4), 7))

if all(r):
    # el codigo se DERIVA de los resultados correctos: no esta escrito aqui
    cod = (f"2251-{contar_combinaciones(B,5)}{len(menor_combinacion(A,10))}"
           f"{contar_podas(A,10)}{contar_combinaciones(C,8)}")
    print(f"\n  EJERCICIO 1 CERRADO — codigo de cierre: {cod}")
else:
    print("\n  Ejercicio ABIERTO. Corrija y vuelva a ejecutar.")
