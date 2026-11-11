# ============================================================
#  Supletorio · Segundo corte · EJERCICIO 3  (20 puntos)
#  Sesiones 17 a 23 — Ordenamientos y analisis de complejidad
#  Sistema: RedAcopio — desorden en la lista de prioridades
#
#  MODIFIQUE SOLO ESTE ARCHIVO.  NO TOQUE pruebas_e3.py
#  Ejecute:   python3 pruebas_e3.py
# ============================================================


def fusionar(a, b):

    """Recibe dos listas YA ordenadas de forma no decreciente y devuelve
       una lista nueva con todos sus elementos ordenados.
       No use sorted() ni .sort(): aproveche que ya vienen ordenadas.

       Ejemplo: fusionar([2,5,9], [3,5,11]) -> [2,3,5,5,9,11]

       PENDIENTE: implementar."""

    resultado = []                              #lista vacia para almacenar el resultado
    i, j = 0, 0                                 #indices para recorrer las listas a y b

    while i < len(a) and j < len(b):            #mientras no se haya llegado al final de ninguna lista
        if a[i] <= b[j]:                        #si el elemento de a es menor o igual al de b
            resultado.append(a[i])              #agregar el elemento de a al resultado
            i += 1                              #avanzar el indice de a
        else:                                   #si el elemento de b es menor al de a
            resultado.append(b[j])              #agregar el elemento de b al resultado
            j += 1                              #avanzar el indice de b

    resultado.extend(a[i:])                     #agregar los elementos restantes de a
    resultado.extend(b[j:])                     #agregar los elementos restantes de b

    return resultado                            #devolver la lista fusionada


#Ordena con Merge Sort y devuelve (ordenada, inversiones). Una inversión es un par (i, j) con i < j donde v[i] > v[j]. Debe contarlas DURANTE la fusión.
def ordenar_contando(v):
    """Ordena 'v' con Merge Sort y devuelve la tupla (ordenada, inversiones).

       Una INVERSION es un par de posiciones (i, j) con i < j donde
       v[i] > v[j]: es decir, dos elementos que estan en el orden
       equivocado. El numero de inversiones mide que tan desordenada
       esta la lista: 0 si ya esta ordenada, n(n-1)/2 si esta al reves.

       Debe contarlas DURANTE la fusion, no comparando todos los pares:
       el verificador rechaza una solucion cuadratica.

       Ejemplo: ordenar_contando([3,1,2]) -> ([1,2,3], 2)
                (los pares (3,1) y (3,2))

       PENDIENTE: implementar."""
    if len(v) <= 1:                                  #si la lista tiene 0 o 1 elemento, ya esta ordenada y no hay inversiones
        return v, 0                                  #devolver la lista y 0 inversiones

    mid = len(v) // 2
    left, inv_left = ordenar_contando(v[:mid])         #ordenar la mitad izquierda y contar las inversiones
    right, inv_right = ordenar_contando(v[mid:])       #ordenar la mitad derecha y contar las inversiones
    merged, inv_merge = fusionar_contando(left, right) #ordenar y contar las inversiones durante la fusion

    return merged, inv_left + inv_right + inv_merge    #devolver la lista ordenada y la suma de todas las inversiones

def fusionar_contando(a, b):                           # fusiona dos listas ordenadas y cuenta las inversiones
    resultado = []
    i, j = 0, 0
    inversiones = 0

    while i < len(a) and j < len(b):                   #mientras no se haya llegado al final de ninguna lista
        if a[i] <= b[j]:
            resultado.append(a[i])
            i += 1
        else:
            resultado.append(b[j])
            j += 1
            inversiones += len(a) - i                    # Cada elemento restante en 'a' es una inversion con b[j]

    resultado.extend(a[i:])
    resultado.extend(b[j:])

    return resultado, inversiones                      # devuelve la lista fusionada y el numero de inversiones
    
def comparaciones_insercion(v):
    """Devuelve cuantas comparaciones hace el ciclo interno de
       Insertion Sort sobre 'v'. Cuente una comparacion cada vez que
       se evalua si el elemento de la izquierda es mayor que el actual,
       INCLUIDA la comparacion que falla y termina el ciclo.

       Ejemplo: [1,2,3] ya ordenada -> 2 comparaciones (una por pasada)

       PENDIENTE: implementar."""
    comparaciones = 0
    for i in range(1, len(v)):                           #recorre la lista desde el segundo elemento hasta el final
        key = v[i]
        j = i - 1
        while j >= 0:                                    #mientras no se haya llegado al inicio de la lista
            comparaciones += 1                           # Contar la comparación
            if v[j] > key:                               #si el elemento de la izquierda es mayor que el actual, se hace un intercambio
                v[j + 1] = v[j]                          # mover el elemento de la izquierda a la posición actual
                j -= 1                                         
            else:
                break
        v[j + 1] = key                                   #coloca el elemento actual en la posición correcta
    return comparaciones                                 #devuelve el número de comparaciones realizadas