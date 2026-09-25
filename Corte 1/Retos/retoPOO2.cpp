#include <iostream>
#include <string>
using namespace std;

class Persona {
private:
    string tipoDoc, documento, nombre, apellido, sexo;
    double peso, estatura;
    int edad;

public:
    Persona() : peso(0), estatura(0), edad(0) {}

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

    // Ahora retorna la categoria, no el mensaje.
    string calcularImc() {
        double pesoActual = peso / (estatura * estatura);
        if (pesoActual < 20) return "PESOBAJO";
        else if (pesoActual <= 25) return "PESOIDEAL";
        else return "SOBREPESO";
    }

    string mayorEdad() {
        if (edad >= 18) return "Es mayor de edad";
        else return "Es menor de edad";
    }
};

int main() {
    Persona p;
    p.pedirDatos();
    p.mostrarPersona();

    string resultado = p.calcularImc();
    if (resultado == "PESOBAJO") cout << "El peso esta por debajo de lo ideal" << endl;
    else if (resultado == "PESOIDEAL") cout << "El peso es ideal" << endl;
    else cout << "Tiene sobrepeso" << endl;

    cout << p.mayorEdad() << endl;
    return 0;
}