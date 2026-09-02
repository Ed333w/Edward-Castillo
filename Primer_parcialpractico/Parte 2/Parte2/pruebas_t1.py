from cobertura import cobertura, total_por_ruta, cobertura_por_zona, ruta_mas_productiva, zonas_sin_cubrir

def chk(nombre, obtenido, esperado):
    ok = obtenido == esperado
    print(f"  [{'OK ' if ok else 'FALLA'}] {nombre}: obtuvo {obtenido}")
    if not ok: print(f"          esperaba {esperado}")
    return ok

print("TCK-5510 · verificacion")
r = []
r.append(chk("total_por_ruta",       total_por_ruta(cobertura),       [14, 14, 10, 15]))
r.append(chk("cobertura_por_zona",   cobertura_por_zona(cobertura),   [7, 0, 15, 0, 7, 15, 9]))
r.append(chk("ruta_mas_productiva",  ruta_mas_productiva(cobertura),  3))
r.append(chk("zonas_sin_cubrir",     zonas_sin_cubrir(cobertura),     2))

if all(r):
    # el codigo se DERIVA de los resultados correctos: no esta escrito aqui
    z = cobertura_por_zona(cobertura)
    cod = f"5510-{sum(z)}{ruta_mas_productiva(cobertura)}{zonas_sin_cubrir(cobertura)}"
    print(f"\n  TICKET CERRADO — codigo de cierre: {cod}")
else:
    print("\n  Ticket ABIERTO. Corrija y vuelva a ejecutar.")
