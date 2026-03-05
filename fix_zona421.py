# -*- coding: utf-8 -*-
from docx import Document
import re

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Patron para detectar texto espaciado "S ecretaria/A d m in" etc.
# Al menos 3 palabras donde la mayoria son muy cortas (1-4 chars)
def es_texto_espaciado(text):
    words = text.split()
    if len(words) < 4:
        return False
    short = sum(1 for w in words if len(w) <= 4)
    # Si mas del 60% son palabras de 4 chars o menos y hay >= 5 palabras
    if len(words) >= 5 and short / len(words) >= 0.6:
        return True
    # También: tiene letras sueltas pegadas "S ecretaria" - patron regex
    if re.search(r'\b[A-Za-záéíóúñÁÉÍÓÚÑ]\s[a-záéíóúñ]{2,}', text) and len(words) >= 4:
        return True
    return False

to_delete = []

for i, p in enumerate(paras):
    t = p.text.strip()
    if not t:
        continue
    if es_texto_espaciado(t) and p.style.name in ["Normal", "List Paragraph", "Body Text"]:
        to_delete.append((i, t[:70]))

print(f"Encontrados: {len(to_delete)} parrafos espaciados")
for idx, text in to_delete:
    print(f"  [{idx}] {text}")
