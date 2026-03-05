# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_Limpio.docx")

for i, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if text.startswith("Narrativa del Caso de Uso") or text.startswith("Caso de Uso") or text.startswith("Diagrama de"):
        print(f"Index {i}: {text}")
