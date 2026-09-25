#include <iostream>
#include <iomanip>
using namespace std;

/*
 * RETO 2
 * El centro de salud Famisalud aplica vacunas a bebes menores de un año.
 * La dosis depende del peso y la edad del bebe segun la formula:
 *
 *      dosisvacuna = ((pesobebe + 10) / (mesesbebe * 10)) * 8
 */

int main() {
    double pesoBebe, mesesBebe;

    cout << "=====================================" << endl;
    cout << "   RETO 2 - Centro de Salud Famisalud" << endl;
    cout << "=====================================" << endl;

    cout << "Ingrese el peso del bebe (en kg): ";
    cin >> pesoBebe;

    cout << "Ingrese la edad del bebe (en meses): ";
    cin >> mesesBebe;

    // Aplicamos la formula: dosisvacuna = ((pesobebe + 10) / (mesesbebe * 10)) * 8
    double dosisVacuna = ((pesoBebe + 10) / (mesesBebe * 10)) * 8;

    cout << "-------------------------------------" << endl;
    cout << fixed << setprecision(2);
    cout << "La dosis de vacuna a aplicar es: " << dosisVacuna << " ml" << endl;
    cout << "=====================================" << endl;

    return 0;
}