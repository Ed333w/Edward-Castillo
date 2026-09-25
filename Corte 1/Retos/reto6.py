# Reto 6 - Calcular el total de una compra de varios productos

def main():
    n = int(input("Cuantos productos va a comprar? "))
    total = 0.0   # acumulador del total de la compra

    for i in range(n):
        print(f"--- Producto {i + 1} ---")
        nombre = input("Nombre del producto: ")
        precio = float(input("Precio unitario: "))
        cantidad = int(input("Cantidad comprada: "))

        subtotal = precio * cantidad
        print(f"Subtotal de {nombre}: {subtotal}")

        total += subtotal   # acumula

    # Descuento segun el total
    if total > 300000:
        descuento = 0.10
    elif total >= 150000:          # aqui ya sabemos que total <= 300000
        descuento = 0.05
    else:
        descuento = 0.0

    valorDescuento = total * descuento
    totalPagar = total - valorDescuento

    print("===== RESUMEN =====")
    print(f"Total antes del descuento: {total}")
    print(f"Descuento aplicado: {descuento * 100:.0f}% ({valorDescuento})")
    print(f"Total a pagar: {totalPagar}")


if __name__ == "__main__":
    main()