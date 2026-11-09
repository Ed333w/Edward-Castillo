# NO MODIFIQUE ESTE ARCHIVO. Alterarlo se considera fraude academico
# segun la seccion 13 de la guia de asignatura.
from indice import Nodo, insertar, inorden, altura, buscar, minimo

DATOS = [(450,"Taladro"), (220,"Proyector"), (780,"Carpa"), (130,"Megafono"),
         (310,"Mesa"), (640,"Bascula"), (890,"Carretilla"), (275,"Extension")]

def armar():
    r = None
    for c, nom in DATOS:
        r = insertar(r, c, nom)
    return r

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

print("RETO 1 · indice de recursos (BST) · verificacion")
r = []
raiz = armar()

def lista():
    s = []; inorden(armar(), s); return s

r.append(chk("inorden queda ordenado", lista,
             [130, 220, 275, 310, 450, 640, 780, 890]))
r.append(chk("altura del arbol", lambda: altura(armar()), 3))
r.append(chk("altura de un solo nodo", lambda: altura(insertar(None, 1, "x")), 0))
r.append(chk("altura del arbol vacio", lambda: altura(None), -1))
r.append(chk("minimo", lambda: minimo(armar()).codigo, 130))
r.append(chk("buscar 310 (existe)", lambda: (buscar(armar(), 310)[0].nombre,
                                             buscar(armar(), 310)[1]), ("Mesa", 3)))
r.append(chk("buscar 890 (el mas profundo a la derecha)",
             lambda: (buscar(armar(), 890)[0].nombre, buscar(armar(), 890)[1]), ("Carretilla", 3)))
r.append(chk("buscar 500 (no existe)", lambda: buscar(armar(), 500)[0], None))
def repetido():
    """Inserta un codigo que ya existe y cuenta cuantos nodos quedan."""
    a = insertar(armar(), 450, "Duplicado")
    s = []; inorden(a, s)
    return len(s)
r.append(chk("codigo repetido no se inserta (siguen 8 nodos)", repetido, 8))

if all(r):
    # el codigo se DERIVA de los resultados correctos: no esta escrito aqui
    s = lista()
    cod = f"3301-{altura(armar())}{len(s)}{buscar(armar(), 310)[1]}{minimo(armar()).codigo}"
    print(f"\n  RETO 1 CERRADO — codigo de cierre: {cod}")
else:
    print("\n  Reto ABIERTO. Corrija y vuelva a ejecutar.")
