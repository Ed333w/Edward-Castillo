from historial import Historial

def nuevo():
    h = Historial()
    for t, m in [(101,"A"), (102,"B"), (103,"A"), (104,"C")]:
        h.registrar(t, m)
    return h

def chk(nombre, fn, esperado):
    """Ejecuta fn(). Si lanza excepcion, la reporta como FALLA y sigue."""
    try:
        obtenido = fn()
    except Exception as e:
        print(f"  [FALLA] {nombre}: lanzo {type(e).__name__}: {e}")
        return False
    ok = obtenido == esperado
    print(f"  [{'OK ' if ok else 'FALLA'}] {nombre}: obtuvo {obtenido}")
    if not ok:
        print(f"          esperaba {esperado}")
    return ok

def _reg_vacio():
    h = Historial(); h.registrar(101, "A"); return h.listar()
def _deshacer_ultima():
    h = nuevo(); h.deshacer_ultima(); return h.listar()
def _deshacer_uno():
    h = Historial(); h.registrar(101,"A"); h.deshacer_ultima(); return h.cuantas()
def _deshacer_dos():
    h = nuevo(); h.deshacer_ultima(); h.deshacer_ultima(); return h.listar()

print("TCK-5512 · verificacion")
r = []
r.append(chk("registrar en historial VACIO",  _reg_vacio,                        [101]))
r.append(chk("registrar cuatro atenciones",   lambda: nuevo().listar(),          [101,102,103,104]))
r.append(chk("deshacer la ULTIMA",            _deshacer_ultima,                  [101,102,103]))
r.append(chk("deshacer con UN solo elemento", _deshacer_uno,                     0))
r.append(chk("deshacer en historial VACIO",   lambda: Historial().deshacer_ultima(), False))
r.append(chk("buscar turno existente",        lambda: nuevo().buscar(103),       "A"))
r.append(chk("buscar turno inexistente",      lambda: nuevo().buscar(999),       None))
r.append(chk("deshacer dos veces seguidas",   _deshacer_dos,                     [101,102]))

if all(r):
    # el codigo se DERIVA del comportamiento correcto del historial
    a = nuevo(); a.deshacer_ultima()
    cod = f"5512-{a.cuantas()}{len(nuevo().listar())}{nuevo().buscar(104)}"
    print(f"\n  TICKET CERRADO — codigo de cierre: {cod}")
else:
    print("\n  Ticket ABIERTO. Produccion sigue caida.")
