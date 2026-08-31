"""Ventana mostrada solo la primera vez que se abre RecibosApp en un
computador: deja elegir dónde se van a guardar los recibos (por defecto,
Documentos/RecibosApp, o la carpeta portable existente si se detecta una)."""
import tkinter as tk
from tkinter import filedialog, ttk

from ui import tema


def preguntar_carpeta_datos(sugerida):
    """Muestra el diálogo y devuelve la carpeta elegida (Path-like str), o
    None si el usuario cerró la ventana sin confirmar."""
    resultado = {"ruta": None}

    ventana = tk.Tk()
    ventana.title("Bienvenido a RecibosApp")
    ventana.resizable(False, False)
    tema.aplicar_tema(ventana)

    contenedor = ttk.Frame(ventana, padding=20)
    contenedor.pack(fill="both", expand=True)

    ttk.Label(
        contenedor,
        text="¿Dónde quieres guardar tus recibos?",
        style="Seccion.TLabel",
    ).pack(anchor="w")
    ttk.Label(
        contenedor,
        text="Ahí se guardarán la base de datos y las imágenes organizadas por\npersona y fecha. Puedes cambiarlo más adelante moviendo la carpeta.",
        style="Secundario.TLabel",
        justify="left",
    ).pack(anchor="w", pady=(4, 12))

    var_ruta = tk.StringVar(value=str(sugerida))
    fila_ruta = ttk.Frame(contenedor)
    fila_ruta.pack(fill="x")
    ttk.Entry(fila_ruta, textvariable=var_ruta, width=50).pack(side="left", fill="x", expand=True)

    def elegir():
        inicial = var_ruta.get() or str(sugerida)
        elegido = filedialog.askdirectory(title="Selecciona la carpeta de almacenamiento", initialdir=inicial)
        if elegido:
            var_ruta.set(elegido)

    ttk.Button(fila_ruta, text="Examinar...", command=elegir).pack(side="left", padx=(8, 0))

    def continuar():
        ruta = var_ruta.get().strip()
        if ruta:
            resultado["ruta"] = ruta
        ventana.destroy()

    def cancelar():
        ventana.destroy()

    botones = ttk.Frame(contenedor)
    botones.pack(fill="x", pady=(16, 0))
    ttk.Button(botones, text="Continuar", command=continuar, style="Primary.TButton").pack(side="right")
    ttk.Button(botones, text="Cancelar", command=cancelar).pack(side="right", padx=(0, 8))

    ventana.protocol("WM_DELETE_WINDOW", cancelar)
    ventana.eval("tk::PlaceWindow . center")
    ventana.mainloop()

    return resultado["ruta"]
