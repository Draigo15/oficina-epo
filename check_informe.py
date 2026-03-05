# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME.docx")

print("--- Análisis de Casos de Uso en el Documento ---")
casos_uso = set()
for p in doc.paragraphs:
    if "Caso de Uso" in p.text or "CS-" in p.text:
        text = p.text.strip()
        if len(text) < 150: # Evitar parrafos gigantes
            print("-", text)
            
print("\n--- Componentes Reales en el Frontend ---")
import os
import glob
try:
    for f in glob.glob("frontend/src/pages/**/*.jsx", recursive=True):
        print("Frontend:", f)
    for f in glob.glob("backend/routes/**/*.js", recursive=True):
        print("Backend:", f)
except Exception as e:
    print(e)
