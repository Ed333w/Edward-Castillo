#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

/*
 * RETO 3
 * Dados dos numeros, mostrar el resultado de:
 * suma, resta, multiplicacion, division, raiz cuadrada y potenciacion.
 */

int main() {
    double num1, num2;

    cout << "   RETO 3 - Calculadora" << endl;

    cout << "Ingrese el primer numero: ";
    cin >> num1;

    cout << "Ingrese el segundo numero: ";
    cin >> num2;

    double suma = num1 + num2;
    double resta = num1 - num2;
    double multiplicacion = num1 * num2;

    cout << "-------------------------------------" << endl;
    cout << fixed << setprecision(2);
    cout << "Suma: " << num1 << " + " << num2 << " = " << suma << endl;
    cout << "Resta: " << num1 << " - " << num2 << " = " << resta << endl;
    cout << "Multiplicacion: " << num1 << " * " << num2 << " = " << multiplicacion << endl;

    // Division: validamos que no se divida entre 0
    if (num2 != 0) {
        double division = num1 / num2;
        cout << "Division: " << num1 << " / " << num2 << " = " << division << endl;
    } else {
        cout << "Division: no se puede dividir entre 0" << endl;
    }

    // Raiz cuadrada de cada numero (validamos que no sean negativos)
    if (num1 >= 0) {
        cout << "Raiz cuadrada de " << num1 << " = " << sqrt(num1) << endl;
    } else {
        cout << "Raiz cuadrada de " << num1 << " no existe en los reales" << endl;
    }

    if (num2 >= 0) {
        cout << "Raiz cuadrada de " << num2 << " = " << sqrt(num2) << endl;
    } else {
        cout << "Raiz cuadrada de " << num2 << " no existe en los reales" << endl;
    }

    // Potenciacion: num1 elevado a num2
    double potenciacion = pow(num1, num2);
    cout << "Potenciacion: " << num1 << " ^ " << num2 << " = " << potenciacion << endl;

    cout << "=====================================" << endl;

    return 0;
}