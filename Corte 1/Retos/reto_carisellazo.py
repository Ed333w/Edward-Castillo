"""
RETO III
Simula el juego del "carisellazo" (cara o sello).
- Se simula el lanzamiento de una moneda usando el modulo random
- El jugador elige Cara o Sello antes de que caiga la moneda
- El juego indica si gana o pierde, comparando la eleccion del jugador
  con el resultado del lanzamiento
"""

import random


def main():
    print("   RETO III - Juego del Carisellazo")
    
    eleccion_jugador = input("Elige Cara o Sello (escribe 'cara' o 'sello'): ").strip().lower()

    # Validamos que la entrada sea correcta
    while eleccion_jugador not in ("cara", "sello"):
        eleccion_jugador = input("Opcion invalida. Escribe 'cara' o 'sello': ").strip().lower()

    # Generamos un numero aleatorio entre 0 y 1 para simular el lanzamiento
    # 0 = cara, 1 = sello
    lanzamiento = random.randint(0, 1)
    resultado_moneda = "cara" if lanzamiento == 0 else "sello"

    print("-------------------------------------")
    print(f"La moneda cayo en: {resultado_moneda}")

    if eleccion_jugador == resultado_moneda:
        print("Felicidades, GANASTE!")
    else:
        print("Lo siento, PERDISTE.")

    print("=====================================")


if __name__ == "__main__":
    main()