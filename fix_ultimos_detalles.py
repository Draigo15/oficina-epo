# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

fixes = 0

for i, p in enumerate(paras):
    t = p.text.strip()

    # 1. Typo "Auntenticar" -> "Autenticar"
    if "Auntenticar" in p.text:
        for run in p.runs:
            if "Auntenticar" in run.text:
                run.text = run.text.replace("Auntenticar", "Autenticar")
                fixes += 1
                print(f"[{i}] Corregido 'Auntenticar' -> 'Autenticar'")

    # 2. "Caso de Uso CS-01 - Visualizar HOME/INICIO" -> "Visualizar Dashboard"
    if "HOME/INICIO" in p.text and "CS-01" in p.text:
        for run in p.runs:
            if "HOME/INICIO" in run.text:
                run.text = run.text.replace("Visualizar HOME/INICIO", "Visualizar Dashboard")
                run.text = run.text.replace("HOME/INICIO", "Dashboard")
                fixes += 1
                print(f"[{i}] Renombrado CS-01: HOME/INICIO -> Dashboard")

    # 3. Indice: "CS-09 - Actualizar Contenido del Sitio Web" -> eliminar (es del portal)
    if "CS-09" in t and "Actualizar Contenido" in t and i < 100:
        print(f"[{i}] Indice portal a eliminar: '{t[:80]}'")
        p._p.getparent().remove(p._p)
        fixes += 1
        continue

    # 4. Indice: "CS-08 - Generar Reportes PDF" -> actualizar numeracion
    if "CS-08" in t and "Generar Reportes" in t and i < 100:
        for run in p.runs:
            if "CS-08" in run.text:
                run.text = run.text.replace("CS-08", "CS-03")
                fixes += 1
                print(f"[{i}] Indice: CS-08 -> CS-03")

    # 5. Indice: "CS-07 - Gestionar Notificaciones" -> CS-04
    if "CS-07" in t and "Notificaciones" in t and i < 100:
        for run in p.runs:
            if "CS-07" in run.text:
                run.text = run.text.replace("CS-07", "CS-04")
                fixes += 1
                print(f"[{i}] Indice: CS-07 Notificaciones -> CS-04")

print(f"\nTotal fixes: {fixes}")

out = "INFORME_FINAL_SISTEMA_v2.docx"
try:
    doc.save(out)
    print(f"Guardado en {out}")
except PermissionError:
    out = "INFORME_FINAL_SISTEMA_v3.docx"
    doc.save(out)
    print(f"Bloqueado, guardado en {out}")
