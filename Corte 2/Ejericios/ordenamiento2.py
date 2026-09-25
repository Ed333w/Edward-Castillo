#Merge Sort y Quicksort
# Mergesort es un algoritmo de ordenamiento
# que utiliza la técnica de divide y 
# vencerás. Divide la lista en 
# sublistas más pequeñas, las ordena y 
# luego las combina para obtener la lista
# final ordenada.
def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        left_half = arr[:mid]
        right_half = arr[mid:]

        merge_sort(left_half)
        merge_sort(right_half)

        i = j = k = 0

        while i < len(left_half) and j < len(right_half):
            if left_half[i] < right_half[j]:
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
#Quicksort es un algoritmo de ordenamiento
# Elige un pivote y reorganiza el arreglo: 
# los menores al pivote quedan a la izquierda 
# y los mayores a la derecha. 
# Luego repite lo mismo en cada lado.

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    else:
        pivot = arr[len(arr) // 2]
        left = [x for x in arr if x < pivot]
        middle = [x for x in arr if x == pivot]
        right = [x for x in arr if x > pivot]
        return quick_sort(left) + middle + quick_sort(right)
    

# Heapsort y Bucket Sort

#Heapsort 

def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left

    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
#Bucket Sort

def bucket_sort(arr):
    if len(arr) == 0:
        return arr

    min_value = min(arr)
    max_value = max(arr)
    bucket_range = (max_value - min_value) / len(arr)

    buckets = [[] for _ in range(len(arr))]

    for num in arr:
        index = int((num - min_value) / bucket_range)
        if index == len(arr):
            index -= 1
        buckets[index].append(num)

    sorted_arr = []
    for bucket in buckets:
        sorted_arr.extend(sorted(bucket))

    return sorted_arr

#Heapsort : [11, 12, 22, 25, 33, 45, 64, 90]
#Bucket   : [11, 12, 22, 25, 33, 45, 64, 90]