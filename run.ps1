param(
  [switch]$NoInstall
)

$ErrorActionPreference = 'Stop'
$HERE = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $HERE

Write-Host "Ludikids • Dev Runner" -ForegroundColor Cyan

function Ensure-Node {
  try { node -v | Out-Null } catch { throw 'Node.js não encontrado. Instale em https://nodejs.org' }
  try { npm -v  | Out-Null } catch { throw 'npm não encontrado. Verifique sua instalação do Node.js' }
}

function Ensure-Deps {
  if ($NoInstall) { return }
  if (-not (Test-Path "$HERE/node_modules")) {
    if (Test-Path "$HERE/package-lock.json") { npm ci } else { npm i }
  }
}

function Ensure-Env {
  if (-not (Test-Path "$HERE/.env") -and (Test-Path "$HERE/.env.example")) {
    Copy-Item "$HERE/.env.example" "$HERE/.env"
  }
  if (-not $env:VITE_WS_URL) { $env:VITE_WS_URL = 'ws://localhost:8787' }
  if (-not $env:VITE_ADMIN_MODE) { $env:VITE_ADMIN_MODE = 'true' }
  if (-not $env:WS_ORIGINS) { $env:WS_ORIGINS = 'http://localhost:5173' }
  if (-not $env:ADMIN_KEY) { $env:ADMIN_KEY = 'dev-admin' }
}

Ensure-Node
Ensure-Deps
Ensure-Env

Write-Host "Iniciando servidor de chat + Vite..." -ForegroundColor Yellow
npm run dev:all

