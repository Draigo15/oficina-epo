# 🚀 Guía de Despliegue - Oficina EPO

## Servicios que vamos a usar (TODOS GRATIS):

1. **MongoDB Atlas** - Base de datos (Ya está configurada ✓)
2. **Render** - Backend Node.js
3. **Vercel** - Frontend React

---

## 📝 PASO 1: Preparar el Backend

### 1.1 Crear archivo .env en backend
Crea un archivo `.env` en la carpeta `backend/` con:

```env
MONGODB_URI=mongodb+srv://oficinaepo_db_user:7UYUbWAItafHSHoL@oficina-epo.n85u7ms.mongodb.net/oficina-epo
JWT_SECRET=EPO_Secret_Key_2025_Secure_Production
PORT=5000
NODE_ENV=production
```

### 1.2 Subir código a GitHub (si no lo has hecho)

```bash
# Inicializar git en la carpeta raíz
cd c:\Users\carus\OneDrive\Escritorio\PRACTICAS\TareasEpo
git init

# Crear .gitignore
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo dist/ >> .gitignore

# Hacer primer commit
git add .
git commit -m "Initial commit - Oficina EPO"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/oficina-epo.git
git branch -M main
git push -u origin main
```

---

## 🔧 PASO 2: Desplegar Backend en Render

### 2.1 Crear cuenta en Render
1. Ve a https://render.com
2. Regístrate con GitHub (gratis)

### 2.2 Crear Web Service
1. Click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: `oficina-epo-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

### 2.3 Configurar Variables de Entorno
En la sección **Environment**, agrega:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://oficinaepo_db_user:7UYUbWAItafHSHoL@oficina-epo.n85u7ms.mongodb.net/oficina-epo` |
| `JWT_SECRET` | `EPO_Secret_Key_2025_Secure_Production` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

### 2.4 Desplegar
1. Click en **"Create Web Service"**
2. Espera 3-5 minutos mientras despliega
3. Copia la URL que te dan (ejemplo: `https://oficina-epo-backend.onrender.com`)

---

## 🎨 PASO 3: Desplegar Frontend en Vercel

### 3.1 Actualizar URL del Backend
Edita el archivo `frontend/.env.production`:

```env
VITE_API_URL=https://oficina-epo-backend.onrender.com/api
```

(Reemplaza con tu URL de Render del paso anterior)

### 3.2 Hacer commit de los cambios

```bash
git add .
git commit -m "Update production API URL"
git push
```

### 3.3 Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Regístrate con GitHub (gratis)

### 3.4 Importar Proyecto
1. Click en **"Add New..."** → **"Project"**
2. Selecciona tu repositorio `oficina-epo`
3. Configura:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.5 Configurar Variables de Entorno
En **Environment Variables**, agrega:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://oficina-epo-backend.onrender.com/api` |

(Usa tu URL de Render)

### 3.6 Desplegar
1. Click en **"Deploy"**
2. Espera 2-3 minutos
3. ¡Tu aplicación estará en línea! 🎉

---

## ✅ PASO 4: Verificar que Todo Funciona

### 4.1 Probar Backend
Abre en tu navegador:
```
https://oficina-epo-backend.onrender.com/api/health
```
Deberías ver: `{"status": "ok"}`

### 4.2 Probar Frontend
1. Abre tu URL de Vercel (ejemplo: `https://oficina-epo.vercel.app`)
2. Inicia sesión con:
   - Usuario: `jefa` / Contraseña: `123456`
   - Usuario: `asistente` / Contraseña: `123456`

---

## 🔒 PASO 5: Configurar CORS (si hay problemas)

Si el frontend no puede conectarse al backend, actualiza en `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://oficina-epo.vercel.app',  // Tu URL de Vercel
    'https://*.vercel.app'
  ],
  credentials: true
}));
```

---

## 📱 URLs Finales

Una vez desplegado, tendrás:

- **Frontend**: `https://tu-proyecto.vercel.app`
- **Backend**: `https://tu-proyecto.onrender.com`
- **Base de Datos**: MongoDB Atlas (ya configurada)

---

## ⚠️ Notas Importantes

### Render Free Tier:
- El backend se "duerme" después de 15 minutos de inactividad
- Primera petición después de dormir tarda ~30 segundos
- 750 horas gratis al mes

### Vercel Free Tier:
- Frontend siempre activo
- 100 GB de ancho de banda gratis al mes
- Despliegues ilimitados

### MongoDB Atlas Free Tier:
- 512 MB de almacenamiento
- Suficiente para miles de tareas

---

## 🆘 Solución de Problemas

### Backend no inicia en Render:
- Verifica las variables de entorno
- Revisa los logs en Render Dashboard
- Asegúrate que `package.json` tenga `"type": "module"`

### Frontend no conecta al Backend:
- Verifica que `VITE_API_URL` esté correctamente configurada
- Revisa la consola del navegador para errores CORS
- Asegúrate que el backend esté corriendo

### Error de autenticación:
- Verifica que `JWT_SECRET` sea el mismo en backend
- Limpia el localStorage del navegador

---

## 🔄 Actualizaciones Futuras

Para actualizar tu aplicación:

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de los cambios"
git push

# Vercel y Render se actualizarán automáticamente
```

---

¡Tu sistema está listo para producción! 🎉
