# ============================================================
#  Laboratorio integrador · Corte 3 · RETO 1  (25 puntos)
#  Sesiones 35 y 36 — Arboles binarios y BST
#  Sistema: RedAcopio — indice de recursos por codigo
#
#  MODIFIQUE SOLO ESTE ARCHIVO.  NO TOQUE pruebas_r1.py
#  Ejecute:   python3 pruebas_r1.py
# Estudiante: Juan Ruiz
# ============================================================




class Nodo:
    def __init__(self, codigo, nombre):
        self.codigo = codigo
        self.nombre = nombre
        self.izq = None
        self.der = None




def insertar(n, codigo, nombre):
    """Inserta en el BST respetando la invariante: menores a la izquierda,
       mayores a la derecha. Si el codigo ya existe, NO se inserta.
       Devuelve la raiz del subarbol (patron de reenganche).


       PENDIENTE: implementar."""
    if n is None:
        return Nodo(codigo, nombre)
    if codigo < n.codigo:
        n.izq = insertar(n.izq, codigo, nombre)
    elif codigo > n.codigo:
        n.der = insertar(n.der, codigo, nombre)
    return n




def inorden(n, salida):
    """Ya implementado: recorre izquierda, raiz, derecha."""
    if n is None:
        return
    inorden(n.izq, salida)
    salida.append(n.codigo)
    inorden(n.der, salida)




def altura(n):
    """Numero de aristas del camino mas largo de n hasta una hoja.
       Un arbol vacio tiene altura -1; un solo nodo, altura 0.


       PENDIENTE: implementar (recursiva)."""
    if n is None:
        return -1
    else:
        altura_izq = altura(n.izq)
        altura_der = altura(n.der)
        return 1 + max(altura_izq, altura_der)  
   
def buscar(n, codigo):
    """Devuelve (nodo, comparaciones). Si no esta, el nodo es None.
       Debe bajar comparando, NO recorrer todo el arbol.


       PENDIENTE: implementar."""
    if n is None:
        return None, 0
    comparaciones = 1
    if codigo < n.codigo:
        nodo, comp = buscar(n.izq, codigo)
        comparaciones += comp
    elif codigo > n.codigo:
        nodo, comp = buscar(n.der, codigo)
        comparaciones += comp
    else:
        nodo = n
    return nodo, comparaciones




def minimo(n):
    """Ya implementado: el extremo izquierdo."""
    while n.izq is not None:
        n = n.izq
    return n


