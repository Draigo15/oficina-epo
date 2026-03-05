# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

for idx in [313, 322, 400, 402, 403, 408]:
    p = paras[idx]
    print(f"--- [{idx}] [{p.style.name}] ---")
    print(p.text)
    print()

# Tambien el CS-01
for idx in [2750, 2752]:
    p = paras[idx]
    print(f"--- [{idx}] [{p.style.name}] ---")
    print(p.text)
    print()
