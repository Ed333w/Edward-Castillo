"""
RETO 3
Dados dos numeros, mostrar el resultado de:
suma, resta, multiplicacion, division, raiz cuadrada y potenciacion.
"""

import math


def main():
    print("   RETO 3 - Calculadora")

    num1 = float(input("Ingrese el primer numero: "))
    num2 = float(input("Ingrese el segundo numero: "))

    suma = num1 + num2
    resta = num1 - num2
    multiplicacion = num1 * num2

    print("-------------------------------------")
    print(f"Suma: {num1:.2f} + {num2:.2f} = {suma:.2f}")
    print(f"Resta: {num1:.2f} - {num2:.2f} = {resta:.2f}")
    print(f"Multiplicacion: {num1:.2f} * {num2:.2f} = {multiplicacion:.2f}")

    # Division: validamos que no se divida entre 0
    if num2 != 0:
        division = num1 / num2
        print(f"Division: {num1:.2f} / {num2:.2f} = {division:.2f}")
    else:
        print("Division: no se puede dividir entre 0")

    # Raiz cuadrada de cada numero (validamos que no sean negativos)
    if num1 >= 0:
        print(f"Raiz cuadrada de {num1:.2f} = {math.sqrt(num1):.2f}")
    else:
        print(f"Raiz cuadrada de {num1:.2f} no existe en los reales")

    if num2 >= 0:
        print(f"Raiz cuadrada de {num2:.2f} = {math.sqrt(num2):.2f}")
    else:
        print(f"Raiz cuadrada de {num2:.2f} no existe en los reales")

    # Potenciacion: num1 elevado a num2
    potenciacion = math.pow(num1, num2)
    print(f"Potenciacion: {num1:.2f} ^ {num2:.2f} = {potenciacion:.2f}")

    print("=====================================")


if __name__ == "__main__":
    main()