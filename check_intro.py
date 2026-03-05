# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")

in_intro = False
for p in doc.paragraphs:
    text = p.text.strip()
    if text.upper() == "INTRODUCCIÓN" or text.upper() == "INTRODUCCION":
        in_intro = True
        print("--- INICIO DE INTRODUCCIÓN ---")
        continue
    
    if in_intro:
        # Stop at the next major title (usually all caps or something like "1. OBJETIVOS")
        if text.isupper() and len(text) > 3 or text.startswith("1."):
            break
        if text:
            print("-", text)

