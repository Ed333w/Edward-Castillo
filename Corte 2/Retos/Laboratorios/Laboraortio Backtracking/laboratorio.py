#Creadores del codigo:
# Sergio Rios - Julian Hernandez - Edward Castillo




import time  # Librería para medir el tiempo de ejecución

# ---------------------------------------------------------------
# CONFIGURACIÓN E INICIALIZACIÓN DE LA MATRIZ
# 0 = calle libre, 1 = calle bloqueada, 2 = punto de acopio
# ---------------------------------------------------------------
Ruta_barrio = [
    [0, 0, 2, 1, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 2, 0, 0],
    [0, 1, 1, 0, 1]
]

# Guarda la cantidad total de filas del mapa midiendo la longitud de la matriz principal
FILAS = len(Ruta_barrio)
# Guarda la cantidad total de columnas midiendo la longitud de la primera fila
COLS = len(Ruta_barrio[0])

# Recorre cada fila de Ruta_barrio, cuenta cuántos números 2 existen en total y se lo suma a la variable TOTAL_ACOPIO
TOTAL_ACOPIO = sum(fila.count(2) for fila in Ruta_barrio)

# Crea una nueva matriz de puros 0 tomando las mismas filas y columnas de la matriz que se está probando
camino = [[0] * COLS for i in range(FILAS)]
# Lista vacía que funcionará como una pila para guardar la secuencia de coordenadas (fila, columna) en la exploración actual
ruta = []
# Lista donde se registrará la cantidad de pasos que tomó cada ruta que logró llegar a la meta
pasos_por_camino = []
# Guardará la secuencia del camino más corto encontrado hasta el momento
mejor_ruta = []


# Función auxiliar. Resta 1 a la longitud del camino porque la casilla inicial (0, 0) no cuenta como un paso
def contar_pasos(una_ruta):
    return max(0, len(una_ruta) - 1)


# Al encontrar un camino válido a la salida, calcula cuántos pasos tomó y añade ese número a pasos_por_camino
def registrar_camino():
    global mejor_ruta
    pasos = contar_pasos(ruta)
    pasos_por_camino.append(pasos)

    # Si aún no tenemos una mejor ruta o si la ruta actual es más corta que la guardada, actualiza mejor_ruta
    if not mejor_ruta or pasos < contar_pasos(mejor_ruta):
        mejor_ruta = list(ruta)  # Copia eficiente de la ruta actual


# Función recursiva principal para explorar todas las rutas del barrio
def resolver_b(f, c, recolectados):
    # 1. Validación de límites del mapa: Si la coordenada se sale de la matriz, detiene la exploración de esa rama
    if f < 0 or f >= FILAS or c < 0 or c >= COLS:
        return

    # 2. Validación de celda bloqueada o ciclo ineficiente: Descarta si hay pared (1) o si ya pasó con los mismos acopios
    if Ruta_barrio[f][c] == 1 or camino[f][c] == recolectados + 1:
        return

    # 3. Poda por cota superior: Si la ruta actual ya supera o iguala a la mejor encontrada, se descarta
    if mejor_ruta and contar_pasos(ruta) >= contar_pasos(mejor_ruta):
        return

    # Guarda el estado anterior de la casilla en la matriz camino para restaurarlo en el backtracking
    anterior = camino[f][c]
    recogi_aqui = False

    # Procesar punto de acopio: Si la casilla tiene un 2, lo cambia a 0 y suma +1 a recolectados
    if Ruta_barrio[f][c] == 2:
        Ruta_barrio[f][c] = 0
        recolectados += 1
        recogi_aqui = True

    # Marca en la matriz camino el número de acopios recolectados + 1 y guarda la coordenada actual en la ruta
    camino[f][c] = recolectados + 1
    ruta.append((f, c))

    # CASO BASE: Si se llega a la esquina inferior derecha (meta) habiendo recogido todos los puntos de acopio
    if f == FILAS - 1 and c == COLS - 1 and recolectados == TOTAL_ACOPIO:
        registrar_camino()
    else:
        # EXPLORACIÓN RECURSIVA: Prueba avanzar en las 4 direcciones (Abajo, Derecha, Arriba, Izquierda)
        resolver_b(f + 1, c, recolectados)
        resolver_b(f, c + 1, recolectados)
        resolver_b(f - 1, c, recolectados)
        resolver_b(f, c - 1, recolectados)

    # BACKTRACKING: Deshace los cambios en la ruta y en las matrices al regresar de la recursión
    ruta.pop()
    camino[f][c] = anterior
    if recogi_aqui:
        Ruta_barrio[f][c] = 2


# Función encargada de imprimir el reporte final de la ejecución
def mostrar_resultados():
    # Verifica si la lista de caminos está vacía; si es así, informa que no hubo solución
    if not pasos_por_camino:
        print("No existe ningún camino que recoja todos los puntos de acopio.")
        return

    # Imprime la cantidad total de vías que alcanzaron la meta recolectando todos los puntos
    print(f"Cantidad total de caminos válidos encontrados: {len(pasos_por_camino)}")
    
    # Obtiene la cantidad de pasos de la mejor ruta y busca su número de índice para mostrarlo
    minimo = contar_pasos(mejor_ruta)
    numero_optimo = pasos_por_camino.index(minimo) + 1
    print(f"Camino óptimo: {minimo} pasos (Camino #{numero_optimo})\n")

    # Muestra en consola la lista completa de tuplas con las coordenadas de la ruta óptima
    print("Ruta óptima con coordenadas:")
    print(mejor_ruta)

    # Dibuja la representación visual del mapa usando R para la ruta, # para paredes y . para espacio libre
    print(f"\nMapa del recorrido óptimo ({minimo} pasos):")
    for f in range(FILAS):
        fila_str = " ".join(
            "R" if (f, c) in mejor_ruta else ("#" if Ruta_barrio[f][c] == 1 else ".")
            for c in range(COLS)
        )
        print(f"  {fila_str}")

    # Identificación y filtrado de las coordenadas exactas de acopio que cruzó la mejor ruta
    puntos_recogidos = [(f, c) for f, c in mejor_ruta if Ruta_barrio[f][c] == 2]
    
    # Imprime las métricas finales de rendimiento y comprobación
    print(f"\nPasos totales: {minimo}")
    print(f"Puntos de acopio recogidos: {len(puntos_recogidos)} de {TOTAL_ACOPIO} = {puntos_recogidos}")
    print(f"Posición final: {mejor_ruta[-1]}")



#CONTADOR DE TIEMPO

inicio_tiempo = time.perf_counter()  # Inicia el cronómetro justo antes de ejecutar la búsqueda

# Arranca la exploración desde la casilla inicial (0, 0) habiendo recolectado 0 acopios
resolver_b(0, 0, 0)

fin_tiempo = time.perf_counter()  # Finaliza el cronómetro al terminar la exploración recursiva

# Procesa los datos recopilados e imprime todo el reporte en pantalla
mostrar_resultados()

# Imprime la diferencia entre el tiempo final e inicial con una precisión de 6 decimales
print(f"\nTiempo de ejecución del algoritmo: {fin_tiempo - inicio_tiempo:.6f} segundos")