# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

fixes = 0

# 1. Corregir [4239]: texto con typo "çon" en sección Dashboard Principal del portal
for i, p in enumerate(paras):
    t = p.text.strip()
    # Typo "Nosotros" con char especial
    if "Nosotros" in t and "\u00e7on" in t.lower().replace("ç","ç"):
        # Reemplazar todo el texto del parrafo
        for run in p.runs:
            if "çon" in run.text or "Nosotros" in run.text:
                run.text = run.text.replace('Página "Nosotrosçon información institucional', 
                                           'Dashboard principal  estadísticas y actividad reciente')
        print(f"[{i}] Corregido typo Nosotros/çon")
        fixes += 1
        break

# Busqueda alternativa por indice aprox. 4239
for i, p in enumerate(paras):
    t = p.text.strip()
    if "\u00e7on" in t or "çon" in t:
        print(f"[{i}] Encontrado 'çon': {t[:80]}")
        for run in p.runs:
            if "çon" in run.text:
                run.text = run.text.replace("çon", "con")
                fixes += 1
                print(f"  -> Corregido a 'con'")

# 2. Corregir encabezado [4360]: "Gestión Multimedia"  "Gestión de Usuarios"
# (las figuras 52 y 53 hablan de Perfil-Asistente y Panel-Usuarios, no Multimedia)
for i, p in enumerate(paras):
    t = p.text.strip()
    if t == "Gestión Multimedia" and p.style.name == "Heading 3":
        for run in p.runs:
            if "Gestión Multimedia" in run.text:
                run.text = run.text.replace("Gestión Multimedia", "Gestión de Usuarios")
                fixes += 1
                print(f"[{i}] Renombrado 'Gestión Multimedia' >> 'Gestión de Usuarios'")
        break

# 3. Fusion de referencias cortadas: "AddisonWesley." suelto
for i, p in enumerate(paras):
    t = p.text.strip()
    if t in ["AddisonWesley.", "Addison-Wesley.", "OMG."]:
        prev = paras[i-1] if i > 0 else None
        if prev:
            print(f"[{i}] Parrafo suelto '{t}' (previo: '{prev.text.strip()[:60]}')")
            # Si el previo termina sin punto o es una ref parcial, fusionar
            if prev.text.strip() and not prev.text.strip().endswith("."):
                for run in prev.runs:
                    pass  # Solo reportar, no fusionar automaticamente por complejidad
                print(f"  -> Pendiente fusion manual (previo sin punto)")

print(f"\nTotal fixes: {fixes}")

out = "INFORME_FINAL_SISTEMA_v2.docx"
try:
    doc.save(out)
    print(f"Guardado en {out}")
except PermissionError:
    out = "INFORME_FINAL_SISTEMA_v3.docx"
    doc.save(out)
    print(f"Bloqueado, guardado en {out}")
