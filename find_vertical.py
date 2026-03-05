# -*- coding: utf-8 -*-
from docx import Document
import re

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Buscar parrafos con texto espaciado tipo "u s e r s" o "A u te n t ic"
# Patron: caracteres sueltos separados por espacios
espaciados = []
fragmentos_silabas = []

for i, p in enumerate(paras):
    t = p.text.strip()
    if not t:
        continue
    # Patron de texto espaciado: letras/grupos separados por espacios simples
    words = t.split(" ")
    if len(words) >= 4 and all(len(w) <= 3 for w in words) and len(t) > 5:
        espaciados.append((i, p.style.name, t[:80]))
    # Parrafos Normal muy cortos (1-6 chars) que parecen silabas sueltas
    if p.style.name in ["Normal", "List Paragraph", "Heading 3"] and 1 <= len(t) <= 5 and t.isalpha():
        fragmentos_silabas.append((i, p.style.name, t))

print(f"=== TEXTO ESPACIADO (letras separadas por espacios): {len(espaciados)} ===")
for idx, style, text in espaciados[:30]:
    print(f"[{idx}] [{style}] '{text}'")

print(f"\n=== SILABAS SUELTAS (texto 1-5 chars solo letras): {len(fragmentos_silabas)} ===")
for idx, style, text in fragmentos_silabas:
    prev = paras[idx-1].text.strip()[:50] if idx > 0 else ""
    nxt = paras[idx+1].text.strip()[:50] if idx < len(paras)-1 else ""
    print(f"[{idx}] [{style}] '{text}'  | antes: '{prev}' | despues: '{nxt}'")
