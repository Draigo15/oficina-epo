# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")

for p in doc.paragraphs:
    if "La generación de soluciones tecnológicas escalables que digitalizan y optimiza" in p.text or "La generación de soluciones tecnológicas escalables" in p.text:
        print("Borrando párrafo sobrante:", p.text)
        p._element.getparent().remove(p._element)

doc.save("INFORME_FINAL_SISTEMA_2.docx")
print("Hecho")
