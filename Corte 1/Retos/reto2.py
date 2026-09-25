"""
RETO 2
El centro de salud Famisalud aplica vacunas a bebes menores de un año.
La dosis depende del peso y la edad del bebe segun la formula:

    dosisvacuna = ((pesobebe + 10) / (mesesbebe * 10)) * 8
"""


def main():
    print("   RETO 2 - Centro de Salud Famisalud")
    
    peso_bebe = float(input("Ingrese el peso del bebe (en kg): "))
    meses_bebe = float(input("Ingrese la edad del bebe (en meses): "))

    # Aplicamos la formula: dosisvacuna = ((pesobebe + 10) / (mesesbebe * 10)) * 8
    dosis_vacuna = ((peso_bebe + 10) / (meses_bebe * 10)) * 8

    print(f"La dosis de vacuna a aplicar es: {dosis_vacuna:.2f} ml")
    
if __name__ == "__main__":
    main()