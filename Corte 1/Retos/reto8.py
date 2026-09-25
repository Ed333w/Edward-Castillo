# Reto 8 - Simulacion de juego de cartas con pilas y colas (UniGames)
#
# Estructuras usadas:
#   - pila1 y pila2: PILAS (LIFO). Se saca por la CIMA y se agregan cartas por el FONDO.
#   - mazo:          COLA  (FIFO). Se saca por el FRENTE.
#
# Usamos collections.deque para las tres:
#   PILA -> cima = extremo DERECHO (pop / append), fondo = extremo IZQUIERDO (appendleft)
#   COLA -> frente = extremo IZQUIERDO (popleft),  final = extremo DERECHO (append)
#
# REGLAS DEL TURNO (definidas por nosotros, como permite el enunciado):
#   1. Cada jugador saca la carta de la CIMA de su pila.
#   2. Ambos sacan una carta del FRENTE del mazo (cola).
#   3. Gana el turno quien tenga mayor SUMA (carta de su pila + carta del mazo).
#   4. El ganador coloca las 4 cartas al FONDO de su pila.
#   5. En caso de empate, cada jugador recupera sus 2 cartas al fondo de su propia pila.

from collections import deque


def jugar():
    # cima = extremo derecho
    pila1 = deque([2, 7, 5, 9, 3])          # cima de jugador 1 = 3
    pila2 = deque([1, 8, 6, 4, 10])         # cima de jugador 2 = 10
    mazo = deque([5, 12, 9, 7, 3, 15, 8, 10, 6, 4])   # frente = 5

    turno = 1
    while len(mazo) >= 2 and len(pila1) > 0 and len(pila2) > 0:
        # 1. cada jugador toma la carta superior de su pila
        c1 = pila1.pop()
        c2 = pila2.pop()

        # 2. ambos toman una carta del mazo
        d1 = mazo.popleft()
        d2 = mazo.popleft()

        suma1 = c1 + d1
        suma2 = c2 + d2

        print(f"Turno {turno}: J1 juega {c1}+{d1}={suma1} | J2 juega {c2}+{d2}={suma2}", end="  ")

        # 3-4. determinar ganador del turno y repartir las 4 cartas al fondo
        if suma1 > suma2:
            for carta in (c1, c2, d1, d2):
                pila1.appendleft(carta)     # al fondo de la pila 1
            print("-> gana J1")
        elif suma2 > suma1:
            for carta in (c1, c2, d1, d2):
                pila2.appendleft(carta)     # al fondo de la pila 2
            print("-> gana J2")
        else:
            # empate: cada uno recupera sus propias cartas
            pila1.appendleft(c1); pila1.appendleft(d1)
            pila2.appendleft(c2); pila2.appendleft(d2)
            print("-> empate")

        turno += 1

    # Resultado final
    print("\n===== RESULTADO FINAL =====")
    print(f"Jugador 1 tiene {len(pila1)} cartas")
    print(f"Jugador 2 tiene {len(pila2)} cartas")

    if len(pila1) > len(pila2):
        print("GANADOR: Jugador 1")
    elif len(pila2) > len(pila1):
        print("GANADOR: Jugador 2")
    else:
        print("EMPATE: ambos tienen la misma cantidad de cartas")


if __name__ == "__main__":
    jugar()