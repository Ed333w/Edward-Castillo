#include <iostream>
#include <deque>
#include <queue>
using namespace std;

// PILAS: usamos std::deque porque el juego exige agregar cartas al FONDO,
//        y std::stack solo permite operar por la cima. Con deque tratamos
//        la cima como el extremo de atras (back) y el fondo como el frente (front).
// COLA:  usamos std::queue normal (FIFO).

int main() {
    // cima de la pila = back
    deque<int> pila1 = {2, 7, 5, 9, 3};    // cima J1 = 3
    deque<int> pila2 = {1, 8, 6, 4, 10};   // cima J2 = 10

    queue<int> mazo;
    int cartasMazo[] = {5, 12, 9, 7, 3, 15, 8, 10, 6, 4};
    for (int c : cartasMazo) mazo.push(c);

    int turno = 1;
    while (mazo.size() >= 2 && !pila1.empty() && !pila2.empty()) {
        // 1. carta superior de cada pila (back = cima)
        int c1 = pila1.back(); pila1.pop_back();
        int c2 = pila2.back(); pila2.pop_back();

        // 2. una carta del mazo para cada jugador (front = frente de la cola)
        int d1 = mazo.front(); mazo.pop();
        int d2 = mazo.front(); mazo.pop();

        int suma1 = c1 + d1;
        int suma2 = c2 + d2;

        cout << "Turno " << turno << ": J1 juega " << c1 << "+" << d1 << "=" << suma1
             << " | J2 juega " << c2 << "+" << d2 << "=" << suma2 << "  ";

        // 3-4. ganador del turno reparte las 4 cartas al fondo (push_front)
        if (suma1 > suma2) {
            pila1.push_front(c1); pila1.push_front(c2);
            pila1.push_front(d1); pila1.push_front(d2);
            cout << "-> gana J1" << endl;
        } else if (suma2 > suma1) {
            pila2.push_front(c1); pila2.push_front(c2);
            pila2.push_front(d1); pila2.push_front(d2);
            cout << "-> gana J2" << endl;
        } else {
            // empate: cada uno recupera sus cartas
            pila1.push_front(c1); pila1.push_front(d1);
            pila2.push_front(c2); pila2.push_front(d2);
            cout << "-> empate" << endl;
        }
        turno++;
    }

    cout << "\n===== RESULTADO FINAL =====" << endl;
    cout << "Jugador 1 tiene " << pila1.size() << " cartas" << endl;
    cout << "Jugador 2 tiene " << pila2.size() << " cartas" << endl;

    if (pila1.size() > pila2.size()) cout << "GANADOR: Jugador 1" << endl;
    else if (pila2.size() > pila1.size()) cout << "GANADOR: Jugador 2" << endl;
    else cout << "EMPATE: ambos tienen la misma cantidad de cartas" << endl;

    return 0;
}