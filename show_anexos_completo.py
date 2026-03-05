# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Encontrar ANEXOS
inicio = None
for i, p in enumerate(paras):
    if "ANEXOS" in p.text.upper() and p.style.name == "Heading 1":
        inicio = i
        break

print(f"=== ANEXOS completo desde [{inicio}] ===")
for i in range(inicio, len(paras)):
    t = paras[i].text.strip()
    if t:
        print(f"[{i}] [{paras[i].style.name}] {t[:100]}")

print()
print("=== PROBLEMAS DETECTADOS: ===")
print()

# Revisar el bloque del portal en Cap IV
print("=== SECCION PORTAL CAP IV (694-720) muestra ===")
for i in range(694, min(730, len(paras))):
    t = paras[i].text.strip()
    if t:
        print(f"[{i}] [{paras[i].style.name}] {t[:90]}")
