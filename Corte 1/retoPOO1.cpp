#include <iostream>
#include <string>
using namespace std;

// La clase Persona equivale al paquete Salud.
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

    string calcularImc() {
        double pesoActual = peso / (estatura * estatura);
        if (pesoActual < 20) return "El peso esta por debajo de lo ideal";
        else if (pesoActual <= 25) return "El peso es ideal";
        else return "Tiene sobrepeso";
    }

    string mayorEdad() {
        if (edad >= 18) return "Es mayor de edad";
        else return "Es menor de edad";
    }
};

// main() hace las veces de la clase Inicio (paquete Principal).
int main() {
    Persona p;
    p.pedirDatos();
    p.mostrarPersona();
    cout << p.calcularImc() << endl;
    cout << p.mayorEdad() << endl;
    return 0;
}