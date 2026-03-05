# -*- coding: utf-8 -*-
from docx import Document
NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

doc = Document("INFORME_FINAL_SISTEMA.docx")
for i, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if "Leads" in text or "Contenido" in text or "Mensaje de Con" in text or "Mnesaje" in text:
        print(f"\nPárrafo {i}: [{text}]")
        for j, run in enumerate(p.runs):
            print(f"  run {j}: [{run.text}]")
        # Ver XML raw
        all_t = p._p.findall(f".//{{{NS}}}t")
        print(f"  XML t-elements: {[t.text for t in all_t]}")
