import sys; sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from docx import Document
NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
doc = Document(r'c:\Users\carus\OneDrive\Escritorio\PRACTICAS\TareasEpo\INFORME.docx')
p = doc.paragraphs

def txt(para):
    return ''.join(t.text or '' for t in para._p.findall(f'.//{{{NS}}}t'))

# Ver 3700 a 3940 (árbol de archivos, arquitectura, dev docs)
print("=== 3700-3940 ===")
for i in range(3700, 3940):
    t = txt(p[i])
    if t.strip():
        print(f'[{i}] {t[:110]}')
