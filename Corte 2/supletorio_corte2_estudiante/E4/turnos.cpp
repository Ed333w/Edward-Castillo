// ============================================================
//  Supletorio · Segundo corte · EJERCICIO 4  (20 puntos)
//  Sesiones 26 a 28 — Pilas y colas (cola circular)
//  Sistema: TurnoJusto — fila de atencion con arreglo circular
//
//  MODIFIQUE SOLO ESTE ARCHIVO.  NO TOQUE pruebas_e4.cpp ni turnos.h
//  Compile y ejecute:
//     g++ -std=c++17 -fsanitize=address -g -o pruebas_e4 turnos.cpp pruebas_e4.cpp
//     ./pruebas_e4
//
//  La cola guarda los elementos en un arreglo circular. El indice del
//  ultimo NO se guarda: se calcula a partir de 'frente' y 'cantidad'.
//  Use SIEMPRE aritmetica modular con 'cap'.
// ============================================================
#include <string>
#include "turnos.h"
using namespace std;

ColaCircular::ColaCircular(int capacidad) {
    cap = capacidad;
    dato = new int[cap];
    frente = 0;
    cantidad = 0;
}

ColaCircular::~ColaCircular() {
    delete[] dato;
}

bool ColaCircular::estaLlena() const { return cantidad == cap; }
bool ColaCircular::estaVacia() const { return cantidad == 0; }

int ColaCircular::verFrente() const {
    if (estaVacia()) {
        return -1;                                      // Cola vacía
    }
    return dato[frente];                                // Devuelve el elemento del frente
}

bool ColaCircular::encolar(int x) {
    // Agrega x al FINAL. Si la cola esta llena, devuelve false sin hacer nada
    // (desbordamiento controlado).
    // La posicion del final se calcula: (frente + cantidad) % cap
    // PENDIENTE: implementar.
    
    if (estaLlena()) {
        return false;                                   // Cola llena, no se puede encolar
    }
    int final = (frente + cantidad) % cap;
    dato[final] = x;
    cantidad++;
    return true;    
}

bool ColaCircular::desencolar(int& out) {
    // Saca el elemento del frente y lo deja en 'out'. Si esta vacia,
    // devuelve false sin tocar 'out' (subdesbordamiento controlado).
    // Recuerde avanzar 'frente' de forma circular.
    // PENDIENTE: implementar.
    if (estaVacia()) {
        return false;                                    // Cola vacía, no se puede desencolar
    }
    out = dato[frente];
    frente = (frente + 1) % cap;
    cantidad--;
    return true;
}

void ColaCircular::redimensionar() {
    // Duplica la capacidad CONSERVANDO el orden de salida.
    // Ojo: los elementos pueden estar partidos en dos tramos del arreglo
    // viejo (los que estan al final y los que dieron la vuelta al inicio).
    // Al terminar, el nuevo arreglo debe quedar con el frente en 0.
    // No olvide liberar el arreglo viejo.
    // PENDIENTE: implementar.

    int nuevaCapacidad = cap * 2;
    int* nuevoDato = new int[nuevaCapacidad];

    for (int i = 0; i < cantidad; ++i) {                 // Copia los elementos en orden de salida al nuevo arreglo
        nuevoDato[i] = dato[(frente + i) % cap];
    }

    delete[] dato;                                       // Libera el arreglo viejo
    dato = nuevoDato;
    cap = nuevaCapacidad;
    frente = 0;                                          // El frente queda en 0
}

string ColaCircular::contenido() const {
    // Devuelve los elementos separados por un espacio, en ORDEN DE SALIDA.
    // Cola vacia -> cadena vacia "".
    // Ejemplo: si salen 11, 22 y 33 -> "11 22 33"
    // PENDIENTE: implementar.

    return "";
}
