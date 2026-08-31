# Reto 3
# 1) Encapsulamiento en Persona: atributos privados (__) + getters/setters.
# 2) Subclase Empleado que hereda de Persona y agrega atributos y calcularHonorarios().

class Persona:
    def __init__(self):
        self.__tipoDoc = ""
        self.__documento = ""
        self.__nombre = ""
        self.__apellido = ""
        self.__peso = 0.0
        self.__estatura = 0.0
        self.__edad = 0
        self.__sexo = ""

    # ---- Getters y setters (encapsulamiento) ----
    def getTipoDoc(self): return self.__tipoDoc
    def setTipoDoc(self, v): self.__tipoDoc = v
    def getDocumento(self): return self.__documento
    def setDocumento(self, v): self.__documento = v
    def getNombre(self): return self.__nombre
    def setNombre(self, v): self.__nombre = v
    def getApellido(self): return self.__apellido
    def setApellido(self, v): self.__apellido = v
    def getPeso(self): return self.__peso
    def setPeso(self, v): self.__peso = v
    def getEstatura(self): return self.__estatura
    def setEstatura(self, v): self.__estatura = v
    def getEdad(self): return self.__edad
    def setEdad(self, v): self.__edad = v
    def getSexo(self): return self.__sexo
    def setSexo(self, v): self.__sexo = v

    def pedirDatos(self):
        self.__tipoDoc = input("Tipo de documento: ")
        self.__documento = input("Numero de documento: ")
        self.__nombre = input("Nombre: ")
        self.__apellido = input("Apellido: ")
        self.__peso = float(input("Peso (kg): "))
        self.__estatura = float(input("Estatura (m): "))
        self.__edad = int(input("Edad: "))
        self.__sexo = input("Sexo: ")

    def mostrarPersona(self):
        print("---- Datos de la persona ----")
        print(f"Tipo de documento: {self.__tipoDoc}")
        print(f"Documento: {self.__documento}")
        print(f"Nombre: {self.__nombre} {self.__apellido}")
        print(f"Peso: {self.__peso} kg")
        print(f"Estatura: {self.__estatura} m")
        print(f"Edad: {self.__edad}")
        print(f"Sexo: {self.__sexo}")

    def calcularImc(self):
        pesoActual = self.__peso / (self.__estatura ** 2)
        if pesoActual < 20:
            return "PESOBAJO"
        elif pesoActual <= 25:
            return "PESOIDEAL"
        else:
            return "SOBREPESO"

    def mayorEdad(self):
        return self.__edad >= 18


class Empleado(Persona):
    def __init__(self):
        super().__init__()          # inicializa los atributos de Persona
        self.__cargo = ""
        self.__valorHora = 0.0
        self.__horasTrabajadas = 0.0
        self.__departamento = ""

    # ---- Getters y setters propios ----
    def getCargo(self): return self.__cargo
    def setCargo(self, v): self.__cargo = v
    def getValorHora(self): return self.__valorHora
    def setValorHora(self, v): self.__valorHora = v
    def getHorasTrabajadas(self): return self.__horasTrabajadas
    def setHorasTrabajadas(self, v): self.__horasTrabajadas = v
    def getDepartamento(self): return self.__departamento
    def setDepartamento(self, v): self.__departamento = v

    def pedirDatosEmpleado(self):
        self.pedirDatos()                                  # datos heredados de Persona
        self.__cargo = input("Cargo: ")
        self.__valorHora = float(input("Valor por hora: "))
        self.__horasTrabajadas = float(input("Horas trabajadas: "))
        self.__departamento = input("Departamento: ")

    def calcularHonorarios(self):
        total = self.__valorHora * self.__horasTrabajadas
        reteica = total * 0.00966        # 0.966% sobre el valor total
        return total - reteica

    def mostrarEmpleado(self):
        total = self.calcularHonorarios()
        print("---- Datos del empleado ----")
        # usa getters heredados para acceder a los atributos privados de Persona
        print(f"Tipo y numero de documento: {self.getTipoDoc()} {self.getDocumento()}")
        print(f"Nombres y apellidos: {self.getNombre()} {self.getApellido()}")
        print(f"Cargo: {self.__cargo}")
        print(f"Horas trabajadas: {self.__horasTrabajadas}")
        print(f"Valor por hora: {self.__valorHora}")
        print(f"Total a pagar: {total}")


class Inicio:
    @staticmethod
    def main():
        emp = Empleado()
        emp.pedirDatosEmpleado()
        emp.mostrarEmpleado()

        resultado = emp.calcularImc()
        if resultado == "PESOBAJO":
            print("El peso esta por debajo de lo ideal")
        elif resultado == "PESOIDEAL":
            print("El peso es ideal")
        else:
            print("Tiene sobrepeso")

        if emp.mayorEdad():
            print("Es mayor de edad")
        else:
            print("Es menor de edad")


if __name__ == "__main__":
    Inicio.main()