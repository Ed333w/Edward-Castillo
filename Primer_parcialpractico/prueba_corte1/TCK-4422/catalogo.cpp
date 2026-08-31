// ============================================================
//  Cívica Software  ·  TCK-4422  ·  Severidad P1
//  Sistema: PrestaLab  —  Nueva funcionalidad: catalogo mixto
//  El reporte imprime siempre "Recurso generico". Debe imprimir
//  la descripcion propia de cada tipo.
// ============================================================
#include <iostream>
#include <string>
using namespace std;

class Recurso {
protected:
    string codigo;
    bool   prestado;
public:
    Recurso(string c) : codigo(c), prestado(false) {}
    ~Recurso() {}

    void prestar()  { prestado = true; }
    bool estaPrestado() const { return prestado; }

    string descripcion() const { return "Recurso generico " + codigo; }
};

// PENDIENTE: clase LibroFisico (hereda de Recurso, agrega autor)
//            descripcion() debe devolver:  "Libro " + codigo + " de " + autor

// PENDIENTE: clase Equipo (hereda de Recurso, agrega horasUso)
//            descripcion() debe devolver:  "Equipo " + codigo + " (" + horas + "h)"

int main() {
    const int N = 3;
    Recurso* catalogo[N] = { nullptr, nullptr, nullptr };
    catalogo[0] = new Recurso("RG-001");
    // catalogo[1] = new LibroFisico("LF-002", "Borges");
    // catalogo[2] = new Equipo("EQ-003", 12);

    int prestados = 0;
    for (int i = 0; i < N; i++) {
        if (catalogo[i] == nullptr) continue;
        cout << catalogo[i]->descripcion();
        if (catalogo[i]->estaPrestado()) { cout << "  [PRESTADO]"; prestados++; }
        cout << endl;
    }

    for (int i = 0; i < N; i++) delete catalogo[i];   // delete sobre nullptr es seguro
    return 0;
}
