# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

# Buscar TODOS los parrafos que son fragmentos sueltos de palabras cortadas
# Criterio: texto corto (<=12 chars), estilo Heading 3 o Normal, 
# que parece un fragmento (sin sentido propio)
fragmentos_sospechosos = []
palabras_fragmento = ["tacto", "Admin", "ción", "tación", "ción", "nes", "go de Fechas"]

for i, p in enumerate(paras):
    t = p.text.strip()
    # Parrafos Heading 3 con texto muy corto que no son titulos reales
    if p.style.name == "Heading 3" and t and len(t) <= 15:
        # Excluir titulos legitimos como "Figura 17", "Problemática", etc
        if not t.startswith("Figura") and not t.startswith("Tabla") and not t.startswith("Criterio") and not t.startswith("Código") and not t.startswith("Cód") and not t.startswith("Ceremonia") and not t.startswith("Iteración") and not t.startswith("Equipo") and not t.startswith("Categoría"):
            fragmentos_sospechosos.append((i, p.style.name, t))

print(f"Fragmentos sospechosos (Heading 3 cortos): {len(fragmentos_sospechosos)}\n")
for idx, style, text in fragmentos_sospechosos:
    # Mostrar contexto
    prev_t = paras[idx-1].text.strip()[:60] if idx > 0 else ""
    next_t = paras[idx+1].text.strip()[:60] if idx < len(paras)-1 else ""
    print(f"[{idx}] [{style}] '{text}'")
    print(f"  antes: [{paras[idx-1].style.name}] '{prev_t}'")
    print(f"  despues: [{paras[idx+1].style.name}] '{next_t}'")
    print()
