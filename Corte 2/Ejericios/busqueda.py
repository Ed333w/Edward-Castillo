
v = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

#busquedas secuanciales - BusquedasBinarias
def binaria(v, x):
    izq, der = 0, len(v) - 1
    comparaciones = 1
    while izq <= der:
        medio = (izq + der) // 2
        comparaciones += 1
        if v[medio] == x: return medio, comparaciones
        elif v[medio] < x: izq = medio + 1      #descarta la mirad de la izquierda
        else: der = medio - 1                   #descarta la mitad de la derecha

    return -1, comparaciones

#A[0, ,n-1] clave x xEA indice i ral que A[i] = x, o -1 si no existe

from typing import Sequence

def secuencial(v: Sequence[int], x: int) -> int:
    comparaciones = 1
    for i in range(len(v)):
        comparaciones += 1
        if v[i] == x:
            return i, comparaciones
    return -1, comparaciones

x = int(input("Ingrese el numero que desea buscar: "))

print("indice BusquedaBinaria:", binaria(v, x)[0])
print("indice BusquedaSecuencial:", secuencial(v, x)[0])

#definir la variable de tiempo
import time
# Medir el tiempo de la búsqueda binaria
start = time.time()
result_binaria = binaria(v, x)
end = time.time()
print(f"Tiempo de búsqueda binaria: {end - start}")
# Medir el tiempo de la búsqueda secuencial
start = time.time()
result_secuencial = secuencial(v, x)
end = time.time()
print(f"Tiempo de búsqueda secuencial: {end - start}")

print(f"Comparaciones búsqueda binaria: {result_binaria[1]}")
print(f"Comparaciones búsqueda secuencial: {result_secuencial[1]}")