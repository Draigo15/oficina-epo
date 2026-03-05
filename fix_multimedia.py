# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Verificar zona 4355-4375 para encontrar el Heading "Gestión Multimedia"
print("=== ZONA 4355-4380 ===")
for i in range(4355, min(4385, len(paras))):
    t = paras[i].text.strip()
    print(f"[{i}] [{paras[i].style.name}] '{t}'")

print()
# Buscar por 'ultimedia'
for i, p in enumerate(paras):
    if "ultimedia" in p.text:
        print(f"[{i}] [{p.style.name}] '{p.text.strip()[:80]}'")
