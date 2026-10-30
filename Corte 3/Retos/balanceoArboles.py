#reto: rotecion manual
#escriba un pequeño programa que lea por teclado tres claves en orden en que se insetarian, construya
#el arbol SIN balancear, diagnostique cual de los cuatro casos es (o si esta equilibrado) y aplique la rotacion correcta. debe imprimir el arbol antes y despues

#pista: el diagnostico sale de dos numeros: el fe del nodo y el fe de su hijo del lado
#pesado. no necesita mas

#resultado esperado: con 30, 10 20 debe diagnbosticar LR. con 10, 20, 30 debe diagnosticar RR. con 10, 30, 20 debe diagnosticar RL.

class Nodo:
    def __init__(self, c):
        self.clave = c; self.izq = None; self.der = None; self.alt = 0

def alt(n):  return -1 if n is None else n.alt
def fe(n):   return 0 if n is None else alt(n.izq) - alt(n.der)   # factor de equilibrio
def recalc(n): n.alt = 1 + max(alt(n.izq), alt(n.der))
def rotarDerecha(y):
    #        y                x
    #       / \              / \
    #      x   C    ==>     A   y
    #     / \                  / \
    #    A   B                B   C
    x= y.izq; B=x.der
    x.der=y; y.izq=B
    recalc(y);recalc(x)
    return x

def rotarIzquierda(x):
    #      x                  y
    #     / \                / \
    #    A   y      ==>     x   C
    #       / \            / \
    #      B   C          A   B
    y=x.der; B=y.izq
    y.izq=x; x.der=B
    recalc(x);recalc(y)
    return y

def insertar(n,c):                          # insercion de ABB SIN balancear
    if n is None: return Nodo(c)
    if c < n.clave: n.izq = insertar(n.izq,c)
    elif c > n.clave: n.der = insertar(n.der,c)
    recalc(n)
    return n

def inorden(n,s):
    if n is None:return
    inorden(n.izq,s);s.append(n.clave);inorden(n.der,s)

def preorden(n,s):
    if n is None:return
    s.append(f"{n.clave}(fe={fe(n)})"); preorden(n.izq,s);preorden(n.der,s)

def ver(titulo,raiz):
    s=[]; preorden(raiz,s)
    t=[]; inorden(raiz,t)
    print(f"{titulo:22s} preorden: {''.join(s)}")
    print(f"{'':22s} inorden: {t} altura={alt(raiz)}")

r = None
for i in range(3):
    r = insertar(r, int(input(f"clave {i+1}: ")))
print()
ver(f"antes (fe raiz = {fe(r)})", r)

# diagnostico: fe de la raiz y fe de su hijo del lado pesado
if fe(r) > 1:
    caso = "LL" if fe(r.izq) >= 0 else "LR"
    print(f"\nfe raiz = {fe(r)}, fe hijo izq = {fe(r.izq)}  ->  CASO {caso}")
elif fe(r) < -1:
    caso = "RR" if fe(r.der) <= 0 else "RL"
    print(f"\nfe raiz = {fe(r)}, fe hijo der = {fe(r.der)}  ->  CASO {caso}")
else:
    caso = "EQUILIBRADO"
    print(f"\nfe raiz = {fe(r)}  ->  EQUILIBRADO, no necesita rotacion")

if caso == "LL":
    print("una rotacion DERECHA")
    r = rotarDerecha(r)
elif caso == "RR":
    print("una rotacion IZQUIERDA")
    r = rotarIzquierda(r)
elif caso == "LR":
    print("IZQUIERDA sobre el hijo, luego DERECHA sobre la raiz")
    r.izq = rotarIzquierda(r.izq); recalc(r); ver("tras rotar el hijo", r)
    r = rotarDerecha(r)
elif caso == "RL":
    print("DERECHA sobre el hijo, luego IZQUIERDA sobre la raiz")
    r.der = rotarDerecha(r.der); recalc(r); ver("tras rotar el hijo", r)
    r = rotarIzquierda(r)

if caso != "EQUILIBRADO": ver("despues", r)
