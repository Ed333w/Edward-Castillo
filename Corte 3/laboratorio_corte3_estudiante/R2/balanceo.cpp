// ============================================================
//  Laboratorio integrador · Corte 3 · RETO 2  (25 puntos)
//  Sesiones 37 y 38 — Rotaciones y arboles AVL
//  Sistema: RedAcopio — el indice se degrada con codigos consecutivos
//
//  Este archivo NO tiene main(): el main esta en pruebas_r2.cpp
//  MODIFIQUE SOLO ESTE ARCHIVO.  NO TOQUE pruebas_r2.cpp
//  Compile y ejecute:
//      g++ -std=c++17 -g -o pruebas_r2 balanceo.cpp pruebas_r2.cpp
//      ./pruebas_r2
// estudiante: Juan Ruiz
// ============================================================
#include <algorithm>
#include "avl.h"
using namespace std;

int  alt(Nodo* n)    { return n == nullptr ? -1 : n->alt; }
int  fe(Nodo* n)     { return n == nullptr ? 0 : alt(n->izq) - alt(n->der); }
void recalc(Nodo* n) { n->alt = 1 + max(alt(n->izq), alt(n->der)); }

Nodo* rotarDerecha(Nodo* y) {
    //         y                 x
    //        / \               / \
    //       x   C   ==>       A   y
    //      / \                   / \
    //     A   B                 B   C
    Nodo* x = y->izq;
    Nodo* B = x->der;
    x->der = y;
    y->izq = B;
    recalc(y); recalc(x);      // primero el que BAJA, luego el que SUBE
    return x;
}

Nodo* rotarIzquierda(Nodo* x) {
    //       x                   y
    //      / \                 / \
    //     A   y     ==>       x   C
    //        / \             / \
    //       B   C           A   B
    //
    Nodo* y = x->der;
    Nodo* B = y->izq;
    y->izq = x;
    x->der = B;
    recalc(x); recalc(y);
    return y;
}

Nodo* insertar(Nodo* n, int clave) {
    // FASE 1 — insercion normal de BST
    if (n == nullptr) return new Nodo(clave);
    if      (clave < n->clave) n->izq = insertar(n->izq, clave);
    else if (clave > n->clave) n->der = insertar(n->der, clave);
    else return n;

    // FASE 2 — actualizar la altura de este nodo
    recalc(n);

    // FASE 3 — revisar el equilibrio y rotar si hace falta
    int b = fe(n);

    if (b > 1 && clave < n->izq->clave) {            // caso LL  (ya resuelto)
        return rotarDerecha(n);
    }
    // caso RR    -> fe < -1 y la clave entro a la DERECHA del hijo derecho
    if (b < -1 && clave > n->der->clave) {
        return rotarIzquierda(n);
    }

    // caso LR    -> fe >  1 y la clave entro a la DERECHA del hijo izquierdo
    if (b > 1 && clave > n->izq->clave) {
        n->izq = rotarIzquierda(n->izq);
        return rotarDerecha(n);
    }

    if (b < -1 && clave < n->der->clave) {           // caso RL  (ya resuelto)
        n->der = rotarDerecha(n->der);
        return rotarIzquierda(n);
    }
    return n;
}

bool esAVL(Nodo* n) {
    if (n == nullptr) return true;
    return abs(fe(n)) <= 1 && esAVL(n->izq) && esAVL(n->der);
}