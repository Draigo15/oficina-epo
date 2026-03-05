# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")
paras = doc.paragraphs

print("=== Secciones con heading seguido inmediatamente de otro heading (posiblemente vacias) ===\n")
for i, p in enumerate(paras[:-1]):
    if p.style and "Heading" in p.style.name and p.text.strip():
        next_p = paras[i+1]
        if next_p.style and "Heading" in next_p.style.name:
            print(f"Par {i}: [{p.style.name}] {p.text.strip()[:80]}")
            print(f"  -> Par {i+1}: [{next_p.style.name}] {next_p.text.strip()[:80]}")
