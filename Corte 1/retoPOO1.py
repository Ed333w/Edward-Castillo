# Reto 1
# Aqui la clase Persona equivale al paquete Salud, y la clase Inicio al paquete Principal.

class Persona:
    def __init__(self):
        self.tipoDoc = ""
        self.documento = ""
        self.nombre = ""
        self.apellido = ""
        self.peso = 0.0
        self.estatura = 0.0
        self.edad = 0
        self.sexo = ""

    def pedirDatos(self):
        self.tipoDoc = input("Tipo de documento: ")
        self.documento = input("Numero de documento: ")
        self.nombre = input("Nombre: ")
        self.apellido = input("Apellido: ")
        self.peso = float(input("Peso (kg): "))
        self.estatura = float(input("Estatura (m): "))
        self.edad = int(input("Edad: "))
        self.sexo = input("Sexo: ")

    def mostrarPersona(self):
        print("---- Datos de la persona ----")
        print(f"Tipo de documento: {self.tipoDoc}")
        print(f"Documento: {self.documento}")
        print(f"Nombre: {self.nombre} {self.apellido}")
        print(f"Peso: {self.peso} kg")
        print(f"Estatura: {self.estatura} m")
        print(f"Edad: {self.edad}")
        print(f"Sexo: {self.sexo}")

    def calcularImc(self):
        pesoActual = self.peso / (self.estatura ** 2)
        if pesoActual < 20:
            return "El peso esta por debajo de lo ideal"
        elif pesoActual <= 25:
            return "El peso es ideal"
        else:
            return "Tiene sobrepeso"

    def mayorEdad(self):
        if self.edad >= 18:
            return "Es mayor de edad"
        else:
            return "Es menor de edad"


class Inicio:
    @staticmethod
    def main():
        p = Persona()
        p.pedirDatos()
        p.mostrarPersona()
        print(p.calcularImc())
        print(p.mayorEdad())


if __name__ == "__main__":
    Inicio.main()