// NO MODIFIQUE ESTE ARCHIVO. Alterarlo se considera fraude academico
// segun la seccion 13 de la guia de asignatura.
#include <iostream>
#include <string>
#include "turnos.h"
using namespace std;

static int fallas = 0;
static void chk(const string& nombre, const string& obtenido, const string& esperado) {
    bool ok = (obtenido == esperado);
    cout << "  [" << (ok ? "OK " : "FALLA") << "] " << nombre << ": obtuvo \"" << obtenido << "\"";
    if (!ok) cout << "  (esperaba \"" << esperado << "\")";
    cout << endl;
    if (!ok) fallas++;
}
static void chkInt(const string& nombre, int obtenido, int esperado) {
    bool ok = (obtenido == esperado);
    cout << "  [" << (ok ? "OK " : "FALLA") << "] " << nombre << ": obtuvo " << obtenido;
    if (!ok) cout << "  (esperaba " << esperado << ")";
    cout << endl;
    if (!ok) fallas++;
}

int main() {
    cout << "EJERCICIO 4 · cola circular · verificacion" << endl;
    int x;

    {   // --- basicos ---
        ColaCircular c(5);
        chkInt("cola nueva esta vacia", c.estaVacia() ? 1 : 0, 1);
        chkInt("frente de cola vacia", c.verFrente(), -1);
        chkInt("desencolar vacia devuelve false", c.desencolar(x) ? 1 : 0, 0);
        c.encolar(11); c.encolar(22); c.encolar(33);
        chk   ("contenido tras 3 encolados", c.contenido(), "11 22 33");
        chkInt("verFrente", c.verFrente(), 11);
        chkInt("cantidad", c.cantidad, 3);
    }
    {   // --- da la vuelta ---
        ColaCircular c(5);
        for (int v : {11,22,33,44}) c.encolar(v);
        c.desencolar(x); c.desencolar(x);          // salen 11 y 22
        c.encolar(55); c.encolar(66); c.encolar(77);
        chk   ("tras dar la vuelta", c.contenido(), "33 44 55 66 77");
        chkInt("esta llena", c.estaLlena() ? 1 : 0, 1);
        chkInt("encolar en cola llena devuelve false", c.encolar(88) ? 1 : 0, 0);
        chk   ("la cola llena no se altero", c.contenido(), "33 44 55 66 77");
        chkInt("frente despues de la vuelta", c.verFrente(), 33);
    }
    {   // --- vaciar por completo y reutilizar ---
        ColaCircular c(3);
        c.encolar(1); c.encolar(2);
        c.desencolar(x); chkInt("desencolar devuelve el frente", x, 1);
        c.desencolar(x); chkInt("desencolar el segundo", x, 2);
        chkInt("queda vacia", c.estaVacia() ? 1 : 0, 1);
        chk   ("contenido de cola vacia", c.contenido(), "");
        c.encolar(9);
        chk   ("se puede volver a usar", c.contenido(), "9");
    }
    {   // --- redimensionar con los datos partidos en dos tramos ---
        ColaCircular c(4);
        for (int v : {10,20,30,40}) c.encolar(v);
        c.desencolar(x); c.desencolar(x);          // salen 10 y 20
        c.encolar(50); c.encolar(60);              // dan la vuelta
        chk   ("antes de redimensionar", c.contenido(), "30 40 50 60");
        c.redimensionar();
        chkInt("capacidad duplicada", c.cap, 8);
        chkInt("frente reubicado en 0", c.frente, 0);
        chk   ("orden conservado", c.contenido(), "30 40 50 60");
        c.encolar(70);
        chk   ("sigue funcionando tras redimensionar", c.contenido(), "30 40 50 60 70");
        chkInt("cantidad tras redimensionar", c.cantidad, 5);
    }

    if (fallas == 0) {
        ColaCircular c(4);
        for (int v : {10,20,30,40}) c.encolar(v);
        c.desencolar(x); c.encolar(50); c.redimensionar();
        // el codigo se DERIVA de los resultados correctos: no esta escrito aqui
        cout << "\n  EJERCICIO 4 CERRADO — codigo de cierre: 2254-"
             << c.cap << c.cantidad << c.verFrente() << c.frente << endl;
    } else {
        cout << "\n  Ejercicio ABIERTO (" << fallas
             << " falla(s)). Corrija y vuelva a ejecutar." << endl;
    }
    return 0;
}
