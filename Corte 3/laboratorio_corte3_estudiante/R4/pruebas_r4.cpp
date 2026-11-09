// NO MODIFIQUE ESTE ARCHIVO. Alterarlo se considera fraude academico
// segun la seccion 13 de la guia de asignatura.
#include <iostream>
#include <string>
#include <vector>
#include "red.h"
using namespace std;

static int fallas = 0;
static void chk(const string& nombre, int obtenido, int esperado) {
    bool ok = (obtenido == esperado);
    cout << "  [" << (ok ? "OK " : "FALLA") << "] " << nombre << ": obtuvo " << obtenido;
    if (!ok) cout << "  (esperaba " << esperado << ")";
    cout << endl;
    if (!ok) fallas++;
}
static void chkLista(const string& nombre, vector<string> obt, vector<string> esp) {
    bool ok = (obt == esp);
    cout << "  [" << (ok ? "OK " : "FALLA") << "] " << nombre << ": obtuvo [";
    for (size_t i = 0; i < obt.size(); i++) { cout << obt[i]; if (i+1 < obt.size()) cout << ", "; }
    cout << "]";
    if (!ok) {
        cout << "\n          esperaba [";
        for (size_t i = 0; i < esp.size(); i++) { cout << esp[i]; if (i+1 < esp.size()) cout << ", "; }
        cout << "]";
    }
    cout << endl;
    if (!ok) fallas++;
}

int main() {
    cout << "RETO 4 · conectividad y vias criticas (DFS) · verificacion" << endl;

    chk("la red completa es 1 sola componente", cuantasComponentes(construir(ARISTAS)), 1);
    chk("red vacia: 10 puntos aislados", cuantasComponentes(construir({})), 10);
    chk("solo ACOPIO-NORTE: 9 componentes", cuantasComponentes(construir({{0,1}})), 9);
    chk("tres aristas sueltas: 7 componentes",
        cuantasComponentes(construir({{0,1},{0,2},{3,6}})), 7);
    chk("cerrar PUERTO-VEREDA parte la red",
        cuantasComponentes(construir({{0,1},{0,2},{0,3},{1,4},{1,5},{2,7},{3,6},{5,6},{4,7},{6,9}})), 2);
    chk("cerrar ACOPIO-NORTE NO parte la red",
        cuantasComponentes(construir({{0,2},{0,3},{1,4},{1,5},{2,7},{3,6},{5,6},{4,7},{7,8},{6,9}})), 1);

    chkLista("vias criticas de la red", viasCriticas(), {"PUERTO-VEREDA", "TALLER-MINA"});

    if (fallas == 0) {
        // el codigo se DERIVA de los resultados correctos: no esta escrito aqui
        auto vc = viasCriticas();
        cout << "\n  RETO 4 CERRADO — codigo de cierre: 3304-"
             << vc.size() << cuantasComponentes(construir({{0,1}}))
             << cuantasComponentes(construir({})) << ARISTAS.size() << endl;
    } else {
        cout << "\n  Reto ABIERTO (" << fallas << " falla(s)). Corrija y vuelva a ejecutar." << endl;
    }
    return 0;
}
