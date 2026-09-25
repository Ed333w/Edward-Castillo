class Usuario:
    def __init__(nombre, documento):

        #atributos 
        self.nombre = nombre
        self.documento = documento
        self.tiene_sanciones = False
  

    #metodos 
    def solicitar_prestamo(self):
        return not self.tiene_sanciones:

    
            