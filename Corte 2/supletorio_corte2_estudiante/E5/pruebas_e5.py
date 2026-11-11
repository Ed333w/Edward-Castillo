# NO MODIFIQUE ESTE ARCHIVO. Alterarlo se considera fraude academico
# segun la seccion 13 de la guia de asignatura.
from tabla import TablaHash

CLAVES = [23, 15, 42, 9, 36, 51, 28, 17]

def armar():
    t = TablaHash(7)
    for i, c in enumerate(CLAVES):
        t.insertar(c, f"U{i}")
    return t

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

print("EJERCICIO 5 · tabla hash con encadenamiento · verificacion")
r = []
r.append(chk("indice de 23 con m=7", lambda: TablaHash(7)._indice(23), 2))
r.append(chk("indice de 42 con m=7", lambda: TablaHash(7)._indice(42), 0))

r.append(chk("buscar una clave que esta", lambda: armar().buscar(36), "U4"))
r.append(chk("buscar una clave que no esta", lambda: armar().buscar(99), None))
r.append(chk("insertar clave nueva devuelve True", lambda: armar().insertar(100, "X"), True))
r.append(chk("insertar clave existente devuelve False", lambda: armar().insertar(23, "Y"), False))

def actualiza():
    t = armar(); t.insertar(23, "NUEVO")
    return (t.buscar(23), t.n)
r.append(chk("actualizar no aumenta el conteo", actualiza, ("NUEVO", 8)))

r.append(chk("distribucion de buckets", lambda: armar().distribucion(), [2, 2, 3, 1, 0, 0, 0]))
r.append(chk("colisiones", lambda: armar().colisiones(), 4))
r.append(chk("factor de carga", lambda: armar().factor_carga(), 1.143))

def elimina():
    t = armar(); ok = t.eliminar(9)
    return (ok, t.buscar(9), t.n, t.distribucion()[2])
r.append(chk("eliminar del medio de una cadena", elimina, (True, None, 7, 2)))
r.append(chk("eliminar una clave que no esta", lambda: armar().eliminar(99), False))

def tras_rehash():
    t = armar(); t.rehash()
    return (t.m, t.n, t.buscar(36), t.distribucion())
r.append(chk("rehash", tras_rehash,
             (14, 8, "U4", [2, 1, 0, 1, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0])))

def rehash_conserva():
    t = armar(); t.rehash()
    return all(t.buscar(c) == f"U{i}" for i, c in enumerate(CLAVES))
r.append(chk("rehash conserva todos los pares", rehash_conserva, True))

if all(r):
    # el codigo se DERIVA de los resultados correctos: no esta escrito aqui
    t = armar()
    cod = f"2255-{t.colisiones()}{max(t.distribucion())}{t.n}{t.m}"
    print(f"\n  EJERCICIO 5 CERRADO — codigo de cierre: {cod}")
else:
    print("\n  Ejercicio ABIERTO. Corrija y vuelva a ejecutar.")
