# comparo dos vecinos si estan al reves los intercambio y repito el proceso 
# hast que nadie mas se mueva bubble sort
#neccsito probar todos los tipos de ordenamieto con el siguiente arreglo
import time

datos = [64, 25, 12, 22, 11, 90, 45, 33]

def medir_tiempo(metodo, arr):
    inicio = time.perf_counter()
    # Usamos .copy() para no modificar la lista 'datos' original en cada prueba
    resultado, comparaciones, intercambios = metodo(arr.copy())
    fin = time.perf_counter()
    tiempo_total = fin - inicio
    return resultado, tiempo_total, comparaciones, intercambios

def bubble_sort(arr):
    n = len(arr)
    comparaciones = 0
    intercambios = 0
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            comparaciones += 1
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                intercambios += 1
                swapped = True
        if not swapped:
            break
    return arr, comparaciones, intercambios

def selection_sort(arr):    
    n = len(arr)
    comparaciones = 0
    intercambios = 0
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparaciones += 1
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            intercambios += 1
    return arr, comparaciones, intercambios

#buscar el más pequeño y ponerlo al 
# principio selection sort

def insertion_sort(arr):
    comparaciones = 0
    intercambios = 0
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            comparaciones += 1
            arr[j + 1] = arr[j]
            j -= 1
        if j >= 0:
            comparaciones += 1
        arr[j + 1] = key
        intercambios += 1
    return arr, comparaciones, intercambios

# tomo el segubndo y lo inserto donde va 
# respecto al primero insertion sort

print("Bubble Sort:")
sorted_arr, tiempo, comparaciones, intercambios = medir_tiempo(bubble_sort, datos)
print(f"Comparaciones: {comparaciones}, Intercambios: {intercambios}, Tiempo: {tiempo:.7f} segundos\n")

print("Selection Sort:")
sorted_arr, tiempo, comparaciones, intercambios = medir_tiempo(selection_sort, datos)
print(f"Comparaciones: {comparaciones}, Intercambios: {intercambios}, Tiempo: {tiempo:.7f} segundos\n")

print("Insertion Sort:")
sorted_arr, tiempo, comparaciones, intercambios = medir_tiempo(insertion_sort, datos)
print(f"Comparaciones: {comparaciones}, Intercambios: {intercambios}, Tiempo: {tiempo:.7f} segundos\n")
