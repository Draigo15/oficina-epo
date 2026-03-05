# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")
bad = ["contacto", "programas académicos", "programa específico", "edita descripción de un programa", "misión institucional", "formulario de contacto", "noticia"]

for p in doc.paragraphs:
    texto = p.text.lower()
    for b in bad:
        if b in texto and ("lenguaje de programa" not in texto): # evitar borrar de "programación" 
             p.text = ""
             break

doc.save("INFORME_FINAL_SISTEMA.docx")
