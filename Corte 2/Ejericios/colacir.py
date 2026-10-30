CAPACIDAD = 5


class ColaCircular:
    def __init__(self, frente_inicial):
        self.datos = ["-"] * CAPACIDAD
        self.frente = frente_inicial
        self.cantidad = 0

    def esta_llena(self):
        return self.cantidad == CAPACIDAD

    def esta_vacia(self):
        return self.cantidad == 0

    def siguiente_posicion(self):
        return (self.frente + self.cantidad) % CAPACIDAD

    def encolar(self, valor):
        if self.esta_llena():
            print(f"Error: la cola está llena, no se puede encolar {valor}")
            return
        pos = self.siguiente_posicion()
        self.datos[pos] = valor
        self.cantidad += 1
        print(f"Encolado {valor} en la posición {pos}")

    def mostrar(self):
        celdas = " ".join(f"[{i}:{v}]" for i, v in enumerate(self.datos))
        print("Arreglo:", celdas)
        print(f"Frente = {self.frente}, cantidad = {self.cantidad}")


# Estado del ejercicio: capacidad 5, frente en 3, cuatro elementos
cola = ColaCircular(3)
cola.encolar("A")
cola.encolar("B")
cola.encolar("C")
cola.encolar("D")

print("\nEstado actual de la cola:")
cola.mostrar()

print(f"\nCálculo: (frente + cantidad) % capacidad = (3 + 4) % 5 = {cola.siguiente_posicion()}")

print("\nEncolando el siguiente elemento:")
cola.encolar("E")
cola.mostrar()

print("\nRespuesta: el siguiente elemento se guarda en la posición 2")