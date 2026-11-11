// ============================================================
//  Supletorio · Segundo corte · EJERCICIO 2  (20 puntos)
//  Sesion 16 y sesiones 21 a 23 — Busqueda binaria y complejidad
//  Sistema: RedAcopio — codigos de material con REPETIDOS
//
//  Este archivo NO tiene main(): el main esta en pruebas_e2.cpp
//  MODIFIQUE SOLO ESTE ARCHIVO.  NO TOQUE pruebas_e2.cpp ni rangos.h
//  Compile y ejecute:
//     g++ -std=c++17 -g -o pruebas_e2 rangos.cpp pruebas_e2.cpp
//     ./pruebas_e2
//
//  El arreglo esta ordenado de forma NO DECRECIENTE y puede tener
//  valores repetidos. Las tres funciones deben ser O(log n):
//  el verificador cuenta las comparaciones y RECHAZA una solucion
//  que recorra el arreglo de forma lineal.
// ============================================================
#include "rangos.h"

long long COMPARACIONES = 0;      // el verificador la lee; no la toque

int primeraAparicion(int v[], int n, int x) {
    // Devuelve el indice de la PRIMERA aparicion de x, o -1 si no esta.
    // Ejemplo: v = {10,20,20,20,30,40}, x = 20  ->  1
    //
    // No basta con encontrar una aparicion cualquiera y retroceder:
    // con 100.000 repetidos eso seria O(n). Al encontrar x, siga
    // buscando hacia la IZQUIERDA sin perder el candidato.
    //
    // Incremente COMPARACIONES una vez por cada vez que compare
    // v[medio] con x.
    //
    // PENDIENTE: implementar.
    int izquierda = 0;
    int derecha = n - 1;
    int resultado = -1;

    while (izquierda <= derecha) {                                  // Mientras haya elementos por revisar
        int medio = izquierda + (derecha - izquierda) / 2;
        COMPARACIONES++;                                            // Contar la comparación
        if (v[medio] == x) {
            resultado = medio;                                      // Guardar el índice de la aparición
            derecha = medio - 1;                                    // Seguir buscando a la izquierda
        } else if (v[medio] < x) {
            izquierda = medio + 1;                                  // Buscar a la derecha
        } else {
            derecha = medio - 1;                                    // Buscar a la izquierda
        }
    }

    return resultado;
}

//Índice de la ÚLTIMA aparición de x, o −1 si no está.
int ultimaAparicion(int v[], int n, int x) {
    // Devuelve el indice de la ULTIMA aparicion de x, o -1 si no esta.
    // Ejemplo: v = {10,20,20,20,30,40}, x = 20  ->  3
    //
    // PENDIENTE: implementar.

    int izquierda = 0;
    int derecha = n - 1;
    int resultado = -1;

    while (izquierda <= derecha) {                                  // Mientras haya elementos por revisar
        int medio = izquierda + (derecha - izquierda) / 2;
        COMPARACIONES++;                                            // Contar la comparación
        if (v[medio] == x) {
            resultado = medio;                                      // Guardar el índice de la aparición
            izquierda = medio + 1;                                  // Seguir buscando a la derecha
        } else if (v[medio] < x) {
            izquierda = medio + 1;                                  // Buscar a la derecha
        } else {
            derecha = medio - 1;                                    // Buscar a la izquierda
        }
    }

    return resultado;
}

int cuantos(int v[], int n, int x) {
    // Devuelve cuantas veces aparece x. Si no esta, devuelve 0.
    // Debe apoyarse en las dos funciones anteriores.
    //
    // PENDIENTE: implementar.
    int primera = primeraAparicion(v, n, x);                        // Encuentra la primera aparición de x
    if (primera == -1) {                                            // Si no se encuentra x, devuelve 0
        return 0; // x no está en el arreglo                        
    }
    int ultima = ultimaAparicion(v, n, x);
    return ultima - primera + 1; // Número de apariciones           // devuelve la cantidad de apariciones de x
}