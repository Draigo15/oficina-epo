# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_Limpio.docx")

keywords_to_remove = [
    "Noticias", 
    "Programas Académicos", 
    "Información Institucional",
    "Mensaje de Contacto", 
    "Registrar estudiante",
    "Estudiante",
    "Prospectos", 
    "Leads",
    "Contenido del Sitio Web",
    "Gestionar Contenido",
    "Mnesaje de Contacto",
]

def has_invalid_keyword(text):
    text_lower = text.lower()
    for kw in keywords_to_remove:
        if kw.lower() in text_lower:
            return True
    return False

# Para eliminar las tablas correctas verificamos TODAS las filas iniciales
tables_to_remove = []
for table in doc.tables:
    text_in_table = ""
    for row in table.rows:
        for cell in row.cells:
            text_in_table += cell.text + " "
    
    if has_invalid_keyword(text_in_table) and "Narrativa del Caso de Uso" in text_in_table:
        tables_to_remove.append(table)
    # También eliminar los cuadros de Criterios de priorización o Casos de Uso inválidos
    elif has_invalid_keyword(text_in_table) and "Prioridad" in text_in_table:
         if "CS-02" in text_in_table and "Noticias" in text_in_table:
             tables_to_remove.append(table)

for t in tables_to_remove:
    t._element.getparent().remove(t._element)

doc.save("INFORME_Actualizado_Sistema.docx")
print(f"Eliminadas {len(tables_to_remove)} tablas.")
