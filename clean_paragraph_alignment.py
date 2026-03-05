# -*- coding: utf-8 -*-
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document("INFORME_FINAL_SISTEMA_fixed.docx")

for p in doc.paragraphs:
    # Si el párrafo tiene espacios excesivos al inicio como las capturas que pasaste
    # (ejemplo: "     Estas deficiencias estructurales...")
    if p.text.startswith(" ") and len(p.text.strip()) > 10:
        # Quitamos los espacios forzados al inicio
        texto_limpio = p.text.strip()
        p.text = texto_limpio
        # Ajustamos la alineación estándar (Justificado es lo mejor para reportes y deja las sangrías en paz)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

doc.save("INFORME_FINAL_SISTEMA.docx")
print("Alineaciones y sangrías forzadas corregidas.")
