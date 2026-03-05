# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Leer texto completo de los parrafos problematicos
for idx in [267, 268, 269, 272, 274, 275, 276, 280, 281, 282, 283, 286, 289, 290, 291]:
    p = paras[idx]
    print(f"--- [{idx}] [{p.style.name}] ---")
    print(p.text)
    print()
