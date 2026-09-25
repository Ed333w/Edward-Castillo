#anotar una secuencia de pasos de un algoritmo
#buscar el usuario en la plataforma, revisar si esta, si no esta registrarlo
# Paso 1: recibir el nombre del usuario
# Paso 2: recorrer la lista de usuarios registrados uno por uno
# Paso 3: comparar cada usuario con el que se busca
# Paso 4: si se encuentra, decir que ya esta registrado y terminar
# Paso 5: si se recorre toda la lista y no aparece, agregarlo (registrarlo)

#1 ¿que es n en esa secuencia?
# n es la cantidad de usuarios que ya estan registrados en la plataforma, porque es la cantidad de elementos que hay que recorrer para buscar al usuario.

#2 cuantas veces se ejecuta el proceso si se duplican los datos?
# en el peor caso (el usuario no esta) la busqueda compara con todos, o sea n veces. si se duplican los datos (2n), la busqueda tambien se duplica: 2n comparaciones.

#3 Dentro de esa secuencia se involucra otro proceso?
# si, se involucran dos procesos:
# - buscar: recorrer y comparar usuario por usuario -> O(n)
# - registrar: agregar el usuario al final de la lista -> O(1)
# el que manda es la busqueda, asi que el algoritmo completo es O(n).

#4 Que tipo de estructura de datos se utiliza?
# una lista (arreglo) para guardar los usuarios registrados.
