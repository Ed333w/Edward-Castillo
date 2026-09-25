# ============================================================
#  Cívica Software  ·  TCK-5512  ·  Severidad P0  ·  PRODUCCION CAIDA
#  Sistema: TurnoJusto  —  El historial de atenciones esta corrupto.
#
#  Reportes de soporte:
#   - "Registre la primera atencion del dia y el sistema se cayo."
#   - "Deshice la ultima atencion y se borro todo el historial."
#   - "Busco un turno que si existe y me dice que no esta."
# ============================================================

class Nodo:
    def __init__(self, turno, modulo):
        self.turno = turno
        self.modulo = modulo
        self.siguiente = None


class Historial:
    def __init__(self):
        self.cabeza = None

    def registrar(self, turno, modulo):
        """Agrega una atencion al FINAL del historial.
           BUG: se cae cuando el historial esta vacio."""
        nuevo = Nodo(turno, modulo)
        if self.cabeza is None:  #el if revisa si la cabeza es None, si lo es, significa que no hay elementos en la lista y se asigna el nuevo nodo como cabeza.
            self.cabeza = nuevo  # Si no es None, se recorre la lista hasta encontrar el último nodo y se agrega el nuevo nodo al final.
        else:
            actual = self.cabeza                   
            while actual.siguiente is not None:   
                actual = actual.siguiente
            actual.siguiente = nuevo


    #corregir la funcion deshacer_ultima
    def deshacer_ultima(self):          
        """Elimina la ULTIMA atencion registrada.
           Devuelve True si elimino algo, False si el historial estaba vacio."""
        if self.cabeza is None:         # Si el historial esta vacio, devuelve False.
            return False
        if self.cabeza.siguiente is None:  # Si solo hay un elemento en la lista, se elimina la cabeza y se devuelve True.
            self.cabeza = None
            return True
        actual = self.cabeza
        while actual.siguiente.siguiente is not None:  #si hay mas de un elemento en la lista, se recorre hasta el penultimo nodo y se elimina el ultimo.
            actual = actual.siguiente
        actual.siguiente = None  # Se elimina el último nodo
        return True

    

    def buscar(self, turno):       #esta funcion busca un turno en la lista y devuelve el modulo correspondiente si lo encuentra, o None si no lo encuentra.
        """Devuelve el modulo que atendio ese turno, o None si no existe.
           PENDIENTE: implementar."""
        actual = self.cabeza
        while actual is not None:       #se recorre la lista hasta encontrar el turno buscado o llegar al final de la lista. Si se encuentra el turno, se devuelve el modulo correspondiente. Si no se encuentra, se devuelve None.
            if actual.turno == turno:   #si el turno del nodo actual es igual al turno buscado, se devuelve el modulo correspondiente. 
                return actual.modulo    
            actual = actual.siguiente   #si se llega al final de la lista sin encontrar el turno, se devuelve None.
        return None 

    def cuantas(self):
        n = 0
        actual = self.cabeza
        while actual is not None:
            n += 1
            actual = actual.siguiente
        return n

    def listar(self):
        r = []
        actual = self.cabeza
        while actual is not None:
            r.append(actual.turno)
            actual = actual.siguiente
        return r
