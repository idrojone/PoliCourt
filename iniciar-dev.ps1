# =====================================================================
# Script para iniciar PoliCourt
# =====================================================================

Write-Host "Iniciando entorno escalonadamente (Resolviendo conflicto WT/PS)..." -ForegroundColor Cyan

# 1. Obtenemos la ruta actual
$basePath = (Get-Location).Path

# 2. Rutas limpias
$backendPath = Join-Path $basePath "backend\policourt-backend"
$fastapiPath = Join-Path $basePath "backend\fastapi"
$nestPath = Join-Path $basePath "backend\nest"
$frontendPath = Join-Path $basePath "frontend"

$wtArgs = "new-tab -d `"$backendPath`" powershell -ExecutionPolicy Bypass -NoExit -Command `"code . \; Start-Sleep -Seconds 2 \; .\start-server.ps1`" ; " +
"new-tab -d `"$fastapiPath`" powershell -ExecutionPolicy Bypass -NoExit -Command `"code . \; Start-Sleep -Seconds 2 \; .\venv\Scripts\Activate.ps1 \; uvicorn app.main:app --host 0.0.0.0 --port 4003 --reload`" ; " +
"new-tab -d `"$nestPath`" powershell -ExecutionPolicy Bypass -NoExit -Command `"code . \; Start-Sleep -Seconds 3 \; pnpm start:dev api-gateway`" ; " +
"split-pane -V -d `"$nestPath`" powershell -ExecutionPolicy Bypass -NoExit -Command `"Start-Sleep -Seconds 5 \; pnpm start:dev notifications`" ; " +
"split-pane -H -d `"$nestPath`" powershell -ExecutionPolicy Bypass -NoExit -Command `"Start-Sleep -Seconds 7 \; pnpm start:dev request-monitor`" ; " +
"move-focus left ; " +
"split-pane -H -d `"$nestPath`" powershell -ExecutionPolicy Bypass -NoExit ; " +
"new-tab -d `"$frontendPath`" powershell -ExecutionPolicy Bypass -NoExit -Command `"code . \; Start-Sleep -Seconds 4 \; bun dev`""

# 4. Lanzamos Windows Terminal
Start-Process wt.exe -ArgumentList $wtArgs