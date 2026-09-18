#include <iostream>
#include <chrono>   // para medir el tiempo
using namespace std;

/* Bubble Sort */
void bubbleSort(int arr[], int n, long long &comparaciones, long long &intercambios) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            comparaciones++;                     // se compara arr[j] con arr[j+1]
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                intercambios++;                  // hubo intercambio
            }
        }
    }
}
/* Selection Sort */
void selectionSort(int arr[], int n, long long &comparaciones, long long &intercambios) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            comparaciones++;                     // se compara arr[j] con arr[minIdx]
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
        intercambios++;                          // un intercambio por cada pasada
    }
}
/* Insertion Sort */
void insertionSort(int arr[], int n, long long &comparaciones, long long &intercambios) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // La comparacion vivia dentro del while; se separa para poder contarla.
        while (j >= 0) {
            comparaciones++;                     // se compara arr[j] con key
            if (arr[j] <= key) break;            // misma condicion de corte que el while original
            arr[j + 1] = arr[j];
            intercambios++;                      // desplazamiento (movimiento de dato)
            j--;
        }
        arr[j + 1] = key;
    }
}

/* ---------- Medicion de tiempo, comparaciones e intercambios ---------- */
int main() {
    const int n = 10000;   // tamano del arreglo de prueba

    // arreglo base con numeros en orden inverso (peor caso aproximado)
    int base[n];
    for (int i = 0; i < n; i++) base[i] = n - i;

    // copias para que cada algoritmo ordene los MISMOS datos
    int a[n], b[n], c[n];
    for (int i = 0; i < n; i++) { a[i] = base[i]; b[i] = base[i]; c[i] = base[i]; }

    long long comparaciones, intercambios;
    auto inicio = chrono::high_resolution_clock::now();
    auto fin = inicio;

    // --- Bubble Sort ---
    comparaciones = 0; intercambios = 0;
    inicio = chrono::high_resolution_clock::now();
    bubbleSort(a, n, comparaciones, intercambios);
    fin = chrono::high_resolution_clock::now();
    double tBubble = chrono::duration<double, milli>(fin - inicio).count();
    cout << "Bubble Sort    -> tiempo: " << tBubble << " ms"
         << " | comparaciones: " << comparaciones
         << " | intercambios: " << intercambios << endl;

    // --- Selection Sort ---
    comparaciones = 0; intercambios = 0;
    inicio = chrono::high_resolution_clock::now();
    selectionSort(b, n, comparaciones, intercambios);
    fin = chrono::high_resolution_clock::now();
    double tSelection = chrono::duration<double, milli>(fin - inicio).count();
    cout << "Selection Sort -> tiempo: " << tSelection << " ms"
         << " | comparaciones: " << comparaciones
         << " | intercambios: " << intercambios << endl;

    // --- Insertion Sort ---
    comparaciones = 0; intercambios = 0;
    inicio = chrono::high_resolution_clock::now();
    insertionSort(c, n, comparaciones, intercambios);
    fin = chrono::high_resolution_clock::now();
    double tInsertion = chrono::duration<double, milli>(fin - inicio).count();
    cout << "Insertion Sort -> tiempo: " << tInsertion << " ms"
         << " | comparaciones: " << comparaciones
         << " | intercambios: " << intercambios << endl;

    return 0;
}