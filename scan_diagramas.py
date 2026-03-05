from docx import Document
doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

targets = ["Diagrama de Secuencia", "Diagrama de componentes", "Diagrama de Despliegue", "Diagrama de clases", "Diagrama de base"]
for i, p in enumerate(paras):
    t = p.text.strip()
    for kw in targets:
        if kw.lower() in t.lower() and p.style.name in ["Normal","Heading 3","Heading 2"]:
            next_end = None
            sample = []
            for j in range(i+1, min(i+800, len(paras))):
                tj = paras[j].text.strip()
                sj = paras[j].style.name
                if "Nota. Elab" in tj or ("Heading" in sj and tj and j > i+5):
                    next_end = j
                    break
                if tj and len(sample) < 4:
                    sample.append(tj[:45])
            rango = f"[{i+1}..{next_end}]" if next_end else f"[{i+1}..?]"
            total = (next_end - i - 1) if next_end else "?"
            print(f"SUBTITULO [{i}]: \"{t}\"")
            print(f"  Rango contenido: {rango}  ({total} parrafos)")
            print(f"  Primeras lineas: {sample}")
            print()
            break
