# ============================================================
#  Supletorio · Segundo corte · EJERCICIO 5  (20 puntos)
#  Sesiones 29 a 32 — Conjuntos, mapas y tablas hash
#  Sistema: PrestaLab — indice de prestamos por codigo de usuario
#
#  MODIFIQUE SOLO ESTE ARCHIVO.  NO TOQUE pruebas_e5.py
#  Ejecute:   python3 pruebas_e5.py
#
#  Tabla hash con ENCADENAMIENTO: cada bucket es una lista de pares
#  [clave, valor]. NO use dict ni set para resolver el ejercicio:
#  el punto es implementar el mecanismo, no usarlo.
# ============================================================


class TablaHash:
    def __init__(self, buckets=7):
        self.m = buckets
        self.tabla = [[] for _ in range(self.m)]
        self.n = 0                                # cuantos pares hay guardados

    def _indice(self, clave):
        """Funcion hash: clave % m. Las claves son enteros no negativos.
           PENDIENTE: implementar."""
        return clave % self.m


    def insertar(self, clave, valor):
        """Guarda el par. Si la clave YA existe, ACTUALIZA su valor y no
           aumenta el conteo. Devuelve True si inserto una clave nueva y
           False si actualizo una existente.
           PENDIENTE: implementar."""
        indice = self._indice(clave)
        bucket = self.tabla[indice]

        for i, (k, v) in enumerate(bucket):
            if k == clave:
                bucket[i] = (clave, valor)          # Actualizar valor existente
                return False                        # No se incrementa el conteo

        bucket.append((clave, valor))               # Insertar nuevo par
        self.n += 1                                 # Incrementar conteo de pares
        return True                                 # Se insertó una clave nueva

    def buscar(self, clave):
        """Devuelve el valor asociado, o None si la clave no esta.
           PENDIENTE: implementar."""
        indice = self._indice(clave)
        bucket = self.tabla[indice]

        for k, v in bucket:
            if k == clave:
                return v                           # Retornar el valor asociado

        return None                                # Clave no encontrada

    def eliminar(self, clave):
        """Quita la clave. Devuelve True si la quito, False si no estaba.
           PENDIENTE: implementar."""
        pass

    def factor_carga(self):
        """Devuelve n / m redondeado a tres decimales.
           PENDIENTE: implementar."""
        pass

    def distribucion(self):
        """Devuelve una lista con la LONGITUD de cada bucket, en orden.
           Ejemplo con m=7: [2, 1, 0, 0, 3, 0, 1]
           PENDIENTE: implementar."""
        pass

    def colisiones(self):
        """Cuenta las colisiones: por cada bucket con k elementos y k>1,
           aporta k-1. Un bucket vacio o con uno solo aporta 0.
           PENDIENTE: implementar."""
        pass

    def rehash(self):
        """Duplica el numero de buckets y REUBICA todos los pares con la
           nueva funcion hash. El conteo n no cambia.
           PENDIENTE: implementar."""
        pass
