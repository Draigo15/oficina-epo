# Script de Inicio Completo - Sistema Oficina Epo
# Este script inicia ambos servidores (backend y frontend)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SISTEMA OFICINA EPO - INICIO          " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si npm está instalado
function Test-NpmInstalled {
    try {
        $null = Get-Command npm -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Verificar Node.js y npm
Write-Host "Verificando requisitos..." -ForegroundColor Yellow
if (-not (Test-NpmInstalled)) {
    Write-Host "✗ Error: Node.js/npm no está instalado" -ForegroundColor Red
    Write-Host "  Descarga Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Node.js/npm instalado" -ForegroundColor Green

# Verificar que las carpetas existan
if (-not (Test-Path "backend")) {
    Write-Host "✗ Error: No se encuentra la carpeta 'backend'" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "frontend")) {
    Write-Host "✗ Error: No se encuentra la carpeta 'frontend'" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Estructura de carpetas correcta" -ForegroundColor Green
Write-Host ""

# Verificar e instalar dependencias del backend
Write-Host "Verificando dependencias del backend..." -ForegroundColor Yellow
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Instalando dependencias del backend..." -ForegroundColor Cyan
    Push-Location backend
    npm install
    Pop-Location
}
Write-Host "✓ Dependencias del backend listas" -ForegroundColor Green

# Verificar e instalar dependencias del frontend
Write-Host "Verificando dependencias del frontend..." -ForegroundColor Yellow
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Instalando dependencias del frontend..." -ForegroundColor Cyan
    Push-Location frontend
    npm install
    Pop-Location
}
Write-Host "✓ Dependencias del frontend listas" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO SERVIDORES...               " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Backend se iniciará en: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend se iniciará en: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "NOTA: Se abrirán dos ventanas de terminal nuevas" -ForegroundColor Yellow
Write-Host "      NO cierres estas ventanas mientras uses el sistema" -ForegroundColor Yellow
Write-Host ""

# Iniciar backend en una nueva ventana
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'BACKEND - Oficina Epo' -ForegroundColor Cyan; npm run dev"

# Esperar 3 segundos para que el backend inicie
Start-Sleep -Seconds 3

# Iniciar frontend en una nueva ventana
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'FRONTEND - Oficina Epo' -ForegroundColor Cyan; npm run dev"

Write-Host "✓ Servidores iniciados" -ForegroundColor Green
Write-Host ""
Write-Host "Espera unos segundos y luego abre: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Para crear usuarios iniciales, ejecuta:" -ForegroundColor Yellow
Write-Host "  .\init-users.ps1" -ForegroundColor White
Write-Host ""
