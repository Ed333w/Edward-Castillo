// Declaraciones compartidas. NO MODIFIQUE ESTE ARCHIVO.
#pragma once
#include <vector>

struct Nodo {
    int clave;
    Nodo* izq;
    Nodo* der;
    int alt;
    Nodo(int c) : clave(c), izq(nullptr), der(nullptr), alt(0) {}
};

int  alt(Nodo* n);
int  fe(Nodo* n);
void recalc(Nodo* n);
Nodo* rotarDerecha(Nodo* y);
Nodo* rotarIzquierda(Nodo* x);
Nodo* insertar(Nodo* n, int clave);
bool esAVL(Nodo* n);
