/* Arreglos en C++ 
es un bloque de memoria contigua que almacena informacion que tienen el mismo tipo*/

// vector estatico, tipo nombrevector[tamañovector];
// vector dinamico, tipo nombrevector[tamañovector];
// inicializacion de un vector estatico
// tipo nombrevector[tamañovector] = {valor1, valor2, valor3, ...};

//int numeros[5] = {1, 2, 3, 4, 5}; // vector estatico de enteros con 5 elementos
// mostrar los elementos del vector
//numeros[0]; // 1 
//float numero[10]; // 2

#include <iostream>
using namespace std;

int main(){
    int N = 10;
    float Gxpergame[N] = {1.2, 2.8, 0.6, 3.4, 1.9, 2.5, 0.8, 1.7, 2.2, 3.0};

    float maximo = Gxpergame[0];
    float minimo = Gxpergame[0];
    
    return 0;
}

