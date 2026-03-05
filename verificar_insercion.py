# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

print(f"Total parrafos: {len(paras)}")

# Buscar TODOS los "Requerimientos Funcionales"
print()
print("=== TODAS las ocurrencias de Requerimientos Funcionales ===")
for i, p in enumerate(paras):
    if "Requerimientos Funcionales" in p.text and p.style.name == "Heading 3":
        print(f"[{i}] [{p.style.name}] '{p.text[:80]}'")
        print(f"  Previo: [{i-1}] [{paras[i-1].style.name}] '{paras[i-1].text[:60]}'")
        print(f"  Sig:    [{i+1}] [{paras[i+1].style.name}] '{paras[i+1].text[:60]}'")
        print()

# Ver zona [180-200] para ver que hay
print("=== ZONA [178-200] ===")
for i in range(178, 205):
    t = paras[i].text.strip()
    if t:
        print(f"[{i}] [{paras[i].style.name}] '{t[:80]}'")

# Ver zona [640-670] para ver si ahi quedaron narrativas
print()
print("=== ZONA [640-670] ===")
for i in range(640, 675):
    t = paras[i].text.strip()
    if t:
        print(f"[{i}] [{paras[i].style.name}] '{t[:80]}'")
