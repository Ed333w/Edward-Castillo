from fila import Fila

def nueva():
    f = Fila()
    for t, n in [(1,"Ana"), (2,"Beto"), (3,"Carla"), (4,"Dario")]:
        f.llegar(t, n)
    return f

def chk(nombre, obtenido, esperado):
    ok = obtenido == esperado
    print(f"  [{'OK ' if ok else 'FALLA'}] {nombre}: obtuvo {obtenido}")
    if not ok: print(f"          esperaba {esperado}")
    return ok

print("TCK-4423 · verificacion")
r = []

f = nueva(); r.append(chk("fila inicial", f.listar(), [1,2,3,4]))

f = nueva(); f.retirar(1)
r.append(chk("retirar el PRIMERO", f.listar(), [2,3,4]))

f = nueva(); f.retirar(3)
r.append(chk("retirar del MEDIO", f.listar(), [1,2,4]))

f = nueva(); f.retirar(4)
r.append(chk("retirar el ULTIMO", f.listar(), [1,2,3]))

f = nueva(); r.append(chk("retirar INEXISTENTE", f.retirar(99), False))

f = Fila(); f.llegar(7,"Sol"); f.retirar(7)
r.append(chk("fila que queda VACIA", f.cuantos(), 0))

f = nueva(); f.retirar(2); f.retirar(1); f.retirar(4)
r.append(chk("retiros encadenados", f.listar(), [3]))

if all(r):
    # el codigo se DERIVA del comportamiento correcto de la fila
    a = nueva(); a.retirar(1); a.retirar(4)
    b = nueva(); b.retirar(2)
    cod = f"4423-{sum(a.listar())}{b.cuantos()}{len(nueva().listar())}"
    print(f"\n  TICKET CERRADO — codigo de cierre: {cod}")
else:
    print("\n  Ticket ABIERTO. Produccion sigue caida.")
