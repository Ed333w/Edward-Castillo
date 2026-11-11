// NO MODIFIQUE ESTE ARCHIVO. Alterarlo se considera fraude academico
// segun la seccion 13 de la guia de asignatura.
#include <iostream>
#include <string>
#include <vector>
#include <cmath>
#include "rangos.h"
using namespace std;

static int fallas = 0;
static void chk(const string& nombre, int obtenido, int esperado) {
    bool ok = (obtenido == esperado);
    cout << "  [" << (ok ? "OK " : "FALLA") << "] " << nombre << ": obtuvo " << obtenido;
    if (!ok) cout << "  (esperaba " << esperado << ")";
    cout << endl;
    if (!ok) fallas++;
}

int main() {
    cout << "EJERCICIO 2 · rangos en arreglo con repetidos · verificacion" << endl;

    int v[] = {10, 20, 20, 20, 30, 40, 40, 55};
    const int N = 8;

    chk("primera de 20",            primeraAparicion(v, N, 20), 1);
    chk("ultima de 20",             ultimaAparicion(v, N, 20), 3);
    chk("cuantos 20",               cuantos(v, N, 20), 3);
    chk("primera de 10 (borde izq)",primeraAparicion(v, N, 10), 0);
    chk("ultima de 55 (borde der)", ultimaAparicion(v, N, 55), 7);
    chk("primera de 40",            primeraAparicion(v, N, 40), 5);
    chk("cuantos 40",               cuantos(v, N, 40), 2);
    chk("cuantos 30 (unico)",       cuantos(v, N, 30), 1);
    chk("primera de 99 (ausente)",  primeraAparicion(v, N, 99), -1);
    chk("ultima de 5 (ausente)",    ultimaAparicion(v, N, 5), -1);
    chk("cuantos 99 (ausente)",     cuantos(v, N, 99), 0);

    int uno[] = {7};
    chk("arreglo de 1: cuantos 7", cuantos(uno, 1, 7), 1);
    chk("arreglo de 1: cuantos 8", cuantos(uno, 1, 8), 0);

    // --- control de complejidad: 100.000 valores, todos iguales ---
    const int M = 100000;
    vector<int> g(M, 42);
    COMPARACIONES = 0;
    int pa = primeraAparicion(g.data(), M, 42);
    int ua = ultimaAparicion(g.data(), M, 42);
    long long usadas = COMPARACIONES;
    long long tope = 6 * (long long)ceil(log2((double)M));   // margen amplio

    chk("100.000 iguales: primera", pa, 0);
    chk("100.000 iguales: ultima",  ua, M - 1);
    bool logaritmica = (usadas > 0 && usadas <= tope);
    cout << "  [" << (logaritmica ? "OK " : "FALLA")
         << "] la busqueda es logaritmica: uso " << usadas
         << " comparaciones (tope " << tope << ")";
    if (!logaritmica) {
        if (usadas == 0) cout << "  (no esta contando COMPARACIONES)";
        else cout << "  (esta recorriendo el arreglo de forma lineal)";
    }
    cout << endl;
    if (!logaritmica) fallas++;

    if (fallas == 0) {
        // el codigo se DERIVA de los resultados correctos: no esta escrito aqui
        cout << "\n  EJERCICIO 2 CERRADO — codigo de cierre: 2252-"
             << cuantos(v, N, 20) << primeraAparicion(v, N, 40)
             << ultimaAparicion(v, N, 55) << cuantos(v, N, 40) << endl;
    } else {
        cout << "\n  Ejercicio ABIERTO (" << fallas
             << " falla(s)). Corrija y vuelva a ejecutar." << endl;
    }
    return 0;
}
