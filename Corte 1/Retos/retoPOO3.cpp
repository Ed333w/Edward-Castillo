#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

// 1) Encapsulamiento: atributos privados + getters/setters publicos.
class Persona {
private:
    string tipoDoc, documento, nombre, apellido, sexo;
    double peso, estatura;
    int edad;

public:
    Persona() : peso(0), estatura(0), edad(0) {}

    // ---- Getters y setters ----
    string getTipoDoc() { return tipoDoc; }
    void setTipoDoc(string v) { tipoDoc = v; }
    string getDocumento() { return documento; }
    void setDocumento(string v) { documento = v; }
    string getNombre() { return nombre; }
    void setNombre(string v) { nombre = v; }
    string getApellido() { return apellido; }
    void setApellido(string v) { apellido = v; }
    double getPeso() { return peso; }
    void setPeso(double v) { peso = v; }
    double getEstatura() { return estatura; }
    void setEstatura(double v) { estatura = v; }
    int getEdad() { return edad; }
    void setEdad(int v) { edad = v; }
    string getSexo() { return sexo; }
    void setSexo(string v) { sexo = v; }

    void pedirDatos() {
        cout << "Tipo de documento: "; getline(cin, tipoDoc);
        cout << "Numero de documento: "; getline(cin, documento);
        cout << "Nombre: "; getline(cin, nombre);
        cout << "Apellido: "; getline(cin, apellido);
        cout << "Peso (kg): "; cin >> peso;
        cout << "Estatura (m): "; cin >> estatura;
        cout << "Edad: "; cin >> edad;
        cin.ignore();
        cout << "Sexo: "; getline(cin, sexo);
    }

    void mostrarPersona() {
        cout << "---- Datos de la persona ----" << endl;
        cout << "Tipo de documento: " << tipoDoc << endl;
        cout << "Documento: " << documento << endl;
        cout << "Nombre: " << nombre << " " << apellido << endl;
        cout << "Peso: " << peso << " kg" << endl;
        cout << "Estatura: " << estatura << " m" << endl;
        cout << "Edad: " << edad << endl;
        cout << "Sexo: " << sexo << endl;
    }

    string calcularImc() {
        double pesoActual = peso / (estatura * estatura);
        if (pesoActual < 20) return "PESOBAJO";
        else if (pesoActual <= 25) return "PESOIDEAL";
        else return "SOBREPESO";
    }

    bool mayorEdad() {
        return edad >= 18;
    }
};

// 2) Empleado hereda de Persona (herencia publica).
class Empleado : public Persona {
private:
    string cargo, departamento;
    double valorHora, horasTrabajadas;

public:
    Empleado() : valorHora(0), horasTrabajadas(0) {}

    string getCargo() { return cargo; }
    void setCargo(string v) { cargo = v; }
    double getValorHora() { return valorHora; }
    void setValorHora(double v) { valorHora = v; }
    double getHorasTrabajadas() { return horasTrabajadas; }
    void setHorasTrabajadas(double v) { horasTrabajadas = v; }
    string getDepartamento() { return departamento; }
    void setDepartamento(string v) { departamento = v; }

    void pedirDatosEmpleado() {
        pedirDatos();                         // datos heredados de Persona
        cout << "Cargo: "; getline(cin, cargo);
        cout << "Valor por hora: "; cin >> valorHora;
        cout << "Horas trabajadas: "; cin >> horasTrabajadas;
        cin.ignore();
        cout << "Departamento: "; getline(cin, departamento);
    }

    double calcularHonorarios() {
        double total = valorHora * horasTrabajadas;
        double reteica = total * 0.00966;     // 0.966% sobre el valor total
        return total - reteica;
    }

    void mostrarEmpleado() {
        double total = calcularHonorarios();
        cout << fixed << setprecision(2);
        cout << "---- Datos del empleado ----" << endl;
        cout << "Tipo y numero de documento: " << getTipoDoc() << " " << getDocumento() << endl;
        cout << "Nombres y apellidos: " << getNombre() << " " << getApellido() << endl;
        cout << "Cargo: " << cargo << endl;
        cout << "Horas trabajadas: " << horasTrabajadas << endl;
        cout << "Valor por hora: " << valorHora << endl;
        cout << "Total a pagar: " << total << endl;
    }
};

int main() {
    Empleado emp;
    emp.pedirDatosEmpleado();
    emp.mostrarEmpleado();

    string resultado = emp.calcularImc();
    if (resultado == "PESOBAJO") cout << "El peso esta por debajo de lo ideal" << endl;
    else if (resultado == "PESOIDEAL") cout << "El peso es ideal" << endl;
    else cout << "Tiene sobrepeso" << endl;

    if (emp.mayorEdad()) cout << "Es mayor de edad" << endl;
    else cout << "Es menor de edad" << endl;

    return 0;
}