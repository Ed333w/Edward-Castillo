# ============================================================
#  Cívica Software  ·  TCK-5510  ·  Severidad P3
#  Sistema: RedAcopio  —  Mapa de cobertura de rutas
#  NO MODIFIQUE la matriz de datos ni el archivo de pruebas.
# ============================================================

# filas = rutas del camion, columnas = zonas del barrio
# cada celda = kilos recogidos por esa ruta en esa zona
cobertura = [
    [5, 0, 3, 0, 2, 4, 0],
    [0, 0, 7, 0, 1, 0, 6],
    [2, 0, 0, 0, 4, 3, 1],
    [0, 0, 5, 0, 0, 8, 2],
]

def total_por_ruta(m):
    """Devuelve una lista con el total recogido por cada ruta (fila)."""
    totales = []
    for fila in m:
        s = 0
        for v in fila:
            s += v
        totales.append(s)
    return totales


def cobertura_por_zona(m):
    """Devuelve una lista con el total recogido en cada zona (columna).
       BUG REPORTADO: la ultima zona nunca aparece en el informe."""
    totales = []
    for j in range(len(m[0])):          #se quito el -1 para que recorra hasta la ultima columna
        s = 0
        for i in range(len(m)):
            s += m[i][j]
        totales.append(s)
    return totales


def ruta_mas_productiva(m):             #este metodo devuelve el indice de la ruta que mas kilos recogio en total
    """Devuelve el INDICE de la ruta que mas kilos recogio en total."""
    totales = total_por_ruta(m)         #llama a la funcion total_por_ruta para obtener los totales de cada ruta
    max_kilos = max(totales)            #usando max() porque es un metodo nativo de python y es mas eficiente que recorrer la lista con un For para encontrar el maximo
    return totales.index(max_kilos)     #devuelve el indice de la ruta con el maximo total



def zonas_sin_cubrir(m):
    """Devuelve cuantas zonas (columnas) quedaron COMPLETAMENTE en cero,
       es decir, ninguna ruta recogio nada alli."""
    totales = cobertura_por_zona(m)      #llama a la funcion cobertura_por_zona para obtener los totales de cada zona
    return totales.count(0)              #devuelve la cantidad de zonas que quedaron en cero usando count() 
                                        #porque es un metodo nativo de python y es mas eficiente que recorrer la lista con un For para contar los ceros

print(total_por_ruta(cobertura))
print(cobertura_por_zona(cobertura))
print("la ruta mas productiva es la numero:", ruta_mas_productiva(cobertura))
print("las zonas sin cobertura son:", zonas_sin_cubrir(cobertura))