# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

in_cap = False
for i, p in enumerate(paras):
    t = p.text.strip()
    if "CAPÍTULO IV" in t or "CAPITULO IV" in t.upper():
        in_cap = True
    if in_cap and ("CAPÍTULO V" in t or "CAPITULO V" in t.upper() or "CONCLUSIONES" in t.upper() or "BIBLIOGRAF" in t.upper() or "ANEXO" in t.upper()):
        # Si no hay Cap V, buscar secciones finales
        if i > 300 and not ("CAPÍTULO IV" in t):
            break
    if in_cap and t:
        print(f"[{i}] [{p.style.name}] {t[:140]}")
