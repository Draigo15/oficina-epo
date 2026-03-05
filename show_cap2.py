# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

in_cap = False
for i, p in enumerate(paras):
    t = p.text.strip()
    if "CAPÍTULO II" in t or "CAPITULO II" in t.upper():
        in_cap = True
    if in_cap and ("CAPÍTULO III" in t or "CAPITULO III" in t.upper()):
        break
    if in_cap and t:
        print(f"[{i}] [{p.style.name}] {t[:130]}")
