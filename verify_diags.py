from docx import Document
doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs
print("=== Diagramas en el documento ===")
for i, p in enumerate(paras):
    t = p.text.strip()
    s = p.style.name
    if any(kw in t for kw in ["Diagrama de Secuencia", "Diagrama de componentes", "Diagrama de Despliegue", "Diagrama de base", "Diagrama de clases", "[Insertar"]):
        print(f"[{i}] {s[:18]} | {t[:85]}")
print(f"\nTotal parrafos: {len(paras)}")
