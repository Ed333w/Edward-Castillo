#anotar una secuencia de pasos de un algoritmo
#ordenar las notas de los estudiantes de menor a mayor (bubble sort)
# Paso 1: recibir la lista de notas
# Paso 2: comparar la primera nota con la que sigue
# Paso 3: si la primera es mayor, intercambiarlas de posicion
# Paso 4: avanzar al siguiente par y repetir hasta llegar al final de la lista (eso es una pasada)
# Paso 5: repetir las pasadas hasta que en una pasada no se haga ningun intercambio (la lista ya esta ordenada)

#1 ¿que es n en esa secuencia?
# n es la cantidad de notas (elementos) que tiene la lista que se va a ordenar.

#2 cuantas veces se ejecuta el proceso si se duplican los datos?
# en el peor caso se hacen n pasadas y en cada pasada se comparan casi n pares, o sea n * n = n² comparaciones. si se duplican los datos (2n), las comparaciones pasan a (2n)² = 4n², es decir, el trabajo se multiplica por 4, no por 2.

#3 Dentro de esa secuencia se involucra otro proceso?
# si, dentro de cada pasada hay otro proceso: comparar cada par de notas vecinas y, si estan en desorden, intercambiarlas.
# - pasadas: ciclo externo -> se repite n veces
# - comparar e intercambiar: ciclo interno -> se repite n veces por cada pasada
# como es un ciclo dentro de otro ciclo (anidado), el total es n * n = O(n²).

#4 Que tipo de estructura de datos se utiliza?
# una lista (arreglo), porque se accede a cada nota por su posicion (indice) para compararla con la de al lado e intercambiarlas.

#5 ¿Cual es la complejidad de la secuencia?
# se analiza paso por paso:
# - Paso 1 (recibir la lista): se hace una sola vez -> O(1)
# - Pasos 2, 3 y 4 (una pasada): se comparan n-1 pares y cada comparacion/intercambio cuesta O(1) -> O(n)
# - Paso 5 (repetir las pasadas): en el peor caso se hacen n pasadas -> n * O(n) = O(n²)
# se queda el termino mas grande, asi que la complejidad de la secuencia es O(n²) (cuadratica).

def bubble_sort(notas):                                             #complejidad total: O(n²) en el peor caso, O(n) en el mejor caso
    n = len(notas)                                                  #O(1)
    for i in range(n):                                              #O(n²) -> for anidado: n pasadas * n comparaciones = n * n 
        intercambio = False                                         #O(1) (se ejecuta n veces -> O(n))
        for j in range(0, n-i-1):                                   #O(n) por cada pasada; junto al for externo da O(n²)
            if notas[j] > notas[j+1]:                               #O(1) (se ejecuta n * n veces -> O(n²))
                notas[j], notas[j+1] = notas[j+1], notas[j]         #O(1) (se ejecuta n * n veces -> O(n²))
                intercambio = True                                  
        if not intercambio:                                         
            break                                                   #O(1) -> si no hubo intercambios corta: mejor caso O(n)
    return notas                                                    
                                                                    #Complejidad = O(1) + O(n²) + O(1) = O(n²) 


      