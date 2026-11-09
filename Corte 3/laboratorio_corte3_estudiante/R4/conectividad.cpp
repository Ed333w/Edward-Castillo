// ============================================================
//  Laboratorio integrador · Corte 3 · RETO 4  (25 puntos)
//  Sesiones 41 y 43 — DFS, componentes conexas y vias criticas
//  Sistema: RedAcopio — que vias no pueden cerrarse
//
//  Este archivo NO tiene main(): el main esta en pruebas_r4.cpp
//  MODIFIQUE SOLO ESTE ARCHIVO.  NO TOQUE pruebas_r4.cpp ni red.h
//  Compile y ejecute:
//     g++ -std=c++17 -g -o pruebas_r4 conectividad.cpp pruebas_r4.cpp
//     ./pruebas_r4
// Estudiante: Edward Castillo 
// ============================================================
#include <vector>
#include <string>
#include "red.h"
using namespace std;

int cuantasComponentes(const vector<vector<int>>& g) {
    // Cuenta en cuantos pedazos esta partida la red.
    // Lance un DFS desde cada vertice que todavia no haya sido visitado;
    // cada DFS que arranca es una componente nueva.
    // Usa una PILA explicita (vector<int> con push_back y pop_back), no recursion.
    int n = (int)g.size();
    vector<bool> visitado(n, false);
    int componentes = 0;

    for (int inicio = 0; inicio < n; inicio++) {
        if (visitado[inicio]) continue;

        // Un DFS nuevo arranca aqui -> componente nueva
        componentes++;
        vector<int> pila;
        pila.push_back(inicio);
        visitado[inicio] = true;

        while (!pila.empty()) {
            int u = pila.back();
            pila.pop_back();
            for (int v : g[u]) {
                if (!visitado[v]) {
                    visitado[v] = true;
                    pila.push_back(v);
                }
            }
        }
    }
    return componentes;
}

vector<string> viasCriticas() {
    // Una via es CRITICA si al cerrarla la red deja de estar conectada.
    // Para cada arista: arme la red SIN esa arista y cuente componentes.
    // Si pasa de 1 a mas de 1, la via es critica.
    // Formato "ORIGEN-DESTINO", en el orden en que aparecen en ARISTAS.
    vector<string> criticas;

    for (size_t i = 0; i < ARISTAS.size(); i++) {
        // Copia de las aristas sin la i-esima
        vector<pair<int,int>> sinUna;
        for (size_t j = 0; j < ARISTAS.size(); j++) {
            if (j != i) sinUna.push_back(ARISTAS[j]);
        }

        if (cuantasComponentes(construir(sinUna)) > 1) {
            auto [u, v] = ARISTAS[i];
            criticas.push_back(NOMBRES[u] + "-" + NOMBRES[v]);
        }
    }
    return criticas;
}

