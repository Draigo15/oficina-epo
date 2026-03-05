# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Buscar parrafos con texto muy corto (1-4 chars) que son fragmentos rotos
# Especialmente en zonas de figuras/diagramas
broken_zones = []
consecutive = 0
zone_start = None

for i, p in enumerate(paras):
    t = p.text.strip()
    if t and len(t) <= 6 and not t.startswith("RF-") and not t.startswith("RNF") and t not in [".", ","]:
        if consecutive == 0:
            zone_start = i
        consecutive += 1
    else:
        if consecutive >= 3:
            broken_zones.append((zone_start, i-1, consecutive))
        consecutive = 0

# Mostrar las zonas con fragmentos
print(f"Zonas con 3+ parrafos fragmentados consecutivos: {len(broken_zones)}\n")
for start, end, count in broken_zones[:30]:
    texts = []
    for j in range(start, min(end+1, start+8)):
        texts.append(f"  [{j}] '{paras[j].text.strip()}'")
    print(f"--- Zona [{start}-{end}] ({count} fragmentos) ---")
    print("\n".join(texts))
    if count > 8:
        print(f"  ... +{count-8} mas")
    print()
