# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Buscar parrafos que contienen "tacto" suelto o fragmentos de "Contacto"
# y la zona de Figura 17
for i, p in enumerate(paras):
    t = p.text.strip()
    if i >= 2765 and i <= 2800:
        if t:
            print(f"[{i}] [{p.style.name}] '{t[:100]}'")

print("\n--- Buscando texto fragmentado tipo 'tacto' ---")
for i, p in enumerate(paras):
    t = p.text.strip()
    if t == "tacto" or t == "Con-" or t == "tacion" or t == "cion":
        print(f"[{i}] [{p.style.name}] '{t}'")
