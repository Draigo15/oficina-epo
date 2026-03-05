# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

print(f"=== RF COMPLETA [993..1300] ===")
for i in range(993, min(1300, len(paras))):
    t = paras[i].text.strip()
    if t:
        print(f"[{i}] [{paras[i].style.name}] {t[:100]}")
    if i > 1250 and paras[i].style.name == "Heading 1":
        print("== FIN CAP IV ==")
        break
