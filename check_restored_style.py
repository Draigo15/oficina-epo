# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")

for i, p in enumerate(doc.paragraphs):
    if "Diagrama de Casos de Uso describe" in p.text or "Diagramas de Secuencia UML documentan" in p.text:
        print(f"Par {i} style=[{p.style.name}]: {p.text[:80]}")
