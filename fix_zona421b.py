# -*- coding: utf-8 -*-
from docx import Document
import re

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Patron especifico: letras/silabas separadas por espacios internos
# Ej: "A rchivos Fisicos D o cen te" - tiene 3+ grupos de "1-2chars espacio"
def es_texto_espaciado_real(text):
    # Cuenta ocurrencias de patron: 1-3 chars + espacio, seguido de otro grupo similar
    matches = re.findall(r'\b[A-Za-záéíóúñÁÉÍÓÚÑ]{1,3}\s(?=[a-záéíóúñ])', text)
    return len(matches) >= 4

to_delete = []

for i, p in enumerate(paras):
    t = p.text.strip()
    if not t:
        continue
    if es_texto_espaciado_real(t) and p.style.name in ["Normal", "List Paragraph"]:
        to_delete.append((i, t[:80]))

print(f"Encontrados: {len(to_delete)} parrafos con texto espaciado real")
for idx, text in to_delete:
    print(f"  [{idx}] {text}")
