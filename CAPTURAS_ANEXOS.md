# Guía de Capturas para Anexos del Informe
> Orden según el informe Word · Fig 29 → Fig 55 (27 capturas únicas)

---

## Módulo de Autenticación — Login

### Figura 29 · Pantalla de inicio de sesión del sistema
> Ir a `http://localhost:3001/login` sin estar autenticado · capturar la pantalla completa

`[ IMAGEN AQUÍ ]`

---

### Figura 30 · Modal de inicio de sesión exitoso
> Capturar el toast/modal verde de bienvenida en primer plano justo al iniciar sesión

`[ IMAGEN AQUÍ ]`

---

## Panel de Administración

### Figura 31 · Dashboard principal completo con estadísticas
> Logueado como Jefa · capturar `/dashboard` con todas las tarjetas de estadísticas visibles (pendientes, completadas, vencidas, resumen del mes)

`[ IMAGEN AQUÍ ]`

---

## Módulo de Gestión de Tareas

### Figura 32 · Panel de gestión de tareas — listado general
> Ir a `/tasks` · capturar el listado de tareas completo

`[ IMAGEN AQUÍ ]`

---

### Figura 33 · Formulario de creación de nueva tarea
> En `/tasks` · hacer clic en **"Nueva Tarea"** · capturar el modal abierto (vacío)

`[ IMAGEN AQUÍ ]`

---

### Figura 34 · Formulario de nueva tarea con campos completos
> Modal de nueva tarea · **llenar todos los campos** (título, descripción, prioridad, fecha límite) · capturar antes de guardar

`[ IMAGEN AQUÍ ]`

---

### Figura 35 · Modal de comentarios de una tarea
> En `/tasks` · hacer clic en el ícono de burbuja de chat (💬) de una tarea que ya tenga comentarios · capturar el modal abierto con los comentarios visibles y el campo de nuevo comentario

`[ IMAGEN AQUÍ ]`

---

### Figura 36 · Drag & drop de tarea entre estados
> En `/tasks` vista Kanban · arrastrar una tarjeta de "Pendiente" a "Completada" · capturar durante el arrastre

`[ IMAGEN AQUÍ ]`

---

### Figura 37 · Filtro de tareas por prioridad alta
> En `/tasks` vista Lista · hacer clic en el botón **"🔴 Urgente"** del filtro de prioridad · capturar el listado mostrando solo las tareas urgentes filtradas

`[ IMAGEN AQUÍ ]`

---

### Figura 38 · Búsqueda textual en tiempo real de tareas
> En `/tasks` · escribir un término en el buscador · capturar los resultados apareciendo en tiempo real

`[ IMAGEN AQUÍ ]`

---

### Figura 39 · Vista de tareas completadas — historial
> En `/tasks` · aplicar el filtro **"Completadas"** · capturar el listado de tareas completadas

`[ IMAGEN AQUÍ ]`

---

## Módulo de Notificaciones

### Figura 40 · Centro de notificaciones — listado general
> Ir a `/notifications` · capturar la lista completa de notificaciones

`[ IMAGEN AQUÍ ]`

---

### Figura 41 · Notificación marcada como leída
> En `/notifications` · hacer clic en **"Marcar como leída"** en una notificación · capturar el cambio de estado

`[ IMAGEN AQUÍ ]`

---

### Figura 42 · Notificaciones no leídas — contador en pantalla
> Ir a `/notifications` · capturar el encabezado de la página con el contador de notificaciones sin leer visible (ej: "6 sin leer") y la lista debajo

`[ IMAGEN AQUÍ ]`

---

## Estadísticas del Sistema

### Figura 43 · Dashboard de estadísticas — gráficos Recharts
> Capturar la página `/stats` completa (parte superior con gráficos de barras y PieChart)

`[ IMAGEN AQUÍ ]`

---

### Figura 44 · Estadísticas — resumen de indicadores
> Capturar la parte inferior de `/stats` con las tarjetas: total de tareas, pendientes, completadas, prioridad alta

`[ IMAGEN AQUÍ ]`

---

## Módulo de Reportes PDF

### Figura 45 · Generación de reporte PDF — selección de período
> Ir a `/reports` · capturar el selector de mes y año **antes** de generar

`[ IMAGEN AQUÍ ]`

---

### Figura 46 · Vista previa de reporte PDF generado
> En `/reports` · seleccionar un mes con datos · clic en **"Cargar datos"** · capturar la tabla de vista previa en pantalla

`[ IMAGEN AQUÍ ]`

---

### Figura 47 · Descarga de reporte PDF desde navegador
> Clic en **"Descargar PDF"** · capturar la barra / diálogo de descarga del navegador

`[ IMAGEN AQUÍ ]`

---

### Figura 48 · Reporte PDF — tabla de tareas detallada
> Abrir el PDF descargado · capturar la tabla interior con el detalle de tareas

`[ IMAGEN AQUÍ ]`

---

## Perfil de Usuario

### Figura 49 · Perfil de usuario — vista Jefa
> Logueado como **Jefa** · ir a `/profile` · capturar con el badge amarillo "Jefa" visible

`[ IMAGEN AQUÍ ]`

---

### Figura 50 · Perfil de usuario — cambio de contraseña
> En `/profile` · rellenar los campos **Nueva Contraseña** y **Confirmar Contraseña** · capturar el formulario

`[ IMAGEN AQUÍ ]`

---

### Figura 51 · Perfil de usuario — vista Asistente
> Cerrar sesión · entrar como **Asistente** · ir a `/profile` · capturar con badge azul "Asistente"

`[ IMAGEN AQUÍ ]`

---

## Vistas Responsivas y Modo Oscuro

### Figura 52 · Vista responsiva — móvil (dashboard)
> Chrome DevTools `F12` → ícono móvil → **iPhone SE (375 px)** → navegar a `/dashboard` → capturar

`[ IMAGEN AQUÍ ]`

---

### Figura 53 · Vista responsiva — tablet (tareas)
> DevTools → cambiar a **iPad (768 px)** → navegar a `/tasks` → capturar

`[ IMAGEN AQUÍ ]`

---

### Figura 54 · Vista en modo oscuro — dashboard
> Clic en el **ícono de luna** en la barra superior → modo oscuro activo → capturar `/dashboard`

`[ IMAGEN AQUÍ ]`

---

### Figura 55 · Vista en modo oscuro — tareas
> Con modo oscuro activo → ir a `/tasks` → capturar

`[ IMAGEN AQUÍ ]`

---


