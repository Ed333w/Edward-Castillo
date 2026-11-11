// Declaraciones de la cola circular. NO MODIFIQUE ESTE ARCHIVO.
#pragma once
#include <string>

class ColaCircular {
public:
    int* dato;
    int  cap;        // capacidad actual del arreglo
    int  frente;     // indice del primero
    int  cantidad;   // cuantos elementos hay

    ColaCircular(int capacidad);
    ~ColaCircular();

    bool encolar(int x);       // false si esta llena
    bool desencolar(int& out); // false si esta vacia
    bool estaLlena() const;
    bool estaVacia() const;
    int  verFrente() const;    // -1 si esta vacia
    void redimensionar();      // duplica la capacidad conservando el orden
    std::string contenido() const;  // "11 22 33" en orden de salida
};
