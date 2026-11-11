# ============================================================
#  Supletorio · Segundo corte · EJERCICIO 1  (20 puntos)
#  Sesiones 13 a 15 — Recursion y backtracking
#  Sistema: RedAcopio — seleccion de lotes para completar un pedido
#
#  MODIFIQUE SOLO ESTE ARCHIVO.  NO TOQUE pruebas_e1.py
#  Ejecute:   python3 pruebas_e1.py
# ============================================================


def contar_combinaciones(pesos, objetivo):
    """Cuenta cuantos subconjuntos de 'pesos' suman EXACTAMENTE 'objetivo'.
       Cada lote se toma o no se toma; no se puede tomar dos veces.
       El subconjunto vacio cuenta solo si objetivo es 0.

       Ejemplo: pesos=[2,3,5,7], objetivo=10  ->  2
                ({3,7} y {2,3,5})

       PENDIENTE: implementar con recursion (tomar / no tomar)."""

    if objetivo == 0:
        return 1 #el subconjunto vacio cuenta si objetivo es 0 
    if not pesos:
        return 0 # no hay mas lotes que revisar
    
    # Tomar el primer lote
    tomar = contar_combinaciones(pesos[1:], objetivo - pesos[0])
    # No tomar el primer lote
    no_tomar = contar_combinaciones(pesos[1:], objetivo)

    return tomar + no_tomar


def menor_combinacion(pesos, objetivo):
    """Devuelve la combinacion con MENOS lotes que suma exactamente
       'objetivo', como una tupla ordenada de menor a mayor.
       Si hay empate en cantidad de lotes, devuelve la de menor suma
       de indices (es decir, la que aparece primero explorando en orden).
       Si no existe ninguna, devuelve None.

       Ejemplo: pesos=[2,3,5,7], objetivo=10  ->  (3, 7)

       PENDIENTE: implementar con backtracking."""

    def backtrack(indice, combinacion_actual, suma_actual):
        nonlocal mejor_combinacion

        # caso base: cuando la suma actual es igual al objetivo
        if suma_actual == objetivo:
            if (mejor_combinacion is None or                            #si no hay mejor combinacion todavia
                len(combinacion_actual) < len(mejor_combinacion)):      #si la combinacion actual es mas corta
                mejor_combinacion = tuple(sorted(combinacion_actual))   
            return                                                      #si la suma actual supera el objetivo, abandonamos esta rama

        if suma_actual > objetivo:
            return

        for i in range(indice, len(pesos)):                             #hacemos la exploracion de los lotes restantes
            backtrack(i + 1, combinacion_actual + [pesos[i]], suma_actual + pesos[i]) 

    mejor_combinacion = None                                            # devuelve None si no se encuentra ninguna combinacion
    backtrack(0, [], 0)                                                 # inicia la busqueda con indice 0, combinacion vacia y suma 0
    return mejor_combinacion                                            # devuelve la mejor combinacion encontrada


def contar_podas(pesos, objetivo):
    """Cuenta cuantas veces el backtracking ABANDONA una rama porque la
       suma parcial ya supero el objetivo. Los pesos son todos positivos,
       asi que pasarse significa que ninguna extension sirve.

       Cuente una poda cada vez que, al TOMAR un lote, la suma parcial
       queda estrictamente mayor que el objetivo y por eso no se sigue
       explorando esa rama.

       PENDIENTE: implementar."""
    def backtrack(indice, suma_actual):
        nonlocal podas

        if suma_actual > objetivo:                                      #si la suma actual supera el objetivo, se cuenta una poda y se abandona la rama
            podas += 1
            return

        if suma_actual == objetivo:                                     #si la suma actual es igual al objetivo, se ha encontrado una combinacion valida y se abandona la rama
            return

        for i in range(indice, len(pesos)):                             #si la suma actual es menor que el objetivo, se exploran los lotes restantes
            backtrack(i + 1, suma_actual + pesos[i])

    podas = 0                                                           #inicia el contador de podas en 0
    backtrack(0, 0)                                                     #inicia la busqueda con indice 0 y suma actual 0
    return podas