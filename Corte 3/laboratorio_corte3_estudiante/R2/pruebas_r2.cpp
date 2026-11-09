// NO MODIFIQUE ESTE ARCHIVO. Alterarlo se considera fraude academico
// segun la seccion 13 de la guia de asignatura.
#include <iostream>
#include <string>
#include <vector>
#include "avl.h"
using namespace std;

static int fallas = 0;
static void chk(const string& nombre, int obtenido, int esperado) {
    bool ok = (obtenido == esperado);
    cout << "  [" << (ok ? "OK " : "FALLA") << "] " << nombre << ": obtuvo " << obtenido;
    if (!ok) cout << "  (esperaba " << esperado << ")";
    cout << endl;
    if (!ok) fallas++;
}
static void inorden(Nodo* n, vector<int>& s) {
    if (!n) return; inorden(n->izq, s); s.push_back(n->clave); inorden(n->der, s);
}
static Nodo* armar(const vector<int>& v) {
    Nodo* r = nullptr;
    for (int c : v) r = insertar(r, c);
    return r;
}
static void liberar(Nodo* n) { if (!n) return; liberar(n->izq); liberar(n->der); delete n; }

int main() {
    cout << "RETO 2 · balanceo AVL · verificacion" << endl;

    // --- rotarIzquierda aislada: 10 -> 20 -> 30 debe quedar con raiz 20
    Nodo* t = new Nodo(10); t->der = new Nodo(20); t->der->der = new Nodo(30);
    recalc(t->der->der); recalc(t->der); recalc(t);
    t = rotarIzquierda(t);
    chk("rotarIzquierda deja de raiz el 20", t ? t->clave : -1, 20);
    chk("rotarIzquierda: hijo izquierdo", (t && t->izq) ? t->izq->clave : -1, 10);
    chk("rotarIzquierda: hijo derecho",   (t && t->der) ? t->der->clave : -1, 30);
    chk("rotarIzquierda: altura resultante", alt(t), 1);
    liberar(t);

    // --- caso RR: codigos consecutivos ascendentes
    Nodo* a = armar({100, 200, 300, 400, 500, 600, 700});
    vector<int> s; inorden(a, s);
    chk("RR: altura con 7 claves ascendentes", alt(a), 2);
    chk("RR: sigue ordenado", (int)(s == vector<int>{100,200,300,400,500,600,700}), 1);
    chk("RR: la raiz quedo en 400", a->clave, 400);
    chk("RR: cumple la condicion AVL", (int)esAVL(a), 1);

    // --- caso LR: entra a la derecha del hijo izquierdo
    Nodo* b = armar({300, 100, 200});
    chk("LR: la raiz quedo en 200", b->clave, 200);
    chk("LR: cumple la condicion AVL", (int)esAVL(b), 1);

    // --- caso LL y RL (ya resueltos): no deben romperse
    Nodo* c = armar({300, 200, 100});
    chk("LL: la raiz quedo en 200", c->clave, 200);
    Nodo* d = armar({100, 300, 200});
    chk("RL: la raiz quedo en 200", d->clave, 200);

    // --- descendente: todo RR invertido
    Nodo* e = armar({700, 600, 500, 400, 300, 200, 100});
    chk("descendente: altura", alt(e), 2);
    chk("descendente: cumple la condicion AVL", (int)esAVL(e), 1);

    if (fallas == 0) {
        // el codigo se DERIVA de los resultados correctos: no esta escrito aqui
        cout << "\n  RETO 2 CERRADO — codigo de cierre: 3302-"
             << alt(a) << a->clave << b->clave << alt(e) << endl;
    } else {
        cout << "\n  Reto ABIERTO (" << fallas << " falla(s)). Corrija y vuelva a ejecutar." << endl;
    }
    liberar(a); liberar(b); liberar(c); liberar(d); liberar(e);
    return 0;
}
