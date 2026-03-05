# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")

print("=== TÍTULOS (Heading styles) ===\n")
for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    if p.style and "Heading" in p.style.name and t:
        print(f"Par {i} [{p.style.name}]: {t}")
