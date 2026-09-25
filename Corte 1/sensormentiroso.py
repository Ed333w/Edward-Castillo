
lecturas = [20, -999, 22, 24, -999, 26]

suma = 0
contador_buenos = 0
contador_malos = 0 

for i in lecturas:
    if i == -999:
        contador_malos += 1

    else:
        suma += i
        contador_buenos += 1

print(f"Lecturas totales: {len(lecturas)}")
print(f"Lecturas descartadas: {contador_malos}")
print(f"Lecturas validas: {contador_buenos}")
print(f"Promedio: {suma / contador_buenos}")
