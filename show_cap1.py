# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

in_cap = False
for i, p in enumerate(paras):
    t = p.text.strip()
    if "CAPÍTULO I" in t or "CAPITULO I" in t.upper():
        in_cap = True
    if in_cap and ("CAPÍTULO II" in t or "CAPITULO II" in t.upper()):
        break
    if in_cap and t:
        print(f"[{i}] [{p.style.name}] {t[:120]}")
