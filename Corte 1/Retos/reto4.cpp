#include <iostream>
#include <cstdlib>
#include <ctime>
#include <map>
#include <string>
using namespace std;

/*
 * RETO 4
 * Simulacion del juego "Piedra, Papel o Tijera" contra la maquina.
 * Reglas:
 * - Piedra vence a Tijera
 * - Tijera vence a Papel
 * - Papel vence a Piedra
 */

int main() {
    // Inicializamos la semilla de numeros aleatorios con la hora actual
    srand(static_cast<unsigned int>(time(0)));

    int opcionJugador;

    cout << "   RETO 4 - Piedra, Papel o Tijera" << endl;
    cout << "Opciones: 1) Piedra   2) Papel   3) Tijera" << endl;
    cout << "Elige tu jugada (1, 2 o 3): ";
    cin >> opcionJugador;

    // Validamos que la opcion sea correcta
    while (opcionJugador < 1 || opcionJugador > 3) {
        cout << "Opcion invalida. Elige 1, 2 o 3: ";
        cin >> opcionJugador;
    }

    // La maquina genera su jugada aleatoriamente (1, 2 o 3)
    int opcionMaquina = (rand() % 3) + 1;

    map<int, string> nombres = {{1, "Piedra"}, {2, "Papel"}, {3, "Tijera"}};

    cout << "-------------------------------------" << endl;
    cout << "Tu elegiste: " << nombres[opcionJugador] << endl;
    cout << "La maquina eligio: " << nombres[opcionMaquina] << endl;
    cout << "-------------------------------------" << endl;

    // Determinamos el resultado
    if (opcionJugador == opcionMaquina) {
        cout << "Resultado: EMPATE" << endl;
    } else if (
        (opcionJugador == 1 && opcionMaquina == 3) ||  // Piedra vence a Tijera
        (opcionJugador == 3 && opcionMaquina == 2) ||  // Tijera vence a Papel
        (opcionJugador == 2 && opcionMaquina == 1)     // Papel vence a Piedra
    ) {
        cout << "Resultado: GANASTE!" << endl;
    } else {
        cout << "Resultado: PERDISTE." << endl;
    }

    cout << "=====================================" << endl;

    return 0;
}