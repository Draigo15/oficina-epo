# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# El indice/contenido suele estar en los primeros ~140 parrafos
print("=== INDICE COMPLETO (parrafos 32-138) ===")
for i in range(32, 140):
    t = paras[i].text.strip()
    if t:
        print(f"[{i}] [{paras[i].style.name}] {t[:110]}")
