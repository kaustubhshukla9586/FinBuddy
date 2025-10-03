$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

$venvPython = Join-Path $projectRoot ".venv\Scripts\python.exe"

if (-Not (Test-Path $venvPython)) {
  Write-Host "Creating virtual environment (.venv)..."
  & py -3 -m venv .venv
}

Write-Host "Upgrading pip..."
& $venvPython -m pip install --upgrade pip | Out-Host

Write-Host "Installing dependencies..."
& $venvPython -m pip install Django==5.2.6 | Out-Host

Write-Host "Applying migrations..."
& $venvPython manage.py migrate --noinput | Out-Host

Write-Host "Starting development server on http://localhost:8000 ..."
& $venvPython manage.py runserver 0.0.0.0:8000



