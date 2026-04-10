$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $ScriptDir "..")

docker compose up --build -d
Write-Host "Prelegall is running at http://localhost:8000"
