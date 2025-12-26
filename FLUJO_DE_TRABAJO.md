# Sistema de Permisos y Flujo de Trabajo

## 🎯 Filosofía del Sistema

**Ambos usuarios pueden crear tareas**, pero **solo la Jefa tiene control total**.

---

## 👥 Roles y Permisos

### 👩‍💼 JEFA (Administradora)

#### ✅ Puede hacer TODO:
- ✅ Crear tareas
- ✅ Editar cualquier tarea (título, descripción, prioridad)
- ✅ Eliminar cualquier tarea
- ✅ Completar tareas
- ✅ Deshacer tareas completadas
- ✅ Ver todas las tareas
- ✅ Generar reportes

#### 🎯 Casos de uso:
1. **Asignación directa**: Crea tarea en el sistema
2. **Corrección**: Edita tareas con errores
3. **Gestión**: Elimina tareas duplicadas o inválidas
4. **Priorización**: Cambia prioridades según necesidad
5. **Supervisión**: Ve todo el trabajo registrado

---

### 👨‍💻 ASISTENTE (Ejecutor)

#### ✅ Puede hacer:
- ✅ Crear tareas (auto-registro de trabajo asignado)
- ✅ Completar cualquier tarea pendiente
- ✅ Deshacer tareas completadas (por si marcó por error)
- ✅ Ver todas las tareas
- ✅ Generar su reporte PDF mensual

#### ❌ NO puede hacer:
- ❌ Editar tareas existentes
- ❌ Eliminar tareas
- ❌ Cambiar prioridades

#### 🎯 Casos de uso:
1. **Registro rápido**: La Jefa asigna verbalmente → Asistente crea la tarea
2. **Autonomía**: Registra su propio trabajo sin esperar
3. **Ejecución**: Completa tareas cuando termina el trabajo
4. **Reporte de cobro**: Genera su PDF mensual automático

---

## 🔄 Flujos de Trabajo

### **Flujo 1: Jefa asigna verbalmente**
```
1. Jefa (verbal): "Rodrigo, haz X, Y y Z"
2. Asistente: Abre sistema → Crea las 3 tareas
3. Asistente: Hace el trabajo
4. Asistente: Marca tareas como completadas
5. Sistema: Guarda fecha/hora automáticamente
```

### **Flujo 2: Jefa asigna digitalmente**
```
1. Jefa: Crea tarea "Revisar contratos"
2. Asistente: Ve la tarea pendiente
3. Asistente: Hace el trabajo
4. Asistente: Marca como completada
```

### **Flujo 3: Corrección de la Jefa**
```
1. Asistente: Crea tarea "Revisar documentso" (error de tipeo)
2. Jefa: Ve el error → Edita → "Revisar documentos"
3. Asistente: Ve la corrección → Hace el trabajo
```

### **Flujo 4: Cambio de prioridad**
```
1. Asistente: Crea tarea con prioridad "Normal"
2. Jefa: Cliente urgente → Edita → Prioridad "Alta"
3. Asistente: Ve el cambio → Atiende primero esa tarea
```

---

## 📊 Matriz de Permisos Detallada

| Acción | Jefa | Asistente | Justificación |
|--------|------|-----------|---------------|
| **Crear tarea** | ✅ | ✅ | Ambos necesitan registrar trabajo |
| **Ver tarea** | ✅ | ✅ | Transparencia total |
| **Editar tarea** | ✅ | ❌ | Solo Jefa corrige/ajusta |
| **Eliminar tarea** | ✅ | ❌ | Solo Jefa decide qué es válido |
| **Completar tarea** | ✅ | ✅ | Ambos ejecutan trabajo |
| **Deshacer completada** | ✅ | ✅ | Corrección de errores |
| **Cambiar prioridad** | ✅ | ❌ | Solo Jefa define urgencias |
| **Generar reporte** | ✅ | ✅ | Ambos necesitan PDF |

---

## 🎨 Diferencias Visuales en la UI

### **Vista de la Jefa - Tarea Pendiente:**
```
┌─────────────────────────────────────┐
│ 📋 Revisar contratos               │
│ Prioridad: Alta                     │
│ Creada por: Juan Pérez              │
│ Fecha: 25/12/2024 10:00 AM         │
│                                     │
│ [✅ Completar] [✏️ Editar] [🗑️ Eliminar] │
└─────────────────────────────────────┘
```

### **Vista del Asistente - Tarea Pendiente:**
```
┌─────────────────────────────────────┐
│ 📋 Revisar contratos               │
│ Prioridad: Alta                     │
│ Creada por: María González          │
│ Fecha: 25/12/2024 10:00 AM         │
│                                     │
│ [✅ Completar]                      │
└─────────────────────────────────────┘
```

---

## 🔒 Seguridad Implementada

### Backend (API):
```javascript
// Todos pueden crear
router.post('/tasks', protect, createTask);

// Solo Jefa puede editar
router.put('/tasks/:id', protect, isJefa, updateTask);

// Solo Jefa puede eliminar
router.delete('/tasks/:id', protect, isJefa, deleteTask);

// Todos pueden completar
router.patch('/tasks/:id/complete', protect, completeTask);
```

### Frontend (React):
```javascript
// Botón de editar solo visible para Jefa
{isJefa() && (
  <button onClick={handleEdit}>Editar</button>
)}

// Botón de eliminar solo visible para Jefa
{isJefa() && (
  <button onClick={handleDelete}>Eliminar</button>
)}
```

---

## 📄 Reporte PDF Mensual

### Lo que incluye:
- ✅ Todas las tareas completadas en el mes
- ✅ Fecha y hora exacta de completado
- ✅ Quién completó cada tarea
- ✅ Prioridad de cada tarea
- ✅ Total de tareas completadas

### Formato:
```
OFICINA EPO
REPORTE MENSUAL DE ACTIVIDADES
Diciembre 2024

# | Tarea                 | Prioridad | Fecha      | Hora
--|----------------------|-----------|------------|-------
1 | Revisar contratos    | Alta      | 25/12/2024 | 15:45
2 | Actualizar BD        | Normal    | 26/12/2024 | 10:30
3 | Llamar proveedores   | Alta      | 27/12/2024 | 14:15

Total de tareas completadas: 3

_____________________        _____________________
       Jefa                         Asistente
```

---

## 💡 Ventajas de este Sistema

### Para la Jefa:
✅ Control total sobre el contenido  
✅ Puede corregir errores de tipeo  
✅ Puede cambiar prioridades  
✅ Ve todo el trabajo registrado  
✅ No necesita crear todo manualmente  

### Para el Asistente:
✅ Autonomía para registrar trabajo  
✅ No espera que la Jefa entre al sistema  
✅ Puede completar tareas inmediatamente  
✅ Genera su propio reporte de cobro  
✅ Ve claramente qué está pendiente  

### Para ambos:
✅ Elimina el uso de cuadernos  
✅ Registro automático de fecha/hora  
✅ Reporte PDF profesional para nómina  
✅ Historial completo de tareas  
✅ Transparencia total del trabajo  

---

## 🚀 Próximas Funcionalidades (Opcionales)

1. **Comentarios en tareas** - Para comunicación interna
2. **Notificaciones** - Cuando se crea/completa una tarea
3. **Estadísticas avanzadas** - Productividad por semana/mes
4. **Etiquetas/Categorías** - Organizar tareas por tipo
5. **Búsqueda avanzada** - Filtrar por fecha/usuario/prioridad
6. **Historial de cambios** - Auditoría de ediciones

---

**Sistema implementado el 25 de diciembre de 2025**
