# ---------------------------------------------------------------
# Generador de la coleccion de registros del proyecto
# Crea registros.csv, que usan TODAS las partes del laboratorio
# (Python y C++ leen el mismo archivo, asi los resultados coinciden).
# ---------------------------------------------------------------
import random

N = 10000                 # cantidad de registros
SEMILLA = 2026            # semilla fija: el archivo se puede regenerar igual

barrios = ["Chapinero", "Usaquen", "Suba", "Kennedy", "Teusaquillo",
           "Fontibon", "Engativa", "Bosa", "Candelaria", "Barrios Unidos"]

rng = random.Random(SEMILLA)

# Los codigos son unicos y NO consecutivos: si fueran 1,2,3... la posicion
# se podria calcular con una resta y la busqueda perderia sentido.
codigos = rng.sample(range(100000, 999999), N)

registros = []
for codigo in codigos:
    registros.append({
        "codigo": codigo,                          # clave de busqueda y ordenamiento
        "barrio": rng.choice(barrios),
        "kilos": rng.randint(5, 500),              # kilos recolectados
        "ruta": rng.randint(1, 40)                 # numero de ruta del camion
    })

with open("registros.csv", "w", encoding="utf-8") as f:
    f.write("codigo,barrio,kilos,ruta\n")
    for r in registros:
        f.write(f"{r['codigo']},{r['barrio']},{r['kilos']},{r['ruta']}\n")

print(f"registros.csv generado con {len(registros)} registros")
print("primeros tres registros (en el orden en que quedaron, desordenado):")
for r in registros[:3]:
    print("  ", r)

# PARTE B

def cargar_registros(nombre_archivo):
    """Lee registros.csv y devuelve una lista de diccionarios.
    La lectura NO forma parte de ningun algoritmo que midamos."""
    registros = []
    with open(nombre_archivo, "r", encoding="utf-8") as f:
        f.readline()                               # se descarta el encabezado
        for linea in f:
            codigo, barrio, kilos, ruta = linea.strip().split(",")
            registros.append({"codigo": int(codigo), "barrio": barrio,
                              "kilos": int(kilos), "ruta": int(ruta)})
    return registros

def merge_sort(arr):
    """Ordena la lista de registros por el campo 'codigo'.
    Es el mismo Merge Sort de clase; lo unico que cambia es que compara
    r['codigo'] en lugar de comparar numeros sueltos."""
    if len(arr) > 1:
        mid = len(arr) // 2
        left_half = arr[:mid]
        right_half = arr[mid:]

        merge_sort(left_half)
        merge_sort(right_half)

        i = j = k = 0
        while i < len(left_half) and j < len(right_half):
            if left_half[i]["codigo"] < right_half[j]["codigo"]:
                arr[k] = left_half[i]
                i += 1
            else:
                arr[k] = right_half[j]
                j += 1
            k += 1

        while i < len(left_half):
            arr[k] = left_half[i]
            i += 1
            k += 1

        while j < len(right_half):
            arr[k] = right_half[j]
            j += 1
            k += 1
    return arr

def secuencial(registros, codigo_buscado):
    comparaciones = 0
    for i in range(len(registros)):
        comparaciones += 1
        if registros[i]["codigo"] == codigo_buscado:
            return i, comparaciones
    return -1, comparaciones

def binaria(registros, codigo_buscado):
    izq, der = 0, len(registros) - 1
    comparaciones = 0
    while izq <= der:
        medio = (izq + der) // 2
        comparaciones += 1
        if registros[medio]["codigo"] == codigo_buscado:
            return medio, comparaciones
        elif registros[medio]["codigo"] < codigo_buscado:
            izq = medio + 1                        # descarta la mitad izquierda
        else:
            der = medio - 1                        # descarta la mitad derecha
    return -1, comparaciones

registros = cargar_registros("registros.csv")
n = len(registros)

# Las dos busquedas trabajan sobre ESTA misma lista ordenada. La secuencial
# no necesita el orden, pero usarla garantiza que ambas recorren exactamente
# los mismos datos y que las posiciones que reportan son comparables.
ordenados = merge_sort(registros)

# Los cuatro casos se toman de la lista ya ordenada, asi que se sabe de
# antemano en que posicion deberia aparecer cada uno.
casos = [
    ("Primer elemento", ordenados[0]["codigo"]),
    ("Elemento del medio", ordenados[n // 2]["codigo"]),
    ("Ultimo elemento", ordenados[n - 1]["codigo"]),
    ("Elemento inexistente", 999999),              # codigo fuera del rango generado
]

print(f"Coleccion: {n} registros ordenados por 'codigo'\n")
print(f"{'Caso':22s} {'Codigo':>8s} {'Sec: pos':>9s} {'Sec: comp':>10s} {'Bin: pos':>9s} {'Bin: comp':>10s}")
print("-" * 72)
for nombre, codigo in casos:
    pos_sec, comp_sec = secuencial(ordenados, codigo)
    pos_bin, comp_bin = binaria(ordenados, codigo)
    print(f"{nombre:22s} {codigo:8d} {pos_sec:9d} {comp_sec:10d} {pos_bin:9d} {comp_bin:10d}")

# Verificacion: las dos busquedas deben coincidir siempre en la posicion.
print("\nVerificacion sobre 200 codigos tomados al azar de la coleccion:")
import random
rng = random.Random(1)
iguales = 0
for r in rng.sample(ordenados, 200):
    if secuencial(ordenados, r["codigo"])[0] == binaria(ordenados, r["codigo"])[0]:
        iguales += 1
print(f"  coinciden en {iguales} de 200 casos")

# ---------------------------------------------------------------
# PARTE C — Bubble Sort, Selection Sort e Insertion Sort con contadores
# Se ordenan registros por el atributo 'codigo', en dos escenarios:
#   Escenario 1: datos desordenados (como vienen en el archivo)
#   Escenario 2: los mismos datos, ya ordenados
# ---------------------------------------------------------------

N = 1000          # cantidad de registros usada en esta parte


def cargar_registros(nombre_archivo, cantidad):
    """Lee registros.csv y devuelve los primeros 'cantidad' registros."""
    registros = []
    with open(nombre_archivo, "r", encoding="utf-8") as f:
        f.readline()
        for linea in f:
            codigo, barrio, kilos, ruta = linea.strip().split(",")
            registros.append({"codigo": int(codigo), "barrio": barrio,
                              "kilos": int(kilos), "ruta": int(ruta)})
            if len(registros) == cantidad:
                break
    return registros


def bubble_sort(arr):
    """Compara vecinos y los intercambia si estan al reves.
    La bandera 'swapped' corta el ciclo si en una pasada no hubo intercambios,
    es decir, si el arreglo ya quedo ordenado."""
    n = len(arr)
    comparaciones = 0
    intercambios = 0
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            comparaciones += 1
            if arr[j]["codigo"] > arr[j + 1]["codigo"]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                intercambios += 1
                swapped = True
        if not swapped:
            break
    return arr, comparaciones, intercambios


def selection_sort(arr):
    """Busca el minimo del tramo pendiente y lo lleva al inicio.
    Para encontrar ese minimo debe recorrer el tramo completo, sin importar
    si los datos ya estan ordenados."""
    n = len(arr)
    comparaciones = 0
    intercambios = 0
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparaciones += 1
            if arr[j]["codigo"] < arr[min_idx]["codigo"]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            intercambios += 1
    return arr, comparaciones, intercambios


def insertion_sort(arr):
    """Toma cada elemento y lo inserta en su lugar dentro de la parte ya
    ordenada, corriendo hacia la derecha los que son mayores.
    Aqui no hay intercambios sino MOVIMIENTOS: cada desplazamiento de un
    registro cuenta uno, y solo se cuenta cuando algo efectivamente se mueve."""
    comparaciones = 0
    movimientos = 0
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j]["codigo"] > key["codigo"]:
            comparaciones += 1
            arr[j + 1] = arr[j]
            movimientos += 1
            j -= 1
        if j >= 0:
            comparaciones += 1          # la comparacion que hizo fallar el while
        arr[j + 1] = key
    return arr, comparaciones, movimientos


# ---------------------------------------------------------------
# Programa principal
# ---------------------------------------------------------------
desordenados = cargar_registros("registros.csv", N)

# Escenario 2: los mismos registros, ya ordenados por codigo.
# Se obtienen ordenando una copia con uno de los algoritmos ya implementados.
ordenados = bubble_sort([r for r in desordenados])[0]

algoritmos = [("Bubble Sort", bubble_sort),
              ("Selection Sort", selection_sort),
              ("Insertion Sort", insertion_sort)]

print(f"n = {N} registros, ordenados por el atributo 'codigo'\n")
print(f"{'Algoritmo':16s} {'Estado inicial':16s} {'n':>6s} {'Comparaciones':>14s} {'Interc/Movim':>13s}")
print("-" * 70)
for nombre, algoritmo in algoritmos:
    for estado, datos in (("Desordenado", desordenados), ("Ya ordenado", ordenados)):
        # Se ordena una copia para que cada prueba parta del mismo estado.
        _, comparaciones, movimientos = algoritmo([r for r in datos])
        print(f"{nombre:16s} {estado:16s} {N:6d} {comparaciones:14,} {movimientos:13,}")