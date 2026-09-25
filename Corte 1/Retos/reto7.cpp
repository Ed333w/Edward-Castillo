#include <iostream>
#include <vector>
using namespace std;

int encontrarMaximo(const vector<int> &lista) {
    int maximo = lista[0];                          // se asume que el primero es el mayor
    for (size_t i = 1; i < lista.size(); i++) {     // recorre desde el segundo hasta el final
        if (lista[i] > maximo) {                    // si hay uno mayor, se actualiza
            maximo = lista[i];
        }
    }
    return maximo;
}

int main() {
    vector<int> lista = {5, 12, 9, 7, 3, 15, 8, 10, 6, 4};
    int resultado = encontrarMaximo(lista);
    cout << "El maximo elemento en la lista es: " << resultado << endl;
    return 0;
}