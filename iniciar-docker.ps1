param(
  [switch]$Gpu,
  [string]$Model
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$composeFile = Join-Path $projectRoot 'docker-compose.yml'
$rootEnvFile = Join-Path $projectRoot '.env'
$nestEnvFile = Join-Path $projectRoot 'backend\nest\.env'

function Get-EnvValue {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Name
  )

  if (-not (Test-Path $Path)) {
    return $null
  }

  $match = Select-String -Path $Path -Pattern "^\s*$([Regex]::Escape($Name))\s*=\s*(.*)$" | Select-Object -First 1
  if (-not $match) {
    return $null
  }

  return $match.Matches[0].Groups[1].Value.Trim()
}

function Ensure-EnvVariable {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$DefaultValue
  )

  if (-not (Test-Path $Path)) {
    throw "No existe el archivo requerido: $Path"
  }

  $exists = Select-String -Path $Path -Pattern "^\s*$([Regex]::Escape($Name))\s*=" -Quiet
  if (-not $exists) {
    Add-Content -Path $Path -Value "`n$Name=$DefaultValue"
    Write-Host "[env] Se agrego $Name en $(Split-Path -Leaf $Path)" -ForegroundColor Yellow
  }
}

function Assert-RequiredEnvVariables {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string[]]$Names
  )

  $missing = @()
  foreach ($name in $Names) {
    $exists = Select-String -Path $Path -Pattern "^\s*$([Regex]::Escape($name))\s*=" -Quiet
    if (-not $exists) {
      $missing += $name
    }
  }

  if ($missing.Count -gt 0) {
    throw "Faltan variables en .env: $($missing -join ', ')"
  }
}

if (-not (Test-Path $composeFile)) {
  throw "No se encontro docker-compose.yml en $projectRoot"
}

if (-not (Test-Path $rootEnvFile)) {
  throw "No se encontro .env en la raiz del proyecto: $rootEnvFile"
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw 'Docker no esta instalado o no esta en PATH.'
}

Write-Host 'Validando variables requeridas de Docker Compose...' -ForegroundColor Cyan
Assert-RequiredEnvVariables -Path $rootEnvFile -Names @(
  'POSTGRES_IMAGE',
  'MONGO_INITDB_ROOT_USERNAME',
  'MONGO_INITDB_ROOT_PASSWORD',
  'MONGO_PORT',
  'RABBITMQ_DEFAULT_USER',
  'RABBITMQ_DEFAULT_PASS',
  'RABBITMQ_DEFAULT_VHOST',
  'RABBITMQ_PORT',
  'RABBITMQ_MANAGEMENT_PORT'
)

$resolvedModel = $Model
if ([string]::IsNullOrWhiteSpace($resolvedModel)) {
  $resolvedModel = Get-EnvValue -Path $rootEnvFile -Name 'OLLAMA_MODEL'
}
if ([string]::IsNullOrWhiteSpace($resolvedModel)) {
  $resolvedModel = 'qwen2.5:3b'
}

$resolvedBaseUrl = Get-EnvValue -Path $rootEnvFile -Name 'OLLAMA_BASE_URL'
if ([string]::IsNullOrWhiteSpace($resolvedBaseUrl)) {
  $resolvedBaseUrl = 'http://ollama:11434'
}

Ensure-EnvVariable -Path $rootEnvFile -Name 'OLLAMA_MODEL' -DefaultValue $resolvedModel
Ensure-EnvVariable -Path $rootEnvFile -Name 'OLLAMA_BASE_URL' -DefaultValue $resolvedBaseUrl
Ensure-EnvVariable -Path $rootEnvFile -Name 'OLLAMA_ENABLED' -DefaultValue 'true'

if (Test-Path $nestEnvFile) {
  Ensure-EnvVariable -Path $nestEnvFile -Name 'OLLAMA_MODEL' -DefaultValue $resolvedModel
  Ensure-EnvVariable -Path $nestEnvFile -Name 'OLLAMA_BASE_URL' -DefaultValue 'http://ollama:11434'
  Ensure-EnvVariable -Path $nestEnvFile -Name 'OLLAMA_ENABLED' -DefaultValue 'true'
}

$env:OLLAMA_MODEL = $resolvedModel

if ($Gpu) {
  $env:OLLAMA_BASE_URL = 'http://ollama-gpu:11434'
  Write-Host "Modo GPU habilitado. OLLAMA_BASE_URL=$($env:OLLAMA_BASE_URL)" -ForegroundColor Green
} else {
  $env:OLLAMA_BASE_URL = $resolvedBaseUrl
  Write-Host "Modo CPU habilitado. OLLAMA_BASE_URL=$($env:OLLAMA_BASE_URL)" -ForegroundColor Green
}

Set-Location $projectRoot

Write-Host 'Validando docker-compose.yml...' -ForegroundColor Cyan
& docker compose -f $composeFile config -q
if ($LASTEXITCODE -ne 0) {
  throw 'docker compose config -q fallo. Revisa docker-compose.yml'
}

if ($Gpu) {
  Write-Host 'Levantando stack con perfil GPU...' -ForegroundColor Cyan
  & docker compose -f $composeFile --profile gpu up -d --build --scale ollama=0
} else {
  Write-Host 'Levantando stack en modo normal (CPU)...' -ForegroundColor Cyan
  & docker compose -f $composeFile up -d --build
}

if ($LASTEXITCODE -ne 0) {
  throw 'Fallo al levantar contenedores con docker compose up.'
}

Write-Host ''
Write-Host 'Sistema levantado correctamente.' -ForegroundColor Green
if ($Gpu) {
  Write-Host 'Ver logs de IA: docker compose logs -f ollama-gpu nest-notifications' -ForegroundColor DarkCyan
} else {
  Write-Host 'Ver logs de IA: docker compose logs -f ollama nest-notifications' -ForegroundColor DarkCyan
}