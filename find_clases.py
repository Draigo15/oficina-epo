from docx import Document
doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs
for i, p in enumerate(paras):
    t = p.text.strip()
    if "clases" in t.lower():
        print(f"[{i}] {p.style.name[:18]} | {t[:80]}")
