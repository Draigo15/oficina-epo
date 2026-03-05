# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

in_cap = False
count = 0
for i, p in enumerate(paras):
    t = p.text.strip()
    if "CAPÍTULO IV" in t or "CAPITULO IV" in t.upper():
        in_cap = True
    if in_cap and t:
        print(f"[{i}] [{p.style.name}] {t[:140]}")
        count += 1
        if count > 120:
            break
