# GUÍA DE INSTALACIÓN Y USO - Sistema Oficina Epo

## 🎯 PASOS RÁPIDOS PARA EMPEZAR

### 1️⃣ Instalar Dependencias del Backend

```powershell
cd backend
npm install
```

### 2️⃣ Configurar MongoDB Atlas (Base de Datos en la Nube - GRATIS)

1. Ve a: https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita
3. Crea un cluster gratuito (M0)
4. Click en "Connect" → "Connect your application"
5. Copia el string de conexión (se verá así):
   ```
   mongodb+srv://usuario:<password>@cluster.mongodb.net/
   ```
6. Reemplaza `<password>` con tu contraseña real

### 3️⃣ Configurar Variables de Entorno del Backend

En la carpeta `backend`, crea un archivo `.env` (copia el `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:tupassword@cluster.mongodb.net/oficina-epo?retryWrites=true&w=majority
JWT_SECRET=mi_clave_super_secreta_123456
NODE_ENV=development
```

**IMPORTANTE:** Reemplaza `MONGODB_URI` con tu conexión real de MongoDB Atlas.

### 4️⃣ Iniciar el Backend

```powershell
cd backend
npm run dev
```

Deberías ver: `🚀 Servidor corriendo en puerto 5000` y `✅ MongoDB conectado`

### 5️⃣ Instalar Dependencias del Frontend

Abre una NUEVA terminal (deja el backend corriendo):

```powershell
cd frontend
npm install
```

### 6️⃣ Configurar Variables de Entorno del Frontend

En la carpeta `frontend`, crea un archivo `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7️⃣ Iniciar el Frontend

```powershell
cd frontend
npm run dev
```

Verás algo como: `Local: http://localhost:3000`

### 8️⃣ Crear Usuarios Iniciales

Puedes usar **Thunder Client** (extensión de VS Code) o **Postman**:

**Crear usuario Jefa:**
- Método: POST
- URL: `http://localhost:5000/api/auth/register`
- Body (JSON):
```json
{
  "username": "jefa",
  "password": "123456",
  "fullName": "María González",
  "role": "jefa"
}
```

**Crear usuario Asistente:**
- Método: POST
- URL: `http://localhost:5000/api/auth/register`
- Body (JSON):
```json
{
  "username": "asistente",
  "password": "123456",
  "fullName": "Juan Pérez",
  "role": "asistente"
}
```

### 9️⃣ ¡LISTO! Ahora Usa el Sistema

Abre tu navegador en: **http://localhost:3000**

**Iniciar sesión como Jefa:**
- Usuario: `jefa`
- Contraseña: `123456`

**Iniciar sesión como Asistente:**
- Usuario: `asistente`
- Contraseña: `123456`

---

## 📖 FLUJO DE USO COMPLETO

### Como JEFA:
1. Login con credenciales de Jefa
2. Ve a "Tareas" → Click "Nueva Tarea"
3. Llena el formulario:
   - Título: "Revisar documentos"
   - Descripción: "Revisar contratos del cliente X"
   - Prioridad: "Alta"
4. Click "Crear Tarea"
5. La tarea aparece en la lista como "Pendiente"

### Como ASISTENTE:
1. Login con credenciales de Asistente
2. Ve a "Tareas"
3. Ve las tareas pendientes
4. Click en el botón verde ✓ para marcar como completada
   - **¡El sistema guarda automáticamente la fecha y hora!**
5. La tarea pasa a "Completadas"

### Generar Reporte PDF:
1. Ve a "Reportes"
2. Selecciona el mes y año
3. Click "Ver Reporte"
4. Verás la tabla con todas las tareas completadas ese mes
5. Click "Descargar PDF"
6. **¡Se descarga automáticamente con el formato correcto!**

---

## 🌐 DESPLIEGUE EN INTERNET (OPCIONAL)

### Opción 1: Render (Backend) + Vercel (Frontend)

**RENDER (Backend):**
1. Ve a https://render.com y crea cuenta
2. Click "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configuración:
   - Name: `oficina-epo-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Variables de Entorno:
   - `MONGODB_URI`: Tu string de MongoDB Atlas
   - `JWT_SECRET`: Una clave secreta
   - `NODE_ENV`: `production`
6. Click "Create Web Service"
7. **Copia la URL que te da** (ej: `https://oficina-epo-backend.onrender.com`)

**VERCEL (Frontend):**
1. Ve a https://vercel.com y crea cuenta
2. Click "Add New" → "Project"
3. Importa tu repositorio
4. Configuración:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Variables de Entorno:
   - `VITE_API_URL`: `https://oficina-epo-backend.onrender.com/api` (URL de Render)
6. Click "Deploy"

**¡LISTO!** Ahora puedes acceder desde cualquier lugar con la URL de Vercel.

---

## 🔧 COMANDOS ÚTILES

### Backend:
```powershell
cd backend
npm install          # Instalar dependencias
npm run dev          # Modo desarrollo (con nodemon)
npm start            # Modo producción
```

### Frontend:
```powershell
cd frontend
npm install          # Instalar dependencias
npm run dev          # Modo desarrollo
npm run build        # Compilar para producción
npm run preview      # Vista previa de build
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ Error: "Cannot connect to MongoDB"
- Verifica que tu IP esté en la whitelist de MongoDB Atlas
- En MongoDB Atlas → Network Access → Add IP Address → "Allow access from anywhere" (0.0.0.0/0)
- Revisa que el string de conexión sea correcto en `.env`

### ❌ Error: "Port 5000 already in use"
- Cambia el puerto en `backend/.env`: `PORT=5001`
- O cierra la aplicación que usa el puerto 5000

### ❌ Error: "CORS policy"
- Verifica que el backend esté corriendo
- Asegúrate de que `VITE_API_URL` en frontend apunte a la URL correcta

### ❌ No se genera el PDF
- Verifica que haya tareas completadas en el mes seleccionado
- Abre la consola del navegador (F12) y busca errores

### ❌ "Cannot find module"
- Elimina carpetas `node_modules` y vuelve a ejecutar `npm install`

---

## 📞 NECESITAS MÁS AYUDA

Si tienes problemas:
1. Abre la consola del navegador (F12) y revisa errores
2. Revisa la terminal del backend por errores
3. Verifica que ambos servidores (backend y frontend) estén corriendo
4. Asegúrate de que MongoDB esté conectado correctamente

---

**¡Disfruta tu nuevo sistema automatizado! 🎉**
