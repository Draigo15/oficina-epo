# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Encontrar la seccion Requerimientos Funcionales de Cap IV
cap4_rf = None
for i, p in enumerate(paras):
    t = p.text.strip()
    if "Requerimientos Funcionales" in t and p.style.name == "Heading 3":
        sig = paras[i+1].text.strip() if i+1 < len(paras) else ""
        if "organiz" in sig or "m\u00f3dulos" in sig.lower():
            cap4_rf = i
            break

print(f"RF Cap IV en [{cap4_rf}]")
print()
print(f"=== RF SECTION [{cap4_rf}..{cap4_rf+120}] ===")
for i in range(cap4_rf, min(cap4_rf + 120, len(paras))):
    t = paras[i].text.strip()
    if t:
        print(f"[{i}] [{paras[i].style.name}] {t[:100]}")
