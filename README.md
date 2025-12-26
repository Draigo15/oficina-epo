# Sistema de Gestión de Tareas - Oficina Epo

Sistema completo MERN para automatizar la gestión de tareas y generación de reportes mensuales en PDF.

## 🚀 Características

- ✅ Autenticación con roles (Jefa y Asistente)
- 📝 Gestión completa de tareas (CRUD)
- ⏰ Registro automático de fecha/hora de completado
- 📊 Dashboard con estadísticas en tiempo real
- 📄 Generación automática de reportes PDF mensuales
- 🎨 Interfaz moderna con TailwindCSS
- 🔒 Seguridad con JWT

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- MongoDB (cuenta en MongoDB Atlas)
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd TareasEpo
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` basado en `.env.example`:
```env
PORT=5000
MONGODB_URI=tu_conexion_mongodb_atlas
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=development
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env` basado en `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚦 Ejecución en Desarrollo

### Backend
```bash
cd backend
npm run dev
```
El servidor estará en: http://localhost:5000

### Frontend
```bash
cd frontend
npm run dev
```
La aplicación estará en: http://localhost:3000

## 👥 Crear Usuarios Iniciales

Una vez que el backend esté corriendo, puedes crear usuarios usando una herramienta como Postman o Thunder Client:

**POST** `http://localhost:5000/api/auth/register`

**Body (JSON):**
```json
{
  "username": "jefa",
  "password": "password123",
  "fullName": "María González",
  "role": "jefa"
}
```

```json
{
  "username": "asistente",
  "password": "password123",
  "fullName": "Juan Pérez",
  "role": "asistente"
}
```

## 📱 Uso del Sistema

### Como Jefa:
1. Iniciar sesión con credenciales de Jefa
2. Crear nuevas tareas desde el botón "Nueva Tarea"
3. Asignar prioridad (Normal o Alta)
4. Ver todas las tareas pendientes y completadas
5. Eliminar tareas si es necesario

### Como Asistente:
1. Iniciar sesión con credenciales de Asistente
2. Ver tareas pendientes
3. Marcar tareas como completadas (registra automáticamente fecha/hora)
4. Deshacer tareas si fue por error
5. Generar reportes mensuales en PDF

### Reportes:
1. Ir a la sección "Reportes"
2. Seleccionar mes y año
3. Click en "Ver Reporte"
4. Click en "Descargar PDF" para obtener el documento

## 🌐 Despliegue en Producción

### Backend (Render)

1. Crear cuenta en [Render](https://render.com)
2. Crear nuevo Web Service
3. Conectar repositorio
4. Configurar:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Agregar variables de entorno:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Frontend (Vercel)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar proyecto
3. Configurar:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Agregar variable de entorno:
   - `VITE_API_URL=https://tu-backend.onrender.com/api`

### MongoDB Atlas

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito
3. Crear base de datos
4. Obtener string de conexión
5. Configurar acceso desde cualquier IP (0.0.0.0/0) para producción

## 📊 Estructura del Proyecto

```
TareasEpo/
├── backend/
│   ├── config/          # Configuración de DB
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de API
│   ├── middleware/      # Middleware de autenticación
│   └── server.js        # Punto de entrada
│
└── frontend/
    ├── src/
    │   ├── components/  # Componentes reutilizables
    │   ├── context/     # Context API (Auth)
    │   ├── pages/       # Páginas principales
    │   ├── utils/       # Utilidades (API)
    │   └── App.jsx      # Componente principal
    └── index.html
```

## 🔧 Tecnologías Utilizadas

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para encriptación

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router v6
- Axios
- jsPDF + jspdf-autotable
- Lucide React (iconos)
- date-fns

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Tareas
- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/:id` - Obtener tarea por ID
- `POST /api/tasks` - Crear tarea (Solo Jefa)
- `PUT /api/tasks/:id` - Actualizar tarea (Solo Jefa)
- `PATCH /api/tasks/:id/complete` - Completar tarea
- `PATCH /api/tasks/:id/reopen` - Reabrir tarea
- `DELETE /api/tasks/:id` - Eliminar tarea (Solo Jefa)

### Reportes
- `GET /api/reports/monthly?month=1&year=2024` - Obtener reporte mensual
- `GET /api/reports/stats` - Obtener estadísticas generales

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verificar que la IP esté en la whitelist de MongoDB Atlas
- Revisar que el string de conexión sea correcto
- Verificar que el usuario/contraseña sean correctos

### Error de CORS
- Verificar que el backend tenga configurado CORS correctamente
- Asegurarse de que las URLs coincidan

### El PDF no se genera
- Verificar que haya tareas completadas en el mes seleccionado
- Revisar la consola del navegador por errores

## 📄 Licencia

MIT

## 👨‍💻 Autor

Sistema desarrollado para automatizar la gestión de tareas de Oficina Epo

---

**¡Listo para usar! 🎉**
