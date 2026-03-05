# -*- coding: utf-8 -*-
import re
from docx import Document

print("Iniciando análisis y limpieza del documento...")
doc = Document("INFORME.docx")

# Cambiar el año en la portada y limpiar dobles espacios
for p in doc.paragraphs:
    # 1. Portada año 2026
    if "Tacna  Perú 2025" in p.text or "Tacna - Perú 2025" in p.text:
        for r in p.runs:
            r.text = r.text.replace("2025", "2026")
            
    # Otras menciones al año en general que estén solas
    elif "2025" in p.text and len(p.text) < 30:
        for r in p.runs:
             if r.text.strip() == "2025":
                 r.text = r.text.replace("2025", "2026")

    # 2. Corregir errores evidentes (espacios múltiples en un solo run)
    for r in p.runs:
        if "  " in r.text:
            text = r.text
            while "  " in text:
                text = text.replace("  ", " ")
            r.text = text
            
    # 3. Corregir saltos como "\n0" (solo text si no hay tabs/alineaciones)
    if p.text.endswith(" \n0"):
        print(f"Borrando salto incorrecto: {p.text}")

doc.save("INFORME_corregido.docx")
print(" INFORME_corregido.docx guardado exitosamente.")
