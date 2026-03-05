# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")

print("=== Buscando secciones 2.x, 3.x y titulos de nivel 2 ===\n")
for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    # Cualquier titulo numerado
    import re
    if re.match(r'^\d+\.\d+', t) and len(t) < 120:
        print(f"Par {i}: {t}")
