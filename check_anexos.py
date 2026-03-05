# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")
paras = doc.paragraphs
problemas = [4350, 4365, 4382, 4423]

for idx in problemas:
    print(f"\n=== Par {idx}: {paras[idx].text.strip()} ===")
    for j in range(1, 8):
        if idx+j < len(paras):
            t = paras[idx+j].text.strip()
            style = paras[idx+j].style.name if paras[idx+j].style else ""
            if t:
                print(f"  [{idx+j}] [{style}] {t[:100]}")
