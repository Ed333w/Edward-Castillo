from ocupacion import ocupacion, total_por_punto, total_por_dia, dia_mas_flojo, puntos_inactivos

def chk(nombre, obtenido, esperado):
    ok = obtenido == esperado
    print(f"  [{'OK ' if ok else 'FALLA'}] {nombre}: obtuvo {obtenido}")
    if not ok: print(f"          esperaba {esperado}")
    return ok

print("TCK-4420 · verificacion")
r = []
r.append(chk("total_por_punto", total_por_punto(ocupacion), [16, 20, 21, 14]))
r.append(chk("total_por_dia",   total_por_dia(ocupacion),   [15, 11, 14, 7, 12, 12]))
r.append(chk("dia_mas_flojo",   dia_mas_flojo(ocupacion),   3))
r.append(chk("puntos_inactivos",puntos_inactivos(ocupacion),5))

if all(r):
    # el codigo se DERIVA de los resultados correctos: no esta escrito aqui
    d = total_por_dia(ocupacion)
    cod = f"4420-{sum(d)}{dia_mas_flojo(ocupacion)}{puntos_inactivos(ocupacion)}"
    print(f"\n  TICKET CERRADO — codigo de cierre: {cod}")
else:
    print("\n  Ticket ABIERTO. Corrija y vuelva a ejecutar.")
