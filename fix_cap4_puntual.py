# -*- coding: utf-8 -*-
from docx import Document
from lxml import etree

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs
NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

def replace_text(idx, new_text):
    p = paras[idx]
    t_els = p._p.findall(f".//{{{NS}}}t")
    if t_els:
        t_els[0].text = new_text
        for t in t_els[1:]:
            t.text = ""
    print(f"  [R] [{idx}] {p.style.name} -> {new_text[:80]}...")

# ============================================================
# 1. [313] Procesamiento manual de evaluaciones docentes -> del sistema real
# ============================================================
replace_text(313,
    "Procesamiento Manual de Datos Operativos: El seguimiento de tareas administrativas, "
    "la compilaci\u00f3n de reportes mensuales y el control de actividades del \u00e1rea se "
    "ejecutaban completamente de forma manual mediante hojas de c\u00e1lculo independientes, "
    "requiriendo tiempo considerable del personal administrativo, generando alto riesgo de "
    "errores y dificultando la generaci\u00f3n oportuna de reportes ejecutivos para toma de "
    "decisiones. La ausencia de automatizaci\u00f3n limitaba la capacidad de an\u00e1lisis y "
    "seguimiento de indicadores de productividad del \u00e1rea."
)

# ============================================================
# 2. [322] Problema General con fantasmas (contenido institucional, prospectos)
# ============================================================
replace_text(322,
    "La ausencia de una plataforma digital centralizada ocasionaba que las tareas de "
    "gesti\u00f3n de actividades del \u00e1rea, generaci\u00f3n de reportes mensuales, seguimiento "
    "de productividad y comunicaci\u00f3n interna entre el personal se realizaran de manera "
    "manual, fragmentada y con alta dependencia de herramientas ofim\u00e1ticas b\u00e1sicas "
    "no especializadas, lo cual impactaba negativamente en la eficiencia operativa de la "
    "oficina, limitaba la capacidad de an\u00e1lisis mediante indicadores cuantitativos y "
    "dificultaba la implementaci\u00f3n de estrategias de mejora continua basadas en "
    "informaci\u00f3n hist\u00f3rica sistematizada."
)

# ============================================================
# 3. [400] Notificaciones Internas -> texto de aspirantes/inscripciones
# Reemplazar con descripcion real de notificaciones
# ============================================================
replace_text(400,
    "M\u00f3dulo de notificaciones internas que mantiene al personal informado sobre cambios "
    "relevantes en las tareas del \u00e1rea. El sistema genera notificaciones autom\u00e1ticas al "
    "crear, actualizar o eliminar tareas, permitiendo a cada usuario visualizar sus "
    "notificaciones pendientes, marcarlas como le\u00eddas de forma individual o masiva, y "
    "acceder a un centro de notificaciones con historial completo. El contador de "
    "notificaciones no le\u00eddas se muestra en la barra de navegaci\u00f3n para acceso inmediato."
)

# ============================================================
# 4. [402] "Sistema de Gestion de Contenidos" -> titulo incorrecto
# El texto [403] describe autenticacion JWT, asi que:
# - Eliminar titulo [402] (es fantasma del portal)
# - [403] ya queda cubierto por [408] que es "Sistema de Autenticacion"
# Pero [408] esta vacio. Solucion: renombrar [402] a algo coherente con [403]
# ============================================================
replace_text(402, "Sistema de Autenticaci\u00f3n y Control de Acceso")
print("  [402] titulo renombrado de 'Gestion de Contenidos' a 'Autenticacion y Control de Acceso'")

# ============================================================
# 5. [408] "Sistema de Autenticacion y Autorizacion" vacio -> eliminar (duplicado)
# Ya que [402] ahora cubre la autenticacion con su texto en [403]
# ============================================================
p408 = paras[408]
p408._p.getparent().remove(p408._p)
print("  [D] [408] subtitulo duplicado 'Sistema de Autenticacion y Autorizacion' eliminado")

# ============================================================
# 6. CS-01 "Visualizar Home/Inicio" -> "Visualizar Dashboard"
# ============================================================
for idx in [2750, 2752]:
    p = paras[idx]
    t_els = p._p.findall(f".//{{{NS}}}t")
    for t in t_els:
        if t.text and "Home/Inicio" in t.text:
            t.text = t.text.replace("Home/Inicio", "Dashboard")
            print(f"  [R] [{idx}] Home/Inicio -> Dashboard")

# Guardar
out = "INFORME_FINAL_SISTEMA_v2.docx"
try:
    doc.save(out)
    print(f"\nGuardado en {out}")
except PermissionError:
    out = "INFORME_FINAL_SISTEMA_v3.docx"
    doc.save(out)
    print(f"\nArchivo bloqueado, guardado en {out}")
