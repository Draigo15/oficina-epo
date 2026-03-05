# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA.docx")
elim = 0
for table in doc.tables:
    text_all = ""
    for r in table.rows:
        for c in r.cells:
            text_all += c.text + " "
    
    # Revisamos si la tabla menciona estos casos de uso fantasma
    kws = ["Visualizar Información de Programas Académicos", 
           "Consultar Noticias", 
           "Consultar Noti- cias",
           "Ver Información Institucional", 
           "Enviar Mensaje de Contacto", 
           "Registrarse como Estudiante", 
           "Gestionar Leads", 
           "Actualizar Contenido",
           "Actualizar Conte- nido",
           "Visualizar Mensajes de Contacto",
           "Visualizar Mensa- jes"]
           
    for kw in kws:
        if kw.lower() in text_all.lower():
            # intentamos borrarla
            try:
                table._element.getparent().remove(table._element)
                elim += 1
                break
            except:
                pass


doc.save("INFORME_FINAL_SISTEMA.docx")
print("Borradas:", elim)
