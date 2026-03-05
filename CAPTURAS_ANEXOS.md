# Guía de Capturas para Anexos del Informe
> Orden exacto según el informe Word · Fig 29 → Fig 66

---

## Módulo de Autenticación — Login

### Figura 29 · Pantalla de inicio de sesión del sistema
> Ir a `http://localhost:3001/login` sin estar autenticado · capturar la pantalla completa

`[ IMAGEN AQUÍ ]`

---

### Figura 30 · Inicio de sesión exitoso — redirección al dashboard
> Ingresar credenciales correctas · capturar el toast verde `¡Bienvenido de nuevo, [nombre]!` que aparece al entrar al dashboard

`[ IMAGEN AQUÍ ]`

---

### Figura 31 · Dashboard principal — vista rol Jefa
> Logueado como Jefa · capturar `/dashboard` completo

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

## Dashboard Principal

### Figura 34 · Dashboard principal — bienvenida y resumen institucional
> ⚠️ El Word decía "Página Nosotros" (sistema anterior — no existe en el actual)
> **Usar:** capturar el Dashboard con el saludo `¡Hola, Angela!` y el título "Oficina Epo" visibles en la barra superior

`[ IMAGEN AQUÍ ]`

---

### Figura 35 · Gráfico de barras — tareas completadas por semana
> Ir a `/stats` · capturar el gráfico de barras Recharts

`[ IMAGEN AQUÍ ]`

---

### Figura 36 · Gráfico de distribución por prioridad
> En `/stats` · capturar el PieChart de distribución (prioridad alta / normal)

`[ IMAGEN AQUÍ ]`

---

## Módulo de Notificaciones

### Figura 37 · Centro de notificaciones — listado general
> Ir a `/notifications` · capturar la lista completa de notificaciones

`[ IMAGEN AQUÍ ]`

---

### Figura 38 · Notificación marcada como leída
> En `/notifications` · hacer clic en **"Marcar como leída"** en una notificación · capturar el cambio de estado

`[ IMAGEN AQUÍ ]`

---

## Módulo de Autenticación

### Figura 39 · Modal de inicio de sesión exitoso
> Capturar el toast/modal verde de bienvenida en primer plano justo al iniciar sesión

`[ IMAGEN AQUÍ ]`

---

## Panel de Administración

### Figura 40 · Dashboard principal completo con estadísticas
> Capturar `/dashboard` con todas las tarjetas de estadísticas visibles (pendientes, completadas, vencidas, resumen del mes)

`[ IMAGEN AQUÍ ]`

---

## Gestión de Tareas

### Figura 41 · Vista de tareas — calendario o kanban
> En `/tasks` · cambiar a la vista de **Calendario** o **Kanban** usando los botones de vista · capturar

`[ IMAGEN AQUÍ ]`

---

### Figura 42 · Formulario de nueva tarea con campos completos
> Modal de nueva tarea · **llenar todos los campos** (título, descripción, prioridad, responsable, fecha límite) · capturar antes de guardar

`[ IMAGEN AQUÍ ]`

---

### Figura 43 · Detalle de tarea con historial de cambios
> Hacer clic en una tarea existente para ver su detalle / comentarios / historial · capturar

`[ IMAGEN AQUÍ ]`

---

## Estadísticas del Sistema

### Figura 44 · Dashboard de estadísticas — gráficos Recharts
> Capturar la página `/stats` completa (parte superior con gráficos)

`[ IMAGEN AQUÍ ]`

---

### Figura 45 · Estadísticas — resumen de indicadores
> ⚠️ El Word no tiene descripción para esta figura
> **Usar:** capturar la parte inferior de `/stats` con las tarjetas: total de tareas, pendientes, completadas, prioridad alta

`[ IMAGEN AQUÍ ]`

---

## Módulo de Reportes PDF

### Figura 46 · Generación de reporte PDF — selección de período
> Ir a `/reports` · capturar el selector de mes y año **antes** de generar

`[ IMAGEN AQUÍ ]`

---

## Perfil de Usuario *(sección del Word — contiene Figs. 47–51)*

### Figura 47 · Vista previa de reporte PDF generado
> En `/reports` · seleccionar un mes con datos · clic en **"Cargar datos"** · capturar la tabla de vista previa en pantalla

`[ IMAGEN AQUÍ ]`

---

### Figura 48 · Descarga de reporte PDF desde navegador
> Clic en **"Descargar PDF"** · capturar la barra / diálogo de descarga del navegador

`[ IMAGEN AQUÍ ]`

---

### Figura 49 · Reporte PDF — tabla de tareas detallada
> Abrir el PDF descargado · capturar la tabla interior con el detalle de tareas

`[ IMAGEN AQUÍ ]`

---

### Figura 50 · Perfil de usuario — vista Jefa
> Logueado como **Jefa** · ir a `/profile` · capturar con el badge amarillo "Jefa" visible

`[ IMAGEN AQUÍ ]`

---

### Figura 51 · Perfil de usuario — cambio de contraseña
> En `/profile` · rellenar los campos **Nueva Contraseña** y **Confirmar Contraseña** · capturar el formulario

`[ IMAGEN AQUÍ ]`

---

## Gestión Multimedia *(sección del Word — contiene Figs. 52–66)*

### Figura 52 · Perfil de usuario — vista Asistente
> Cerrar sesión · entrar como **Asistente** · ir a `/profile` · capturar con badge azul "Asistente"

`[ IMAGEN AQUÍ ]`

---

### Figura 53 · Panel de administración — gestión de usuarios
> ⚠️ No hay página de gestión de usuarios en el frontend actual
> **Usar:** capturar `/profile` logueado como Jefa, mostrando las estadísticas del sistema y el badge de rol

`[ IMAGEN AQUÍ ]`

---

### Figura 54 · Creación de cuenta de usuario nuevo
> ⚠️ No hay formulario de crear usuario en el frontend actual
> **Usar:** capturar el modal de **Nueva Tarea** con todos los campos llenos (representa el formulario del sistema)

`[ IMAGEN AQUÍ ]`

---

### Figura 55 · Vista responsiva — móvil (dashboard)
> Chrome DevTools `F12` → ícono móvil → **iPhone SE (375 px)** → navegar a `/dashboard` → capturar

`[ IMAGEN AQUÍ ]`

---

### Figura 56 · Vista responsiva — tablet (tareas)
> DevTools → cambiar a **iPad (768 px)** → navegar a `/tasks` → capturar

`[ IMAGEN AQUÍ ]`

---

### Figura 57 · Vista en modo oscuro — dashboard
> Clic en el **ícono de luna** en la barra superior → modo oscuro activo → capturar `/dashboard`

`[ IMAGEN AQUÍ ]`

---

### Figura 58 · Vista en modo oscuro — tareas
> Con modo oscuro activo → ir a `/tasks` → capturar

`[ IMAGEN AQUÍ ]`

---

### Figura 59 · Drag & drop de tarea entre estados
> En `/tasks` vista Kanban · arrastrar una tarjeta de "Pendiente" a "Completada" · capturar durante el arrastre

`[ IMAGEN AQUÍ ]`

---

### Figura 60 · Notificación de nueva tarea asignada
> Crear una tarea asignada a un usuario · capturar el ícono de campana con badge rojo + el panel de notificaciones abierto

`[ IMAGEN AQUÍ ]`

---

### Figura 61 · Filtro de tareas por prioridad alta
> En `/tasks` · usar el filtro o buscador para mostrar solo tareas de prioridad **Alta** · capturar el resultado filtrado

`[ IMAGEN AQUÍ ]`

---

### Figura 62 · Búsqueda textual en tiempo real de tareas
> En `/tasks` · escribir un término en el buscador · capturar los resultados apareciendo en tiempo real

`[ IMAGEN AQUÍ ]`

---

### Figura 63 · (sin descripción en el informe)
> ⚠️ El Word no tiene descripción para esta figura
> **Usar:** capturar el panel de `/tasks` con tareas en distintos estados visibles simultáneamente

`[ IMAGEN AQUÍ ]`

---

### Figura 64 · Toast de confirmación de acción exitosa
> Completar o guardar cualquier acción (crear/editar/borrar tarea) · capturar el toast verde de confirmación

`[ IMAGEN AQUÍ ]`

---

### Figura 65 · Vista de tareas completadas — historial
> En `/tasks` · aplicar el filtro **"Completadas"** · capturar el listado de tareas completadas

`[ IMAGEN AQUÍ ]`

---

### Figura 66 · Interfaz completa del sistema — resolución 1920×1080
> Con el navegador en pantalla completa a resolución **1920×1080** · capturar `/dashboard` completo

`[ IMAGEN AQUÍ ]`
