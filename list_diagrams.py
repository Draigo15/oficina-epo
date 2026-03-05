# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")

print("=== DIAGRAMAS ENCONTRADOS EN EL DOCUMENTO ===\n")
n = 1
for p in doc.paragraphs:
    text = p.text.strip()
    # Buscar títulos de figuras/diagramas (Figura X, Figure X, Diagrama de...)
    if text.startswith("Figura") or text.startswith("Figure") or \
       "Diagrama" in text or "diagrama" in text or \
       text.startswith("Ilustración") or text.startswith("Gráfico"):
        print(f"{n}. {text}")
        n += 1
