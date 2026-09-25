# Reto 7 - Encontrar el maximo de una lista y analizar su complejidad

def encontrar_maximo(lista):
    maximo = lista[0]                    # se asume que el primero es el mayor
    for i in range(1, len(lista)):       # se recorre desde el segundo hasta el final
        if lista[i] > maximo:            # si hay uno mayor, se actualiza
            maximo = lista[i]
    return maximo


if __name__ == "__main__":
    lista = [5, 12, 9, 7, 3, 15, 8, 10, 6, 4]
    resultado = encontrar_maximo(lista)
    print(f"El maximo elemento en la lista es: {resultado}")