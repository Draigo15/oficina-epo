# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

print(f"Total paragrafos: {len(paras)}")
print()

# Buscar capitulos/secciones principales
print("=== ESTRUCTURA PRINCIPAL ===")
for i, p in enumerate(paras):
    t = p.text.strip()
    if p.style.name in ["Heading 1", "Heading 2"] and t:
        print(f"[{i}] [{p.style.name}] {t[:80]}")

print()
print("=== ZONA CAP IV CRITICA (420-620) ===")
for i in range(420, min(620, len(paras))):
    t = paras[i].text.strip()
    if t:
        print(f"[{i}] [{paras[i].style.name}] {t[:80]}")

print()
print("=== ZONA GESTIONAR CONTACTO (2300-2500) ===")
for i in range(2300, min(2500, len(paras))):
    t = paras[i].text.strip()
    if t:
        print(f"[{i}] [{paras[i].style.name}] {t[:80]}")
