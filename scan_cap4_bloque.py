# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

print("=== ESTRUCTURA CAP IV COMPLETA (600-2550) - Solo headings y primeras lineas ===")
for i in range(600, 2560):
    p = paras[i]
    t = p.text.strip()
    if not t:
        continue
    style = p.style.name
    # Mostrar Headings y primeras lineas de bloques
    if style in ["Heading 1", "Heading 2", "Heading 3"]:
        print(f"[{i}] [{style}] >>> {t[:90]}")
    elif t.startswith("Caso de Uso") or t.startswith("CS-") or t.startswith("Figura"):
        print(f"[{i}] [{style}]     {t[:90]}")

print()
print("=== DESDE [2480] HASTA CONCLUSION ===")
for i in range(2480, 4160):
    p = paras[i]
    t = p.text.strip()
    if not t:
        continue
    style = p.style.name
    if style in ["Heading 1", "Heading 2", "Heading 3"]:
        print(f"[{i}] [{style}] >>> {t[:90]}")
