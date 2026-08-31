# Reto 5 - Supermercados Noe (descuento por bolita aleatoria)
import random

def main():
    compra = float(input("Valor de la compra: "))

    # La promo solo aplica si la compra supera 50.000
    if compra > 50000:
        bolita = random.randint(1, 4)   # numero al azar entre 1 y 4

        if bolita == 1:
            color = "roja"
            descuento = 0.10
        elif bolita == 2:
            color = "azul"
            descuento = 0.30
        elif bolita == 3:
            color = "amarilla"
            descuento = 0.50
        else:
            color = "blanca"
            descuento = 1.00   # compra gratis

        valorDescuento = compra * descuento
        totalPagar = compra - valorDescuento

        print(f"Sacaste la bolita {color}")
        if color == "blanca":
            print("Felicidades, te llevas tu compra GRATIS!")
        print(f"Descuento ganado: {descuento * 100:.0f}% ({valorDescuento})")
        print(f"Valor final a pagar: {totalPagar}")
    else:
        print("Tu compra no supera los $50.000, no aplica la promocion de aniversario")
        print(f"Valor a pagar: {compra}")


if __name__ == "__main__":
    main()