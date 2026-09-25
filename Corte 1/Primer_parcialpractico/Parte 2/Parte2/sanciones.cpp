// ============================================================
//  Cívica Software  ·  TCK-5511  ·  Severidad P2
//  Sistema: PrestaLab  —  Registro de sanciones de usuarios
//  Compile SIEMPRE con:
//     g++ -std=c++17 -fsanitize=address -g -o sanciones sanciones.cpp
//
//  Dos problemas reportados:
//   1. El listado imprime "Usuario" para todos, sin distinguir el tipo.
//   2. Las sanciones del PRIMER incidente no se estan contando.
//   3. El proceso consume memoria sin parar.
// ============================================================
#include <iostream>
#include <string>
using namespace std;

class Usuario {
protected:
    string codigo;
    int*   dias;      // dias de sancion acumulados por incidente
    int    n;
public:
    Usuario(string c, int cantidad) : codigo(c), n(cantidad) {
        dias = new int[n];
        for (int i = 0; i < n; i++) dias[i] = 0;
    }
    // FALTA ALGO AQUI  (pista: esta clase pide memoria en el constructor)

    void sancionar(int i, int d) { if (i >= 0 && i < n) dias[i] = d; }

    int totalDias() const {
        int s = 0;
        for (int i = 1; i < n; i++) s += dias[i];    // <-- revise este recorrido
        return s;
    }
    string getCodigo() const { return codigo; }

    string descripcion() const { return "Usuario " + codigo; }
};

// PENDIENTE: clase Estudiante (hereda de Usuario, agrega el programa academico)
//            descripcion() debe devolver:  "Estudiante " + codigo + " de " + programa

// PENDIENTE: clase Externo (hereda de Usuario, agrega la entidad de procedencia)
//            descripcion() debe devolver:  "Externo " + codigo + " (" + entidad + ")"

int main() {
    const int N = 3;
    Usuario** registro = new Usuario*[N];
    for (int i = 0; i < N; i++) registro[i] = nullptr;   // sin basura en el arreglo
    registro[0] = new Usuario("US-001", 3);
    // registro[1] = new Estudiante("ES-002", 3, "Ingenieria");
    // registro[2] = new Externo("EX-003", 3, "Alcaldia");

    registro[0]->sancionar(0, 2);
    // registro[1]->sancionar(0, 5);  registro[1]->sancionar(1, 1);
    // registro[2]->sancionar(2, 4);

    int suma = 0;
    for (int i = 0; i < N; i++) {
        if (registro[i] == nullptr) continue;
        cout << registro[i]->descripcion() << " -> " << registro[i]->totalDias() << " dias" << endl;
        suma += registro[i]->totalDias();
    }
    cout << "TOTAL=" << suma << endl;

    if (suma == 12)   // el codigo se DERIVA del total correcto
        cout << "TICKET CERRADO - codigo de cierre: 5511-" << suma << N << endl;

    // FALTAN LIBERACIONES AQUI  (delete sobre nullptr es seguro)

    return 0;
}
