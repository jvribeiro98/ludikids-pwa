$ErrorActionPreference = 'Stop'
$HERE = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $HERE

Write-Host "Ludikids • Build Runner" -ForegroundColor Cyan

if (-not (Test-Path "$HERE/node_modules")) {
  if (Test-Path "$HERE/package-lock.json") { npm ci } else { npm i }
}

if (Test-Path dist) { Remove-Item -Recurse -Force dist }
if (Test-Path .vite) { Remove-Item -Recurse -Force .vite }
if (Test-Path node_modules/.vite) { Remove-Item -Recurse -Force node_modules/.vite }

npm run build
Write-Host "Build concluído. Para visualizar: npm run preview" -ForegroundColor Green

