import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from docx import Document
from lxml import etree

DEST = r'c:\Users\carus\OneDrive\Escritorio\PRACTICAS\TareasEpo\INFORME.docx'
doc = Document(DEST)
NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

para = doc.paragraphs[1218]
all_t = para._p.findall(f'.//{{{NS}}}t')
full = ''.join(t.text or '' for t in all_t)
print(f"Texto completo [1218]: {repr(full)}")

# Reemplazar
nueva = ' El sistema de autenticación JWT debe estar activo y configurado.'
all_t[0].text = nueva
for t in all_t[1:]:
    t.text = ''

full2 = ''.join(t.text or '' for t in para._p.findall(f'.//{{{NS}}}t'))
print(f"Resultado: {repr(full2)}")

doc.save(DEST)
print("Guardado OK")
