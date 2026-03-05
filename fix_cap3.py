# -*- coding: utf-8 -*-
from docx import Document
from lxml import etree

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs
NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

def replace_text(idx, new_text):
    """Reemplaza el texto de un parrafo manteniendo formato"""
    p = paras[idx]
    # Buscar todos los t elements
    t_els = p._p.findall(f".//{{{NS}}}t")
    if t_els:
        t_els[0].text = new_text
        for t in t_els[1:]:
            t.text = ""
    print(f"  [R] [{idx}] -> {new_text[:80]}...")

def delete_para(idx):
    """Elimina un parrafo"""
    p = paras[idx]
    parent = p._p.getparent()
    parent.remove(p._p)
    print(f"  [D] [{idx}] eliminado")

# ============================================================
# PROBLEMA 1: [267-269] Procedimientos de diseno grafico 
# -> Reemplazar con procedimientos reales del desarrollo del sistema
# ============================================================
replace_text(267,
    "Levantamiento de requerimientos: Coordinación con la jefatura de la Oficina EPO "
    "para identificar las necesidades de gestión de tareas, seguimiento de actividades "
    "y generación de reportes del área."
)
replace_text(268,
    "Diseño e implementación: Desarrollo del frontend con React 18 y Tailwind CSS, "
    "implementación del backend con Node.js y Express, modelado de la base de datos "
    "MongoDB con tres colecciones (Users, Tasks, Notifications) y configuración de "
    "la autenticación JWT con bcryptjs."
)
replace_text(269,
    "Pruebas y despliegue: Ejecución de pruebas funcionales por módulo, corrección de "
    "errores detectados, despliegue del frontend en Vercel y del backend en Render, "
    "y capacitación al personal del área en el uso del sistema."
)
print("Problema 1 corregido (267-269)")

# ============================================================
# PROBLEMA 2: [272, 274-276] Analisis de asistencia docente
# -> Reemplazar con actividades reales de gestion de tareas
# ============================================================
replace_text(272,
    "La gestión se realizó mediante el registro sistemático de tareas en el sistema, "
    "asignando prioridades (alta, media, baja), estados (pendiente, en progreso, completada) "
    "y fechas límite, lo que permitió al equipo visualizar el avance de las actividades "
    "del área en tiempo real a través del Dashboard."
)
replace_text(274,
    "Registro de tareas: Creación de tareas con título, descripción detallada, prioridad, "
    "estado inicial y fecha límite asignada según los plazos institucionales."
)
replace_text(275,
    "Seguimiento y actualización: Cambio de estados mediante drag and drop en el tablero "
    "Kanban, actualización de prioridades según urgencia y monitoreo del cumplimiento "
    "de plazos a través de las notificaciones automáticas del sistema."
)
replace_text(276,
    "Generación de reportes: Emisión de reportes PDF mensuales con estadísticas de tareas "
    "completadas, pendientes y en progreso, incluyendo gráficos de barras y resumen "
    "por usuario para seguimiento administrativo."
)
print("Problema 2 corregido (272, 274-276)")

# ============================================================
# PROBLEMA 3: [280-283] Evaluacion docente / estadisticas
# -> Reemplazar con procesamiento real de reportes del sistema
# ============================================================
replace_text(280, "Los procedimientos implementados en el módulo de reportes incluyeron:")
replace_text(281,
    "Recolección de datos: Consulta automatizada a la base de datos MongoDB para obtener "
    "las tareas registradas en el periodo mensual, agrupadas por usuario, estado y prioridad."
)
replace_text(282,
    "Procesamiento estadístico: Cálculo de indicadores de productividad como porcentaje de "
    "tareas completadas a tiempo, distribución por prioridad, promedio de tareas por usuario "
    "y tendencias mensuales de cumplimiento."
)
replace_text(283,
    "Generación de reportes PDF: Creación automática de documentos PDF mediante jsPDF y "
    "jsPDF-autotable con tablas detalladas, gráficos estadísticos generados con Recharts "
    "y resúmenes ejecutivos para la dirección del área."
)
print("Problema 3 corregido (280-283)")

# ============================================================
# PROBLEMA 4: [286] Texto fantasma del portal
# -> Reemplazar con texto acorde al soporte tecnico real
# ============================================================
replace_text(286,
    "El soporte técnico brindado se complementó con la configuración y mantenimiento "
    "del sistema web de gestión de tareas, incluyendo la administración de usuarios, "
    "gestión de permisos de acceso y resolución de incidencias técnicas reportadas "
    "por el personal del área."
)
print("Problema 4 corregido (286)")

# ============================================================
# PROBLEMA 5: [289-291] Textos fantasma del portal/CMS
# -> Reemplazar con actividades reales de soporte
# ============================================================
replace_text(289,
    "Administración de usuarios: Alta de cuentas de usuario en el sistema, asignación "
    "de roles (administrador, usuario estándar) y restablecimiento de credenciales cuando "
    "fue requerido."
)
replace_text(290,
    "Monitoreo del sistema: Verificación periódica del funcionamiento del servidor backend "
    "en Render, revisión de logs de errores y validación de la conectividad con MongoDB Atlas."
)
replace_text(291,
    "Resolución de incidencias: Atención de reportes de errores del personal, depuración "
    "de problemas de autenticación JWT, corrección de fallos en la generación de reportes "
    "y optimización del rendimiento de consultas a la base de datos."
)
print("Problema 5 corregido (289-291)")

# Guardar
out = "INFORME_FINAL_SISTEMA_v2.docx"
try:
    doc.save(out)
    print(f"\nGuardado en {out}")
except PermissionError:
    out = "INFORME_FINAL_SISTEMA_v3.docx"
    doc.save(out)
    print(f"\nArchivo bloqueado, guardado en {out}")
