# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

print(f"Total parrafos: {len(paras)}")

# Encontrar indices de los capitulos finales
cap_conclusiones = None
cap_recomendaciones = None
cap_biblio = None
cap_anexos = None

for i, p in enumerate(paras):
    t = p.text.strip()
    if "CONCLUSIONES" in t.upper() and p.style.name == "Heading 1":
        cap_conclusiones = i
    elif "RECOMENDACIONES" in t.upper() and p.style.name == "Heading 1":
        cap_recomendaciones = i
    elif "BIBLIOGRAF" in t.upper() and p.style.name == "Heading 1":
        cap_biblio = i
    elif "ANEXOS" in t.upper() and p.style.name == "Heading 1":
        cap_anexos = i

print(f"CONCLUSIONES: [{cap_conclusiones}]")
print(f"RECOMENDACIONES: [{cap_recomendaciones}]")
print(f"BIBLIOGRAFIAS: [{cap_biblio}]")
print(f"ANEXOS: [{cap_anexos}]")

print()
print("=== CONCLUSIONES (completo) ===")
if cap_conclusiones:
    end = cap_recomendaciones if cap_recomendaciones else cap_conclusiones + 50
    for i in range(cap_conclusiones, end):
        t = paras[i].text.strip()
        if t:
            print(f"[{i}] [{paras[i].style.name}] {t[:100]}")

print()
print("=== RECOMENDACIONES (completo) ===")
if cap_recomendaciones:
    end = cap_biblio if cap_biblio else cap_recomendaciones + 50
    for i in range(cap_recomendaciones, end):
        t = paras[i].text.strip()
        if t:
            print(f"[{i}] [{paras[i].style.name}] {t[:100]}")

print()
print("=== BIBLIOGRAFÍA (completo) ===")
if cap_biblio:
    end = cap_anexos if cap_anexos else cap_biblio + 50
    for i in range(cap_biblio, end):
        t = paras[i].text.strip()
        if t:
            print(f"[{i}] [{paras[i].style.name}] {t[:100]}")

print()
print("=== ANEXOS (primeros 60 parrafos) ===")
if cap_anexos:
    for i in range(cap_anexos, min(cap_anexos + 60, len(paras))):
        t = paras[i].text.strip()
        if t:
            print(f"[{i}] [{paras[i].style.name}] {t[:100]}")
