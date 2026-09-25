# 0 = libre, 1 = muro
laberinto = [
    [0, 0, 1, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
]
FILAS, COLS = len(laberinto), len(laberinto[0])
camino = [[0] * COLS for _ in range(FILAS)]

def resolver(f, c):
    # 1. ¿me sali del tablero?
    if f < 0 or f >= FILAS or c < 0 or c >= COLS:
        return False
    # 2. ¿es muro o ya pase por aqui?
    if laberinto[f][c] == 1 or camino[f][c] == 1:
        return False
    # 3. marco esta casilla como parte del camino
    camino[f][c] = 1
    # 4. CASO BASE: llegue a la salida
    if f == FILAS - 1 and c == COLS - 1:
        return True
    # 5. CASO RECURSIVO: pruebo las cuatro direcciones
    if resolver(f + 1, c): return True
    if resolver(f, c + 1): return True
    if resolver(f - 1, c): return True
    if resolver(f, c - 1): return True
    # 6. BACKTRACKING: ninguna sirvio, desmarco y me devuelvo
    camino[f][c] = 0
    return False

if resolver(0, 0):
    print("Hay salida. Camino encontrado:")
    for f in range(FILAS):
        print("  " + " ".join("*" if camino[f][c] else ("#" if laberinto[f][c] else ".")
                              for c in range(COLS)))
else:
    print("No hay salida.")

