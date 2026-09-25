#include <iostream>
#include <cstdlib>
#include <ctime>
#include <string>
using namespace std;

/*
 * RETO III
 * Simula el juego del "carisellazo" (cara o sello).
 * - Se simula el lanzamiento de una moneda usando rand()
 * - El jugador elige Cara o Sello antes de que caiga la moneda
 * - El juego indica si gana o pierde, comparando la eleccion del jugador
 *   con el resultado del lanzamiento
 */

int main() {
    // Inicializamos la semilla de numeros aleatorios con la hora actual
    srand(static_cast<unsigned int>(time(0)));

    string eleccionJugador;

    cout << "   RETO III - Juego del Carisellazo" << endl;

    cout << "Elige Cara o Sello (escribe 'cara' o 'sello'): ";
    cin >> eleccionJugador;

    // Convertimos a minusculas para comparar sin importar mayusculas
    for (auto &c : eleccionJugador) c = tolower(c);

    // Validamos que la entrada sea correcta
    while (eleccionJugador != "cara" && eleccionJugador != "sello") {
        cout << "Opcion invalida. Escribe 'cara' o 'sello': ";
        cin >> eleccionJugador;
        for (auto &c : eleccionJugador) c = tolower(c);
    }

    // Generamos un numero aleatorio entre 0 y 1 para simular el lanzamiento
    // 0 = cara, 1 = sello
    int lanzamiento = rand() % 2;
    string resultadoMoneda = (lanzamiento == 0) ? "cara" : "sello";

    cout << "-------------------------------------" << endl;
    cout << "La moneda cayo en: " << resultadoMoneda << endl;

    if (eleccionJugador == resultadoMoneda) {
        cout << "Felicidades, GANASTE!" << endl;
    } else {
        cout << "Lo siento, PERDISTE." << endl;
    }

    cout << "=====================================" << endl;

    return 0;
}