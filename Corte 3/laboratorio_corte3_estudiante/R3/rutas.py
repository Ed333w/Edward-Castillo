# ============================================================
#  Laboratorio integrador · Corte 3 · RETO 3  (25 puntos)
#  Sesiones 40 y 42 — Representacion de grafos y BFS
#  Sistema: RedAcopio — rutas minimas entre puntos de la red
#
#  MODIFIQUE SOLO ESTE ARCHIVO.  NO TOQUE pruebas_r3.py
#  Ejecute:   python3 pruebas_r3.py
# Estudiante: Edward Castillo 
# ============================================================
from collections import deque

NOMBRES = ["ACOPIO","NORTE","SUR","ORIENTE","OCCIDENTE",
           "PLANTA","TALLER","PUERTO","VEREDA","MINA"]
ARISTAS = [(0,1),(0,2),(0,3),(1,4),(1,5),(2,7),(3,6),(5,6),(4,7),(7,8),(6,9)]
N = len(NOMBRES)


def construir():
    """Devuelve la lista de adyacencia: una lista de N listas.
       El grafo es NO DIRIGIDO, asi que cada arista se registra en los dos
       extremos. Cada lista de vecinos debe quedar ORDENADA de menor a mayor."""
    adj = [[] for _ in range(N)]
    for u, v in ARISTAS:
        adj[u].append(v)      # no dirigido: se registra en ambos extremos
        adj[v].append(u)
    for vecinos in adj:
        vecinos.sort()
    return adj


def bfs(inicio):
    """Recorrido en anchura desde 'inicio'.
       Devuelve la tupla (orden, dist, padre):
         orden  lista de vertices en el orden en que se atendieron
         dist   dist[v] = numero de tramos desde inicio (-1 si no se alcanza)
         padre  padre[v] = vertice desde el que se llego a v (-1 para el inicio)

       Recuerde: se marca el vertice al ENCOLARLO, no al sacarlo."""
    adj = construir()
    dist = [-1] * N
    padre = [-1] * N
    orden = []

    dist[inicio] = 0              # marcar al encolar
    cola = deque([inicio])
    while cola:
        u = cola.popleft()
        orden.append(u)
        for v in adj[u]:
            if dist[v] == -1:     # aun no descubierto
                dist[v] = dist[u] + 1
                padre[v] = u
                cola.append(v)
    return orden, dist, padre


def camino(destino, padre):
    """Ya implementado: reconstruye la ruta siguiendo el arreglo padre."""
    ruta = []
    v = destino
    while v != -1:
        ruta.append(NOMBRES[v])
        v = padre[v]
    return list(reversed(ruta))


def por_niveles(dist):
    """Devuelve una lista de listas: en la posicion d, los NOMBRES de los
       vertices que estan a distancia d del origen."""
    if max(dist) < 0:
        return []
    niveles = [[] for _ in range(max(dist) + 1)]
    for v in range(N):
        if dist[v] >= 0:          # ignora los no alcanzados
            niveles[dist[v]].append(NOMBRES[v])
    return niveles
