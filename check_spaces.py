# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")

print("=== SECCIONES DE DIAGRAMAS DE SECUENCIA ===\n")
for i, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if "Secuencia" in text or "secuencia" in text:
        print(f"Párrafo {i}: {text}")
