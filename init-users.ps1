# Script de Inicialización - Sistema Oficina Epo
# Este script crea los usuarios iniciales en la base de datos

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SISTEMA OFICINA EPO - INICIALIZACIÓN  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que el backend esté corriendo
Write-Host "Verificando que el backend esté corriendo..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Backend está corriendo" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: El backend no está corriendo en http://localhost:5000" -ForegroundColor Red
    Write-Host "  Por favor, inicia el backend primero con:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Creando usuarios iniciales..." -ForegroundColor Yellow
Write-Host ""

# Crear usuario Jefa
Write-Host "1. Creando usuario 'Jefa'..." -ForegroundColor Cyan
$jefeBody = @{
    username = "jefa"
    password = "123456"
    fullName = "María González"
    role = "jefa"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method Post `
        -Body $jefeBody `
        -ContentType "application/json"
    
    Write-Host "   ✓ Usuario 'jefa' creado exitosamente" -ForegroundColor Green
    Write-Host "     Usuario: jefa" -ForegroundColor White
    Write-Host "     Contraseña: 123456" -ForegroundColor White
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "   ⚠ El usuario 'jefa' ya existe" -ForegroundColor Yellow
    } else {
        Write-Host "   ✗ Error al crear usuario 'jefa': $_" -ForegroundColor Red
    }
}

Write-Host ""

# Crear usuario Asistente
Write-Host "2. Creando usuario 'Asistente'..." -ForegroundColor Cyan
$asistenteBody = @{
    username = "asistente"
    password = "123456"
    fullName = "Juan Pérez"
    role = "asistente"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method Post `
        -Body $asistenteBody `
        -ContentType "application/json"
    
    Write-Host "   ✓ Usuario 'asistente' creado exitosamente" -ForegroundColor Green
    Write-Host "     Usuario: asistente" -ForegroundColor White
    Write-Host "     Contraseña: 123456" -ForegroundColor White
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "   ⚠ El usuario 'asistente' ya existe" -ForegroundColor Yellow
    } else {
        Write-Host "   ✗ Error al crear usuario 'asistente': $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ INICIALIZACIÓN COMPLETADA           " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Puedes iniciar sesión con:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  JEFA:" -ForegroundColor Cyan
Write-Host "    Usuario: jefa" -ForegroundColor White
Write-Host "    Contraseña: 123456" -ForegroundColor White
Write-Host ""
Write-Host "  ASISTENTE:" -ForegroundColor Cyan
Write-Host "    Usuario: asistente" -ForegroundColor White
Write-Host "    Contraseña: 123456" -ForegroundColor White
Write-Host ""
Write-Host "Abre el navegador en: http://localhost:3000" -ForegroundColor Green
Write-Host ""
