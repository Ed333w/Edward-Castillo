#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cout << "Cuantos productos va a comprar? ";
    cin >> n;
    cin.ignore();   // limpia el salto de linea antes de leer con getline

    double total = 0.0;   // acumulador

    for (int i = 0; i < n; i++) {
        cout << "--- Producto " << (i + 1) << " ---" << endl;

        string nombre;
        double precio;
        int cantidad;

        cout << "Nombre del producto: "; getline(cin, nombre);
        cout << "Precio unitario: "; cin >> precio;
        cout << "Cantidad comprada: "; cin >> cantidad;
        cin.ignore();   // limpia el salto antes del siguiente getline

        double subtotal = precio * cantidad;
        cout << "Subtotal de " << nombre << ": " << subtotal << endl;

        total += subtotal;   // acumula
    }

    // Descuento segun el total
    double descuento;
    if (total > 300000) descuento = 0.10;
    else if (total >= 150000) descuento = 0.05;   // total <= 300000 en esta rama
    else descuento = 0.0;

    double valorDescuento = total * descuento;
    double totalPagar = total - valorDescuento;

    cout << fixed << setprecision(2);
    cout << "===== RESUMEN =====" << endl;
    cout << "Total antes del descuento: " << total << endl;
    cout << "Descuento aplicado: " << descuento * 100 << "% (" << valorDescuento << ")" << endl;
    cout << "Total a pagar: " << totalPagar << endl;

    return 0;
}