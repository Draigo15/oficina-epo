# Diagramas PlantUML – Sistema de Gestión de Tareas EPO

> Copia cada bloque en [https://www.plantuml.com/plantuml/uml/](https://www.plantuml.com/plantuml/uml/) o en la extensión PlantUML de VS Code.

---

## Figura 3 – Diagrama de Casos de Uso General

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle

actor "Jefa de Oficina" as Jefa
actor "Asistente" as Asist

rectangle "Sistema de Gestión de Tareas – EPO" {
  usecase "CS-01\nAutenticar\nUsuario"         as CS01
  usecase "CS-02\nCrear Tarea"                 as CS02
  usecase "CS-03\nCompletar Tarea"             as CS03
  usecase "CS-04\nEliminar Tarea"              as CS04
  usecase "CS-05\nEditar Tarea"                as CS05
  usecase "CS-06\nReabrir Tarea"               as CS06
  usecase "CS-07\nAgregar Comentario"          as CS07
  usecase "CS-08\nVer Dashboard\ny Estadísticas" as CS08
  usecase "CS-09\nGenerar Reporte\nMensual PDF" as CS09
  usecase "CS-10\nGestionar\nNotificaciones"   as CS10
}

Jefa  --> CS01
Jefa  --> CS02
Jefa  --> CS03
Jefa  --> CS04
Jefa  --> CS05
Jefa  --> CS06
Jefa  --> CS07
Jefa  --> CS08
Jefa  --> CS09
Jefa  --> CS10

Asist --> CS01
Asist --> CS03
Asist --> CS06
Asist --> CS07
Asist --> CS08
Asist --> CS09
Asist --> CS10
@enduml
```

---

## Figura 4 – CS-01: Autenticar Usuario

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa / Asistente" as Usuario

rectangle "CS-01 – Autenticar Usuario" {
  usecase "Ingresar credenciales\n(username + password)" as UC1
  usecase "Validar token JWT"                            as UC2
  usecase "Redirigir al Dashboard"                       as UC3
  usecase "Mostrar error\nde autenticación"              as UC4
}

Usuario --> UC1
UC1 --> UC2
UC2 --> UC3 : credenciales válidas
UC2 --> UC4 : credenciales incorrectas
@enduml
```

---

## Figura 5 – CS-02: Crear Tarea

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa de Oficina" as Jefa

rectangle "CS-02 – Crear Tarea" {
  usecase "Completar formulario\n(título, descripción,\nprioridad, fecha límite)" as UC1
  usecase "Validar campos\nobligatorios"                as UC2
  usecase "Persistir en MongoDB\n(colección tasks)"     as UC3
  usecase "Mostrar tarea en\nlistado actualizado"       as UC4
}

Jefa --> UC1
UC1 --> UC2
UC2 --> UC3 : datos válidos
UC3 --> UC4
@enduml
```

---

## Figura 6 – CS-03: Completar Tarea

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa / Asistente" as Usuario

rectangle "CS-03 – Completar Tarea" {
  usecase "Seleccionar tarea\npendiente"               as UC1
  usecase "Confirmar completado"                       as UC2
  usecase "Registrar completedBy\ny completedAt"       as UC3
  usecase "Generar notificación\nal equipo"            as UC4
  usecase "Actualizar estado\nen listado"              as UC5
}

Usuario --> UC1
UC1 --> UC2
UC2 --> UC3
UC3 --> UC4
UC3 --> UC5
@enduml
```

---

## Figura 7 – CS-04: Eliminar Tarea

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa de Oficina" as Jefa

rectangle "CS-04 – Eliminar Tarea" {
  usecase "Seleccionar tarea"           as UC1
  usecase "Confirmar eliminación\n(modal)"     as UC2
  usecase "Verificar rol isJefa\n(middleware)" as UC3
  usecase "Eliminar de MongoDB"         as UC4
  usecase "Actualizar listado"          as UC5
}

Jefa --> UC1
UC1 --> UC2
UC2 --> UC3
UC3 --> UC4 : rol autorizado
UC4 --> UC5
@enduml
```

---

## Figura 8 – CS-05: Editar Tarea

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa de Oficina" as Jefa

rectangle "CS-05 – Editar Tarea" {
  usecase "Abrir formulario\nde edición"              as UC1
  usecase "Modificar campos\n(título, prioridad, etc.)" as UC2
  usecase "Verificar rol isJefa"                      as UC3
  usecase "Actualizar en MongoDB\n(PUT /api/tasks/:id)" as UC4
  usecase "Refrescar listado"                         as UC5
}

Jefa --> UC1
UC1 --> UC2
UC2 --> UC3
UC3 --> UC4 : autorizado
UC4 --> UC5
@enduml
```

---

## Figura 9 – CS-06: Reabrir Tarea

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa / Asistente" as Usuario

rectangle "CS-06 – Reabrir Tarea" {
  usecase "Seleccionar tarea\ncompletada"              as UC1
  usecase "Hacer clic en\n'Reabrir'"                   as UC2
  usecase "Limpiar completedBy\ny completedAt"         as UC3
  usecase "Estado vuelve a\n'pendiente'"               as UC4
  usecase "Actualizar listado"                         as UC5
}

Usuario --> UC1
UC1 --> UC2
UC2 --> UC3
UC3 --> UC4
UC4 --> UC5
@enduml
```

---

## Figura 10 – CS-07: Agregar Comentario a Tarea

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa / Asistente" as Usuario

rectangle "CS-07 – Agregar Comentario a Tarea" {
  usecase "Abrir modal\nde tarea"                       as UC1
  usecase "Escribir comentario"                         as UC2
  usecase "Enviar\n(POST /api/tasks/:id/comments)"      as UC3
  usecase "Guardar en array\ncomments[] con author"     as UC4
  usecase "Mostrar comentario\nen modal"                as UC5
}

Usuario --> UC1
UC1 --> UC2
UC2 --> UC3
UC3 --> UC4
UC4 --> UC5
@enduml
```

---

## Figura 11 – CS-08: Ver Dashboard y Estadísticas

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa / Asistente" as Usuario

rectangle "CS-08 – Ver Dashboard y Estadísticas" {
  usecase "Acceder a /dashboard"                       as UC1
  usecase "Solicitar estadísticas\n(GET /api/reports/stats)" as UC2
  usecase "MongoDB ejecuta\n5 conteos agregados"       as UC3
  usecase "Renderizar KPIs\ncon Recharts"              as UC4
  usecase "Ver tareas por\nprioridad y estado"         as UC5
}

Usuario --> UC1
UC1 --> UC2
UC2 --> UC3
UC3 --> UC4
UC4 --> UC5
@enduml
```

---

## Figura 12 – CS-09: Generar Reporte Mensual en PDF

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa / Asistente" as Usuario

rectangle "CS-09 – Generar Reporte Mensual en PDF" {
  usecase "Seleccionar mes\ny año"                      as UC1
  usecase "Solicitar datos\n(GET /api/reports/monthly)" as UC2
  usecase "MongoDB filtra\npor completedAt en rango"    as UC3
  usecase "jsPDF genera PDF\nen cliente"                as UC4
  usecase "Descargar archivo PDF"                       as UC5
}

Usuario --> UC1
UC1 --> UC2
UC2 --> UC3
UC3 --> UC4
UC4 --> UC5
@enduml
```

---

## Figura 13 – CS-10: Gestionar Notificaciones

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome

actor "Jefa / Asistente" as Usuario
actor "Sistema" as Sys

rectangle "CS-10 – Gestionar Notificaciones" {
  usecase "Detectar tarea\ncon fecha próxima"           as UC1
  usecase "Crear notificación\n(tipo task_due)"          as UC2
  usecase "Abrir centro de\nnotificaciones"              as UC3
  usecase "Listar notificaciones\n(GET /api/notifications)" as UC4
  usecase "Marcar como leída\n(PATCH /:id/read)"         as UC5
}

Sys    --> UC1
UC1    --> UC2
Usuario --> UC3
UC3    --> UC4
UC4    --> UC5
@enduml
```

---

## DS CS-01 – Diagrama de Secuencia: Autenticar Usuario

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Usuario" as U
participant "React\n(Login.jsx)" as R
participant "Express\n/api/auth/login" as E
participant "protect\n(middleware)" as M
database "MongoDB\n(users)" as DB

U  -> R  : Ingresa username + password
R  -> E  : POST /api/auth/login
E  -> DB : findOne({ username })
DB --> E : user document
E  -> E  : bcryptjs.compare(password, hash)
alt Credenciales válidas
    E  --> R  : { token, user } 200 OK
    R  -> R  : localStorage.setItem('token')
    R  --> U  : Redirige a /dashboard
else Credenciales inválidas
    E  --> R  : { message: 'Credenciales incorrectas' } 401
    R  --> U  : Muestra error en formulario
end
@enduml
```

---

## DS CS-02 – Diagrama de Secuencia: Crear Tarea

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Jefa" as J
participant "React\n(Tasks.jsx)" as R
participant "Express\n/api/tasks" as E
participant "protect\n(middleware)" as M
database "MongoDB\n(tasks)" as DB

J  -> R  : Abre formulario "Nueva Tarea"
J  -> R  : Completa título, descripción,\nprioridad, fecha límite
R  -> E  : POST /api/tasks\n{ Authorization: Bearer token }
E  -> M  : Verificar JWT
M --> E  : req.user = { id, role }
E  -> DB : Task.create({ title, description,\npriority, dueDate, createdBy })
DB --> E : task guardada (201)
E  --> R  : task object 201
R  --> J  : Muestra tarea en listado actualizado
@enduml
```

---

## DS CS-03 – Diagrama de Secuencia: Completar Tarea

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Usuario" as U
participant "React\n(Tasks.jsx)" as R
participant "Express\n/api/tasks/:id/complete" as E
participant "protect\n(middleware)" as M
database "MongoDB\n(tasks + notifications)" as DB

U  -> R  : Clic en "Completar"
R  -> E  : PATCH /api/tasks/:id/complete\n{ Authorization: Bearer token }
E  -> M  : Verificar JWT
M --> E  : req.user
E  -> DB : Task.findByIdAndUpdate\n{ status:'completado', completedBy, completedAt }
DB --> E : tarea actualizada
E  -> DB : Notification.create({ type:'task_completed',\nrecipient: jefa, task })
DB --> E : notificación creada
E  --> R  : tarea actualizada 200
R  --> U  : Estado cambia a "completado" en listado
@enduml
```

---

## DS CS-04 – Diagrama de Secuencia: Eliminar Tarea

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Jefa" as J
participant "React\n(Tasks.jsx)" as R
participant "Express\n/api/tasks/:id" as E
participant "protect + isJefa\n(middleware)" as M
database "MongoDB\n(tasks)" as DB

J  -> R  : Clic en "Eliminar"
R  -> J  : Modal de confirmación
J  -> R  : Confirma eliminación
R  -> E  : DELETE /api/tasks/:id\n{ Authorization: Bearer token }
E  -> M  : Verificar JWT
M  -> M  : Verificar role === 'jefa'
alt Rol autorizado
    M --> E  : req.user
    E  -> DB : Task.findByIdAndDelete(id)
    DB --> E : OK
    E  --> R  : { message: 'Tarea eliminada' } 200
    R  --> J  : Tarea desaparece del listado
else Rol no autorizado
    M --> E  : 403 Forbidden
    E  --> R  : { message: 'No autorizado' }
    R  --> J  : Mensaje de error
end
@enduml
```

---

## DS CS-05 – Diagrama de Secuencia: Editar Tarea

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Jefa" as J
participant "React\n(Tasks.jsx)" as R
participant "Express\n/api/tasks/:id" as E
participant "protect + isJefa\n(middleware)" as M
database "MongoDB\n(tasks)" as DB

J  -> R  : Clic en "Editar"
R  -> J  : Abre formulario con datos actuales
J  -> R  : Modifica campos y guarda
R  -> E  : PUT /api/tasks/:id\n{ title, description, priority, dueDate }
E  -> M  : Verificar JWT + role jefa
M --> E  : autorizado
E  -> DB : Task.findByIdAndUpdate(id, datos, { new:true })
DB --> E : tarea actualizada
E  --> R  : tarea 200
R  --> J  : Listado actualizado
@enduml
```

---

## DS CS-06 – Diagrama de Secuencia: Reabrir Tarea

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Usuario" as U
participant "React\n(Tasks.jsx)" as R
participant "Express\n/api/tasks/:id/reopen" as E
participant "protect\n(middleware)" as M
database "MongoDB\n(tasks)" as DB

U  -> R  : Clic en "Reabrir"
R  -> E  : PATCH /api/tasks/:id/reopen\n{ Authorization: Bearer token }
E  -> M  : Verificar JWT
M --> E  : req.user
E  -> DB : Task.findByIdAndUpdate\n{ status:'pendiente',\n  $unset: { completedBy, completedAt } }
DB --> E : tarea actualizada
E  --> R  : tarea 200
R  --> U  : Estado vuelve a "pendiente"
@enduml
```

---

## DS CS-07 – Diagrama de Secuencia: Agregar Comentario

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Usuario" as U
participant "React\n(TaskModal.jsx)" as R
participant "Express\n/api/tasks/:id/comments" as E
participant "protect\n(middleware)" as M
database "MongoDB\n(tasks)" as DB

U  -> R  : Abre modal de tarea
U  -> R  : Escribe comentario y envía
R  -> E  : POST /api/tasks/:id/comments\n{ text: '...' }
E  -> M  : Verificar JWT
M --> E  : req.user
E  -> DB : Task.findByIdAndUpdate\n{ $push: { comments: { text, author, createdAt } } }
DB --> E : tarea con comentario añadido
E  --> R  : comentario 201
R  --> U  : Comentario aparece en lista del modal
@enduml
```

---

## DS CS-08 – Diagrama de Secuencia: Ver Dashboard

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Usuario" as U
participant "React\n(Dashboard.jsx)" as R
participant "Express\n/api/reports/stats" as E
participant "protect\n(middleware)" as M
database "MongoDB\n(tasks)" as DB

U  -> R  : Navega a /dashboard
R  -> E  : GET /api/reports/stats
E  -> M  : Verificar JWT
M --> E  : req.user
E  -> DB : aggregate: count total, pendientes,\nen_proceso, completadas, vencidas
DB --> E : { total, pendientes, en_proceso,\n            completadas, vencidas }
E  --> R  : stats JSON 200
R  -> R  : Recharts renderiza\nBarChart + PieChart
R  --> U  : Dashboard con KPIs y gráficos
@enduml
```

---

## DS CS-09 – Diagrama de Secuencia: Generar Reporte PDF

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Usuario" as U
participant "React\n(Reports.jsx)" as R
participant "Express\n/api/reports/monthly" as E
participant "protect\n(middleware)" as M
database "MongoDB\n(tasks)" as DB

U  -> R  : Selecciona mes y año
U  -> R  : Clic en "Generar PDF"
R  -> E  : GET /api/reports/monthly?month=3&year=2026
E  -> M  : Verificar JWT
M --> E  : req.user
E  -> DB : find({ completedAt: { $gte: inicio, $lte: fin } })
DB --> E : array de tareas completadas en el período
E  --> R  : tareas JSON 200
R  -> R  : jsPDF + jsPDF-autotable\nconstruye tabla en cliente
R  -> R  : doc.save('reporte_marzo_2026.pdf')
R  --> U  : Archivo PDF descargado
@enduml
```

---

## DS CS-10 – Diagrama de Secuencia: Gestionar Notificaciones

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam roundcorner 10

actor "Usuario" as U
participant "React\n(NotificationsCenter.jsx)" as R
participant "Express\n/api/notifications" as E
participant "protect\n(middleware)" as M
database "MongoDB\n(notifications)" as DB

note over DB : Cron/check ejecutado\npreviamente crea\nnotification task_due

U  -> R  : Abre centro de notificaciones
R  -> E  : GET /api/notifications
E  -> M  : Verificar JWT
M --> E  : req.user
E  -> DB : find({ recipient: req.user.id })\n.populate('task')
DB --> E : array de notificaciones
E  --> R  : notificaciones JSON 200
R  --> U  : Lista de notificaciones con badge
U  -> R  : Clic en notificación
R  -> E  : PATCH /api/notifications/:id/read
E  -> DB : findByIdAndUpdate({ isRead: true })
DB --> E : OK
E  --> R  : 200
R  --> U  : Badge decrementado, ítem marcado
@enduml
```

---

## Figura 24 – Diagrama de Base de Datos

```plantuml
@startuml
skinparam componentStyle rectangle
skinparam roundcorner 8

entity "users" as U {
  * _id : ObjectId <<PK>>
  --
  * username   : String (único)
  * password   : String (bcryptjs hash)
  * role       : String (jefa | asistente)
  * fullName   : String
    createdAt  : Date
    updatedAt  : Date
}

entity "tasks" as T {
  * _id         : ObjectId <<PK>>
  --
  * title       : String
    description : String
  * priority    : String (alta | media | baja)
  * status      : String (pendiente | en_proceso | completado)
    dueDate     : Date
    createdBy   : ObjectId <<FK users>>
    completedBy : ObjectId <<FK users>>
    completedAt : Date
    comments    : Array<Comment>
    createdAt   : Date
    updatedAt   : Date
}

entity "Comment" as C {
  * text      : String
  * author    : ObjectId <<FK users>>
  * createdAt : Date
}

entity "notifications" as N {
  * _id       : ObjectId <<PK>>
  --
  * recipient : ObjectId <<FK users>>
  * sender    : ObjectId <<FK users>>
  * type      : String (task_due | task_completed | task_assigned)
  * message   : String
    task      : ObjectId <<FK tasks>>
  * isRead    : Boolean (default: false)
    createdAt : Date
}

U ||--o{ T : "crea (createdBy)"
U ||--o{ T : "completa (completedBy)"
T ||--o{ C : "tiene comentarios"
U ||--o{ N : "recibe (recipient)"
U ||--o{ N : "envía (sender)"
T ||--o{ N : "referenciada en"
@enduml
```

---

## Figura 25 – Diagrama de Componentes

```plantuml
@startuml
skinparam componentStyle rectangle
skinparam roundcorner 10

package "Frontend – React 18 + Vite" {
  [AuthContext]       as AC
  [ToastContext]      as TC
  [Login.jsx]         as LOGIN
  [Dashboard.jsx]     as DASH
  [Tasks.jsx]         as TASKS
  [TaskModal.jsx]     as MODAL
  [Reports.jsx]       as REP
  [Stats.jsx]         as STATS
  [NotificationsCenter.jsx] as NOTIF
  [Profile.jsx]       as PROF
  [PrivateRoute]      as PR

  LOGIN   --> AC    : setUser / token
  PR      --> AC    : verifica auth
  DASH    --> AC
  TASKS   --> MODAL : abre
  STATS   --> TC    : toast feedback
}

package "API Client" {
  [Axios Instance\n(baseURL + JWT header)] as AX
}

package "Backend – Node.js / Express" {
  [authRoutes\n/api/auth]         as AR
  [taskRoutes\n/api/tasks]        as TR
  [reportRoutes\n/api/reports]    as RR
  [notifRoutes\n/api/notifications] as NR

  [protect\n(verifyToken)]        as MW1
  [isJefa\n(roleCheck)]           as MW2

  [authController]    as AC2
  [taskController]    as TC2
  [reportController]  as RC2
  [notifController]   as NC2
}

package "Modelos Mongoose" {
  [User.js]           as MU
  [Task.js]           as MT
  [Notification.js]   as MN
}

database "MongoDB Atlas\n(Plan M0)" as MONGO {
  [users]
  [tasks]
  [notifications]
}

' Conexiones frontend → API
DASH    --> AX : GET /api/reports/stats
TASKS   --> AX : GET/POST/PUT/DELETE /api/tasks
REP     --> AX : GET /api/reports/monthly
NOTIF   --> AX : GET/PATCH /api/notifications
LOGIN   --> AX : POST /api/auth/login

' API → Routes
AX --> AR
AX --> TR
AX --> RR
AX --> NR

' Middleware
AR --> MW1
TR --> MW1
TR --> MW2
RR --> MW1
NR --> MW1

' Routes → Controllers
AR --> AC2
TR --> TC2
RR --> RC2
NR --> NC2

' Controllers → Models
AC2 --> MU
TC2 --> MT
TC2 --> MN
RC2 --> MT
NC2 --> MN

' Models → DB
MU --> MONGO
MT --> MONGO
MN --> MONGO
@enduml
```

---

## Figura 26 – Diagrama de Despliegue

```plantuml
@startuml
skinparam nodeStyle rectangle
skinparam roundcorner 10

node "Vercel\n(CDN Global)" as VERCEL {
  artifact "Frontend\nReact 18 + Vite\n(build estático)" as FE
}

node "Render\n(Free Tier – Oregon)" as RENDER {
  artifact "Backend\nNode.js 18 / Express\n(puerto 10000)" as BE
}

node "MongoDB Atlas\n(Cluster M0 – us-east)" as ATLAS {
  database "Cluster0\n3 colecciones\n(users, tasks, notifications)" as DB
}

node "Navegador\n(Chrome / Edge / Firefox)" as BROWSER {
  component "App React\n(SPA)" as SPA
}

BROWSER --> VERCEL   : HTTPS (petición inicial)
VERCEL  --> BROWSER  : index.html + chunks JS
BROWSER --> RENDER   : HTTPS + JWT\n(llamadas API REST)
RENDER  --> ATLAS    : TLS / mongoose\n(MONGODB_URI)
@enduml
```

---

## Figura 27 – Diagrama de Clases

```plantuml
@startuml
skinparam classAttributeIconSize 0
skinparam roundcorner 10

class User {
  - _id       : ObjectId
  - username  : String
  - password  : String
  - role      : String
  - fullName  : String
  --
  + comparePassword(plain) : Boolean
}

class Task {
  - _id         : ObjectId
  - title       : String
  - description : String
  - priority    : String
  - status      : String
  - dueDate     : Date
  - createdBy   : ObjectId
  - completedBy : ObjectId
  - completedAt : Date
  - comments    : Comment[]
  --
  + markComplete(userId) : void
  + reopen() : void
  + addComment(text, userId) : void
}

class Comment {
  - text      : String
  - author    : ObjectId
  - createdAt : Date
}

class Notification {
  - _id       : ObjectId
  - recipient : ObjectId
  - sender    : ObjectId
  - type      : String
  - message   : String
  - task      : ObjectId
  - isRead    : Boolean
  --
  + markRead() : void
}

class AuthController {
  + login(req, res) : void
  + getMe(req, res) : void
}

class TaskController {
  + getTasks(req, res) : void
  + createTask(req, res) : void
  + updateTask(req, res) : void
  + deleteTask(req, res) : void
  + completeTask(req, res) : void
  + reopenTask(req, res) : void
  + addComment(req, res) : void
}

class ReportController {
  + getStats(req, res) : void
  + getMonthlyReport(req, res) : void
}

class NotificationController {
  + getNotifications(req, res) : void
  + markAsRead(req, res) : void
}

class protect <<middleware>> {
  + verifyToken(req, res, next) : void
}

class isJefa <<middleware>> {
  + checkRole(req, res, next) : void
}

AuthController     --> User             : findOne / comparePassword
TaskController     --> Task             : CRUD
TaskController     --> Notification     : create
ReportController   --> Task             : aggregate / find
NotificationController --> Notification : find / update
protect            --> User             : jwt.verify → findById
isJefa             --> User             : req.user.role
Task               *-- Comment          : embeds
@enduml
```

---

> **Nota.** Todos los diagramas son de elaboración propia basados en el código fuente del repositorio del Sistema de Gestión de Tareas – Oficina EPO (UPT), desarrollado con stack MERN (MongoDB Atlas · Express · React 18 · Node.js).
