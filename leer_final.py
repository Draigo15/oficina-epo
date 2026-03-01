import sys; sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from docx import Document
NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
doc = Document(r'c:\Users\carus\OneDrive\Escritorio\PRACTICAS\TareasEpo\INFORME.docx')
p = doc.paragraphs

def txt(para):
    return ''.join(t.text or '' for t in para._p.findall(f'.//{{{NS}}}t'))

# Ver estructura completa desde 4190
for i in range(4190, len(p)):
    t = txt(p[i])
    if t.strip():
        print(f'[{i}] {t[:110]}')
