# ============================================================
#  Cívica Software  ·  TCK-4420  ·  Severidad P3
#  Sistema: RedAcopio  —  Reporte de ocupación
#  NO MODIFIQUE la seccion de datos ni el archivo de pruebas.
# ============================================================

# filas = puntos de acopio, columnas = dias de la semana
ocupacion = [
    [4, 2, 6, 1, 3, 0],
    [0, 5, 5, 2, 7, 1],
    [8, 1, 0, 4, 2, 6],
    [3, 3, 3, 0, 0, 5],
]

def total_por_punto(m):  #este metodo recorre la matriz y suma los valores de cada fila, que representan los puntos de acopio, y devuelve una lista con el total recogido por cada punto.
    """Devuelve una lista con el total recogido por cada punto (fila)."""
    totales = []         # inicializa una lista vacia para almacenar los totales por punto
    for fila in m:       # recorre cada fila de la matriz
        s = 0           # inicializa un contador para sumar los valores de la fila
        for v in fila:     # recorre cada valor de la fila
            s += v          # suma el valor al contador
        totales.append(s)   # agrega el total de la fila a la lista de totales
    return totales          # devuelve la lista de totales por punto


def total_por_dia(m):
    """Devuelve una lista con el total recogido cada dia (columna).
       BUG REPORTADO: entrega totales incorrectos."""
    totales = []
    for j in range(len(m[0])):          #<-- revise este recorrido // en la linea 30 se corrige el bug, 
        s = 0                           #se cambia len(m) por len(m[0]) para recorrer las columnas correctamente 
        for i in range(len(m)):         #desde la posicion 0 hasta la cantidad de columnas (dias) que hay en la matriz.
            s += m[i][j]
        totales.append(s)
    return totales
    

def dia_mas_flojo(m):                   #este metodo llama a la funcion total_por_dia para obtener los totales de cada dia y luego busca el minimo de esos totales.
    """Devuelve el indice del dia con MENOR recoleccion total.
       PENDIENTE: implementar."""
    totales = total_por_dia(m)          #llama a la funcion total_por_dia para obtener los totales de cada dia
    minimo = min(totales)               #busca el minimo de los totales
    return totales.index(minimo)        #devuelve el indice del dia con menor recoleccion total


def puntos_inactivos(m):                #este metodo recorre la matriz y cuenta cuantas veces aparece el valor 0, que indica que el punto no opero ese dia.
    """Devuelve cuantos registros estan en 0 (el punto no opero ese dia).
       PENDIENTE: implementar."""
    count = 0
    for fila in m:                  #recorre cada fila de la matriz
        for v in fila:              #recorre cada valor de la fila
            if v == 0:              #si el valor es 0, incrementa el contador
                count += 1          
    return count                    #devuelve el conteo de registros en 0

print("Total por punto:", total_por_punto(ocupacion))
print("Total por dia:", total_por_dia(ocupacion))
print("Dia mas flojo:", dia_mas_flojo(ocupacion))
print("Puntos inactivos:", puntos_inactivos(ocupacion))