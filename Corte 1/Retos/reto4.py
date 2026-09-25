"""
RETO 4
Simulacion del juego "Piedra, Papel o Tijera" contra la maquina.
Reglas:
- Piedra vence a Tijera
- Tijera vence a Papel
- Papel vence a Piedra
"""

import random


def main():
    print("   RETO 4 - Piedra, Papel o Tijera")
    print("Opciones: 1) Piedra   2) Papel   3) Tijera")

    opcion_jugador = int(input("Elige tu jugada (1, 2 o 3): "))

    # Validamos que la opcion sea correcta
    while opcion_jugador < 1 or opcion_jugador > 3:
        opcion_jugador = int(input("Opcion invalida. Elige 1, 2 o 3: "))

    # La maquina genera su jugada aleatoriamente (1, 2 o 3)
    opcion_maquina = random.randint(1, 3)

    nombres = {1: "Piedra", 2: "Papel", 3: "Tijera"}

    print("-------------------------------------")
    print(f"Tu elegiste: {nombres[opcion_jugador]}")
    print(f"La maquina eligio: {nombres[opcion_maquina]}")
    print("-------------------------------------")

    # Determinamos el resultado
    if opcion_jugador == opcion_maquina:
        print("Resultado: EMPATE")
    elif (
        (opcion_jugador == 1 and opcion_maquina == 3) or  # Piedra vence a Tijera
        (opcion_jugador == 3 and opcion_maquina == 2) or  # Tijera vence a Papel
        (opcion_jugador == 2 and opcion_maquina == 1)      # Papel vence a Piedra
    ):
        print("Resultado: GANASTE!")
    else:
        print("Resultado: PERDISTE.")

    print("=====================================")


if __name__ == "__main__":
    main()